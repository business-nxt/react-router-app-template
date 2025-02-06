import type {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "react-router";

import { authenticator } from "~/.server/services/auth";

export const action: ActionFunction = (ctx: ActionFunctionArgs) => loader(ctx);

export async function loader(ctx: LoaderFunctionArgs) {
  const { request } = ctx;
  await authenticator(ctx).authenticate(`visma-connect`, request);
}
