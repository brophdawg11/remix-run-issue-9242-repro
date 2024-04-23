# Welcome to Remix + Vite!

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/future/vite)
for details on supported features.

## Description

No BS Remix Express Template Starter (2024)

:)

## Tech stack

- Remix v2 + Express.js (For middleware support)
- Vite v5
- TypeScript
- TailwindCSS
- shadcn/ui (For UI/UX components)
- Drizzle ORM (Duh)
- Superbase (For DB/Auth)
- SST Ion (For deploying seamlessly to AWS/Cloudflare)

## Development

Run the Express server with Vite dev middleware:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Express applications you should be right at home. Just make sure to deploy the output
of `npm run build`

- `build/server`
- `build/client`
