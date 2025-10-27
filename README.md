# Getting started with Business NXT Apps

This is a starter template for making apps for Business NXT, using React Router and hosted on Cloudflare.

Create a new React Router project by running the following command:

```bash
npx create-react-router@latest --template business-nxt/react-router-app-template
```

## Visma Connect setup

Head over to [the Visma Developer Portal](https://oauth.developers.visma.com/service-registry/) and create a new web application. Set the client id and secret in the `.dev.vars`-file. You also need to set the `SESSION_SECRET`.

```json
{
  "SESSION_SECRET": "really secret",
  "VISMA_CLIENT_ID": "",
  "VISMA_CLIENT_SECRET": ""
}
```

During development you can use the redirect URI `https://app.localtest.me:5173/auth/visma-connect/callback`.

- Set Visma Selection first (this is what I always talk about first!)
- Set Grant Type to `Authorization Code with PKCE`
- Enable Offline Access
- Do **NOT** enable `ID token returned in front-channel (Hybrid Flow)`
- Set a sane refresh token expiry (365 days is cool!)

## UI Components

This project uses the [Visma Gaia Design System](https://www.npmjs.com/package/@vsn-ux/gaia-styles) with **Tailwind CSS v4**.

### Gaia Styles

All UI components follow the Visma Gaia design system and use Gaia's design tokens, base styles, and component patterns. The Gaia styles are imported in `app/app.css`:

```css
@import '@vsn-ux/gaia-styles/tailwindcss';
```

### Available Components

The following React components are available in `app/components/ui/`:

- **Button** - Primary, secondary, ghost, and transparent variants
- **Badge** - Text and dot sizes with semantic color variants (information, success, warning, error)
- **Card** - Selectable and selected states
- **Alert** - Notification component with information, success, warning, and error variants
- **Input** - Text input with validation states (invalid, success)
- **Textarea** - Multi-line text input with validation
- **Checkbox** - Checkbox with label and invalid state
- **Radio** - Radio button with label support
- **Switch** - Toggle switch with label
- **Progress** - Progress bar with success/error variants and indeterminate state
- **Avatar** - User avatar with small, default, and large sizes
- **Tabs** - Horizontal and vertical tabs with keyline support
- **Tooltip** - Tooltips with positioning and optional title

### Component Showcase

Visit `/components` to see all available components with live examples and different states.

### Adding Components

Components are based on the [shadcn/ui](https://ui.shadcn.com/docs/components) structure but adapted to use Gaia styles. To add a new component:

1. Install the base component: `npx shadcn@latest add <component-name>`
2. Adapt the component to use Gaia CSS classes (following the BEM pattern: `ga-component`, `ga-component--variant`, `ga-component__element`)
3. Reference the Gaia style files in `node_modules/@vsn-ux/gaia-styles/src/styles/components/`

## GraphQL Queries

If you want to use `graphql-request`, create a folder in app called 'queries` and put your files in there. When you've changed a GraphQL-query you have to update the generated files. Use the script codegen for this.

```bash
npm run codegen
```

## Development APP url

The following urls are valid for local development:

- <https://apps.bnxt.dev/localtest-5173/> (Embeds <https://app.localtest.me:5173>)
- <https://apps.bnxt.dev/localtest-3002/> (Embeds <https://app.localtest.me:3002>)

## Production

In order to publish your app in production, send the URL you want published to [ole at on-it.no](mailto:ole@on-it.no?subject=Business%20NXT%20Apps%20Publishing%20Request)

## Known issues

### Self signed certificate

Since the certificate you are using is self signed, you have to visit the site without an iframe to make it work the first time.

### You get the error 'UserError: The directory specified by the "assets.directory" field in your configuration file does not exist:' when running `npm run dev`

There's a bug in the cloudflare miniflare plugin for vite. Create the directory build/client and it should work.
