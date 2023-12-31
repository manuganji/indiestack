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

## Exploiting Next.js Data Cache and React `cache`

Public `layout` doesn't make any user specific requests. But `(app)/layout` does. This composition can be reused elsewhere in the folder structure too.

## Inspiration

- [vercel/platforms](https://github.com/vercel/platforms)

## Settings

Read through `.env.example` for basic settings.

## Forms

Create a `jsonschema` and register it in `ajvSetup.ts`. The component `DeclarativeForm` defined in `@/components/forms/index` will use it to validate the data (via a server action) before triggering the `onSubmit` function.

### Property Level Settings

Defined in properties.settings.

Steps to introduce a new setting:

- Update schema in schemas
- Update the type in zapatos/custom/PgPropertySettings.d.ts
