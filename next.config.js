/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        WC_PROJECT_ID: process.env.WC_PROJECT_ID,
        IS_DEMO: process.env.IS_DEMO,
    },
};

require('dotenv').config();

module.exports = nextConfig;
