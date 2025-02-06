import { redirect, type LoaderFunctionArgs } from "react-router";
import { destroySession } from "~/.server/services/session";

export async function loader(ctx: LoaderFunctionArgs) {
  return redirect("/auth/login", {
    headers: {
      "set-cookie": await destroySession(ctx),
    },
  });
}
