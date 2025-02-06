import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { destroySession } from "~/.server/services/session";

export async function loader(ctx: LoaderFunctionArgs) {
  const cookie = await destroySession(ctx);
  return redirect("/", {
    headers: { "Set-Cookie": cookie },
  });
}

export async function action(ctx: ActionFunctionArgs) {
  if (ctx.request.url.includes("ajax")) {
    return Response.json(
      { message: "Logged out" },
      {
        status: 200,
        headers: { "Set-Cookie": await destroySession(ctx) },
      }
    );
  }
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(ctx),
    },
  });
}
