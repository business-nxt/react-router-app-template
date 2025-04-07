import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./schema.graphql",
  documents: ["app/queries/*.ts", "app/queries/*.tsx", "app/queries/*.graphql"],
  ignoreNoDocuments: true,
  generates: {
    "app/gql/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
      config: {
        onlyOperationTypes: true,
        rawRequest: false,
        preResolveTypes: true,
        skipTypename: true,
        skipDocumentsValidation: true,
        addInfiniteQuery: false,
        documentMode: "documentNode",
      },
    },
  },
};

export default config;
