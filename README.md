# Open Source Serverless Tech Stack for Indie Hackers

This is a reference repo based on Next.js.

## Components

- [x] Next.js
- [x] TailwindCSS
- [x] Zapatos
- [x] Postgres
- [x] `node-pg-migrate` for database migrations. `dotenv` is needed for environment variables to work.
- [x] `pnpm` for package management
- [ ] `@upstash/qstash` for queue

## Get Started

    - Clone this project to your local machine
    - Run `pnpm i` to install dependencies
    - Copy over `.env.example` to `.env` and fill in the values
    
## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app to the cloud, check out [Next.js deployment documentation](https://nextjs.org/docs/deployment).
    
## Inspiration

- [vercel/platforms](https://github.com/vercel/platforms)


## Settings

Read through `.env.example` for basic settings.