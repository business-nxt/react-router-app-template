// app/services/session.server.ts

import {
  createCookieSessionStorage,
  type LoaderFunctionArgs,
} from "react-router";

// export the whole sessionStorage object
export const createSessionStorage = (env: Env) =>
  createCookieSessionStorage({
    //kv: env.KV,
    cookie: {
      name: `__session`, // use any name you want here
      sameSite: "none", // this helps with CSRF
      path: `/`, // remember to add this so the cookie will work in all routes
      httpOnly: true, // for security reasons, make this cookie http only
      secrets: [env.REMIX_SESSION_SECRET!], // replace this with an actual secret
      secure: true,
      maxAge: 24 * 60 * 60 * 180, // 180 days
    },
  });

export async function getSession(context: LoaderFunctionArgs) {
  return await createSessionStorage(context.context.cloudflare.env).getSession(
    context.request.headers.get("Cookie")
  );
}

export async function destroySession(context: LoaderFunctionArgs) {
  const session = await getSession(context);
  return await createSessionStorage(
    context.context.cloudflare.env
  ).destroySession(session);
}

export async function updateSession(context: LoaderFunctionArgs, session: any) {
  const currentSession = await getSession(context);
  return await createSessionStorage(
    context.context.cloudflare.env
  ).commitSession({
    ...currentSession,
    ...session,
  });
}

export async function commitSession(context: LoaderFunctionArgs, session: any) {
  return await createSessionStorage(
    context.context.cloudflare.env
  ).commitSession(session);
}
