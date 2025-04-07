import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./schema.graphql",
  documents: "app/queries/*.ts",
  ignoreNoDocuments: true,
  generates: {
    "app/gql/": {
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
