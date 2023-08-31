# SvelteKit for Indie Hackers

This is a reference repo for Svelte Kit projects. It's inspired from vercel/platforms with some changes to be simpler.

## Components

- [x] SvelteKit
- [ ] TailwindCSS
- [ ] Zapatos
- [ ] Neon
- [x] SvelteKit Adapter for Vercel
- [ ] `node-pg-migrate` for database migrations
- [x] `pnpm` for package management
- [ ] `dotenv` for environment variables

## Get Started

    - Clone this project to your local machine
    - Run `pnpm i` to install dependencies
    
## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

Confirm the `regions` setting inside [adapter](https://kit.svelte.dev/docs/adapter-vercel)
    