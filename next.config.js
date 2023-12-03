/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        WC_PROJECT_ID: process.env.WC_PROJECT_ID,
        IS_DEMO: process.env.IS_DEMO,
        CODEGEN_URL: process.env.CODEGEN_URL,
        BITBADGES_API_URL: process.env.BITBADGES_API_URL,
    },
};

require('dotenv').config();

module.exports = nextConfig;
