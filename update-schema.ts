import { loadSchema } from "@graphql-tools/load";
import { LoadFromUrlOptions, UrlLoader } from "@graphql-tools/url-loader";
import { printSchema } from "graphql";
import * as fs from "fs";

async function create_visma_token() {
  const client_id = process.env.VISMA_CLIENT_ID;
  const client_secret = process.env.VISMA_CLIENT_SECRET;
  // use client credentials on the token endpoint to get an access token. domain: connect.visma.com
  const token_endpoint = "https://connect.visma.com/connect/token";
  const scope = "business-graphql-service-api:access-group-based";
  const grant_type = "client_credentials";
  const body = `client_id=${client_id}&client_secret=${client_secret}&scope=${scope}&grant_type=${grant_type}`;
  const fetchResult = await fetch(token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  });
  const json = await fetchResult.json();
  return json.access_token;
}

async function main() {
  const start = Date.now();
  const loader = new UrlLoader();

  const access_token = await create_visma_token();
  console.log("Token aquired from Visma at", Date.now() - start, "ms");

  const options: LoadFromUrlOptions = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };

  const schema = await loadSchema(
    "https://business.visma.net/api/graphql-service",
    { loaders: [loader], ...options }
  );

  if (schema == null) {
    console.log("Schema is null");
    return;
  }

  console.log("Schema loaded at", Date.now() - start, "ms");

  const printed = printSchema(schema);
  fs.writeFileSync("schema.graphql", printed);
  console.log("Wrote schema to file at", Date.now() - start, "ms");
}
main();
