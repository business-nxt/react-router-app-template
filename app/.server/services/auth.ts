import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Authenticator } from "remix-auth";
import { CodeChallengeMethod, OAuth2Strategy } from "remix-auth-oauth2";
import { commitSession, getSession } from "~/.server/services/session";
import { invariant } from "~/utils/invariant";

export type UserInfo = {
  sub: string;
  email: string;
  email_verified: boolean;
  locale: string;
  name: string;
  given_name: string;
  family_name: string;
  created_at: number;
  updated_at: number;
  picture: string;
  access_token: string;
  expires_at: number;
};

export interface VismaExtraParams extends Record<string, string | number> {
  id_token: string;
  scope: string;
  expires_in: number;
  token_type: `Bearer`;
}

export interface VismaStrategyOptions {
  clientID: string;
  clientSecret: string;
  scope?: string;
  callbackURL: string;
}

export async function getUser(
  context: LoaderFunctionArgs | ActionFunctionArgs
) {
  const session = await getSession(context);
  const user = session.data?.user;
  return user;
}

export const authenticator = (
  context: LoaderFunctionArgs | ActionFunctionArgs
) => {
  const { request } = context;
  const env = context.context.cloudflare.env;
  const auth = new Authenticator<UserInfo>();
  const callback_url = new URL(request.url);
  callback_url.pathname = `/auth/visma-connect/callback`;
  callback_url.protocol = "https";
  callback_url.search = ``;
  invariant(env.VISMA_CLIENT_ID, `Missing VISMA_CLIENT_ID`);
  invariant(env.VISMA_CLIENT_SECRET, `Missing VISMA_CLIENT_SECRET`);
  auth.use(
    new VismaStrategy({
      clientID: env.VISMA_CLIENT_ID,
      clientSecret: env.VISMA_CLIENT_SECRET,
      callbackURL: callback_url.toString(),
      scope:
        "openid profile email offline_access business-graphql-api:access-group-based",
    }),
    `visma-connect`
  );
  return auth;
};

export class VismaStrategy extends OAuth2Strategy<UserInfo> {
  constructor(options: VismaStrategyOptions) {
    // And we pass the options to the super constructor using our own options
    // to generate them, this was we can ask less configuration to the developer
    // using our strategy
    super(
      {
        authorizationEndpoint: `https://connect.visma.com/connect/authorize`,
        tokenEndpoint: `https://connect.visma.com/connect/token`,
        clientId: options.clientID,
        clientSecret: options.clientSecret,
        redirectURI: options.callbackURL,
        scopes: options.scope?.split(" ") ?? [],
        codeChallengeMethod: CodeChallengeMethod.S256,
        tokenRevocationEndpoint: `https://connect.visma.com/connect/revoke`,
      },
      async (data) => {
        const searchParams = new URL(data.request.url).searchParams;
        console.log("VERIFYING", data);
        const accessToken = data.tokens.accessToken();
        const refreshToken = data.tokens.refreshToken();
        try {
          const user = await getUserInfo(accessToken);
          const session_state = searchParams.get("session_state");
          const expires_at = data.tokens.accessTokenExpiresAt().getTime();
          return {
            ...user,
            access_token: accessToken,
            refresh_token: refreshToken,
            session_state,
            expires_at,
          };
        } catch (ex) {
          console.log("ERROR LOGGING IN", ex);
          throw new Error("Error logging in");
        }
      }
    );
  }
}

async function getUserInfo(access_token: string) {
  const response = await fetch(`https://connect.visma.com/connect/userinfo`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).then((res) => res.json<UserInfo>());
  return response;
}

export async function getUserWithAccessToken(
  context: LoaderFunctionArgs | ActionFunctionArgs
) {
  const session = await getSession(context);
  const user = (session.get("user") as UserInfo) ?? null;
  if (tokenIsExpired(user)) {
    console.log("token expired", { user });
    const { update, cookie } = await refreshToken(context);
    if (update) {
      console.log("token refreshed");
      return {
        user: user as UserInfo,
        cookie,
      };
    } else {
      console.error("no refresh token");
      return {
        user: null,
        cookie: null,
      };
    }
  }
  return { user, cookie: null };
}

function tokenIsExpired(user: any) {
  return !user?.expires_at || user.expires_at - Date.now() < 5 * 60 * 1000;
}

export async function refreshToken(
  context: LoaderFunctionArgs | ActionFunctionArgs
) {
  const session = await getSession(context);
  let user = session.data?.user;
  const formData = new URLSearchParams();

  if (user?.refresh_token) {
    const env = context.context.cloudflare.env;
    formData.append(`client_id`, env.VISMA_CLIENT_ID ?? ``);
    formData.append(`client_secret`, env.VISMA_CLIENT_SECRET ?? ``);
    formData.append(`grant_type`, `refresh_token`);
    formData.append(`refresh_token`, user.refresh_token);
    const response = await fetch(`https://connect.visma.com/connect/token`, {
      method: `POST`,
      body: formData.toString(),
      headers: {
        "Content-Type": `application/x-www-form-urlencoded`,
      },
    });
    const responseJson = await response.json<any>();
    if (response.ok) {
      user = {
        ...user,
        access_token: responseJson.access_token,
        refresh_token: responseJson.refresh_token,
        expires_at: Number(responseJson.expires_in) * 1000 + Date.now(),
      };
      session.set("user", user);
      const cookie = await commitSession(context, session);
      return { update: user, cookie };
    } else {
      console.error(
        `Error refreshing token`,
        responseJson,
        response.status,
        response.statusText
      );
    }
  }
  return { update: null, cookie: null };
}
