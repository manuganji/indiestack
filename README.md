# explorer
Vercel Platforms based Next.js project to build and maintain multiple apps out of a single codebase

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about the architecture, take a look at the following resources:

- [Vercel Platforms](https://vercel.com/platforms) - deploying multi tenant apps with Next.js and Vercel
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## Vercel Postgres

A note on edge environments

In edge environments, IO connections cannot be reused between requests. To allow your Pools to continue to function, we set maxUses to 1 when running on the edge (otherwise the Pool might hold on to a Client used in one request and try to use it again in another). Unfortunately, this means the Pool also can't reuse the connection within the request. For this reason, if you're firing more than one database query to serve a single request in your app, we recommend obtaining a Client from Pool.connect, using that Client to query the database, and then releasing it.
