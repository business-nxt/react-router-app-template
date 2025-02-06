import { redirect, type LoaderFunctionArgs } from "react-router";
import { authenticator } from "~/.server/services/auth";
import { commitSession, getSession } from "~/.server/services/session";

export const loader = async (ctx: LoaderFunctionArgs) => {
  const { provider } = ctx.params;
  if (!provider) {
    throw new Error("Provider not found");
  }
  try {
    const user = await authenticator(ctx).authenticate(provider, ctx.request);

    if (!user) {
      throw new Error("User not found");
    }
    const session = await getSession(ctx);
    session.set("user", user);
    return redirect("/auth/close", {
      status: 303,
      headers: {
        "Set-Cookie": await commitSession(ctx, session),
      },
    });
  } catch (ex) {
    console.error(ex);
    throw ex;
  }
};
