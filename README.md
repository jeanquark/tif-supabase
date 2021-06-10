This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
# install dependencies
npm install
# run in dev mode
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Supabase config

Run the following commands for local development:

```bash
supabase init
```
Specify '8000' as Supabase URL port. (Next is running on PORT 3000).

```bash
supabase start
```

Write down console displayed "Supabase URL" and "Supabase Key" (anon) in .env.local file.

When updating postgres table structures, be mindful of the impact on database replications (supabase admin) as well as on postgres trigger functions.

## Cron job

*/1 * * * * wget https://thisisfan.com/api/api-football/fetch-live-fixtures
0 30 * ? * * wget https://thisisfan.com/api/api-football/fetch-league-standing