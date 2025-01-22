# Getting started with Business NXT Apps

This is a starter template for making apps for Business NXT, using React Router and hosted on Cloudflare.

Create a new React Router project by running the following command:

```bash
npx create-react-router@latest --template business-nxt/react-router-app-template
```

## Known issues

### You get the error 'UserError: The directory specified by the "assets.directory" field in your configuration file does not exist:' when running `npm run dev`

There's a bug in the cloudflare miniflare plugin for vite. Create the directory build/client and it should work.
