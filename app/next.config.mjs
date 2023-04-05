import { env } from "./src/env/server.mjs";
import withPWA from "next-pwa";

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
    return config;
}

export default defineNextConfig(
    withPWA({
        dest: "public",
        register: true,
        skipWaiting: true,
        disable: process.env.NODE_ENV === "development",
    })({
        reactStrictMode: true,
        swcMinify: true,
        // Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
        i18n: {
            locales: ["en"],
            defaultLocale: "en",
        },
        images: {
            remotePatterns: [
                {
                    protocol: "https",
                    hostname: "roommate-budget-helper.s3.amazonaws.com",
                },
            ],
        },
        output: "standalone",
    })
);
