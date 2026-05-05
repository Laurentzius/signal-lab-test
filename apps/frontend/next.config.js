const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
};

module.exports = withSentryConfig(nextConfig, {
  org: "abeba-na",
  project: "javascript-nextjs",
  silent: true,
  widenClientFileUpload: true,
});
