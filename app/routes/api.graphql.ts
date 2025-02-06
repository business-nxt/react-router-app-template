import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { getSession } from "~/.server/services/session";

export async function loader({ request }: LoaderFunctionArgs) {
  return redirect("https://docs.business.visma.net/graphiql/");
}

export async function action(context: ActionFunctionArgs) {
  const { request } = context;
  const headers = new Headers(request.headers);
  const session = await getSession(context);
  const user = session.get("user");

  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  headers.set("Authorization", `Bearer ${user.access_token}`);

  const response = await fetch("https://business.visma.net/api/graphql", {
    method: request.method,
    headers: {
      ...Object.fromEntries(headers),
      "Content-Type": "application/json",
    },
    body: request.body,
    // @ts-ignore - TS doesn't know about these properties
    duplex: "half",
  });

  const data = await response.json();

  return Response.json(data);
}
