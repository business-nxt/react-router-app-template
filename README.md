# Getting started with Business NXT Apps

This is a starter template for making apps for Business NXT, using React Router and hosted on Cloudflare.

Create a new React Router project by running the following command:

```bash
npx create-react-router@latest --template business-nxt/react-router-app-template
```

## Visma Connect setup

Head over to [the Visma Developer Portal](https://oauth.developers.visma.com/service-registry/) and create a new web application. Set the client id and secret in the `.dev.vars`-file. You also need to set the `REMIX_SESSION_SECRET`.

```env
REMIX_SESSION_SECRET="really secret"
VISMA_CLIENT_ID=""
VISMA_CLIENT_SECRET=""
```

During development you can use the redirect URI `https://app.localtest.me:5173/auth/visma-connect/callback`.

- Set Grant Type to `Authorization Code with PKCE`
- Enable Offline Access
- Do NOT enable `ID token returned in front-channel (Hybrid Flow)`
- Set a sane refresh token expiry (365 days is cool!)

## Components

This project is using the [shadcn/ui](https://ui.shadcn.com/docs/components) component library.

## GraphQL Queries

If you want to use `graphql-request`, create a folder in app called 'queries` and put your files in there. When you've changed a GraphQL-query you have to update the generated files. Use the script codegen for this.

```bash
pnpm codegen
```

## Development APP url

The following urls are valid for local development:

- https://apps.bnxt.dev/localtest-5173/ (Embeds https://app.localtest.me:5173)
- https://apps.bnxt.dev/localtest-3002/ (Embeds https://app.localtest.me:3002)

## Production

In order to publish your app in production, send the URL you want published to [ole at on-it.no](mailto:ole@on-it.no?subject=Business NXT Apps Publishing Request)

## Known issues

### Self signed certificate

Since the certificate you are using is self signed, you have to visit the site without an iframe to make it work the first time.

### You get the error 'UserError: The directory specified by the "assets.directory" field in your configuration file does not exist:' when running `npm run dev`

There's a bug in the cloudflare miniflare plugin for vite. Create the directory build/client and it should work.
