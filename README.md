## Blockin Quickstart Repo

Welcome to the Blockin Quickstart Repo! This repository is a quickstart frontend / backend example repository to get started using Blockin. The pages/api folder is for your backend. Everything else is for your frontend. The backend and frontend should be completely decoupled with no overlap.

Note that this implementation uses one ChainDriver implementation for Algorand and one for Ethereum. The Algorand one uses WalletConnect, AlgoSDK, and PureStake API. The Ethereum one is built for Moralis and Metamask.

The authorizing resource's backend is simulated in src/pages/api. For an actual implementation, this API should be hosted elsewhere, but it is done like this for convenience purposes using Next.js. Here, we make use of local secrets using process.env variables defined in the .env file. Anything not in this api folder should never use the Blockin library.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, you will need to create a .env file with a sample passphrase and all valid API links and secrets. An example is provided at .env.example.

Second, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
