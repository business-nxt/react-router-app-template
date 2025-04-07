import { GraphQLClient } from "graphql-request";
import { getSdk } from "./graphql";

export const createGraphQLSDK = () => {
  const url = new URL("/api/graphql", window.location.href);
  const client = new GraphQLClient(url.toString(), {
    mode: "cors",
    credentials: "include",
    cache: "no-cache",
  });
  return getSdk(client);
};
