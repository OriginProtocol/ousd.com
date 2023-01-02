const locales = require('./locales');
//const { withSentryConfig } = require('@sentry/nextjs');

const { STRAPI_API_URL, NEXT_PUBLIC_DAPP_URL, APP_ENV } = process.env

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true
  }
}

const dappPaths = [
  '/earn',
  '/wrap',
  '/signTransfer',
  '/stake',
  '/dashboard',
  '/history',
  '/pool/:pool_name*',
]

const dappRedirects = dappPaths.map(path => ({
  source: path,
  destination: `${NEXT_PUBLIC_DAPP_URL}${path}`,
  permanent: true
}))

const moduleExports = {
  ...nextConfig,
  reactStrictMode: true,
  images: {
    loader: "default",
    domains: ["localhost", "0.0.0.0", "cmsmediaproduction.s3.amazonaws.com", "cmsmediastaging.s3.amazonaws.com", "avatars.githubusercontent.com"],
  },
  i18n: {
    locales,
    defaultLocale: 'en',
  },
  staticPageGenerationTimeout: 120,
  /*sentry: {
    // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
    // for client-side builds. (This will be the default starting in
    // `@sentry/nextjs` version 8.0.0.) See
    // https://webpack.js.org/configuration/devtool/ and
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
    // for more information.
    hideSourceMaps: true,
  },*/
  async headers() {
    return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value:
                "frame-ancestors 'none'",
            },
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains'
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block'
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            {
              key: 'Cross-Origin-Opener-Policy-Report-Only',
              value: 'same-origin-allow-popups'
            }
          ],
        },
      ];
  },
  experimental: { images: { allowFutureImage: true } },
  async redirects() {
    return [
      ...dappRedirects,
      {
        source: '/swap',
        destination: `${NEXT_PUBLIC_DAPP_URL}`,
        permanent: true
      },
      {
        source: '/dapp',
        destination: `${NEXT_PUBLIC_DAPP_URL}`,
        permanent: true
      },
      {
        source: '/mint',
        destination: `${NEXT_PUBLIC_DAPP_URL}`,
        permanent: true
      },
      {
        source: '/earn-info',
        destination: `/`,
        permanent: true
      },
      {
        source: '/governance',
        destination: `/`,
        permanent: true
      }
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [{
        source: '/sitemap.xml',
        destination: `${STRAPI_API_URL}/api/ousd/sitemap`
      }, {
        source: '/robots.txt',
        destination: APP_ENV === 'prod' ? '/robots.prod.txt' : '/robots.staging.txt',
      }]
    }
  },
}

/*const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};*/

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
//module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
module.exports = withBundleAnalyzer(moduleExports)
