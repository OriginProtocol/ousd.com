import App from "next/app"
import Head from "next/head"
import React, { createContext, useEffect } from "react"
import { useRouter } from "next/router"
import { fetchAPI } from "../lib/api"
import { getStrapiMedia } from "../lib/media"
import bundledCss from "@originprotocol/origin-storybook/lib/styles.css"
import "../styles/globals.css"
import { QueryClient, QueryClientProvider } from "react-query"
import Contracts from '../src/components/Contracts'
import Script from 'next/script'
import { GTM_ID, pageview } from '../lib/gtm'

const queryClient = new QueryClient()
export const GlobalContext = createContext({})

const MyApp = ({ Component, pageProps }) => {
  const { global } = pageProps
  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeComplete', pageview)
    return () => {
      router.events.off('routeChangeComplete', pageview)
    }
  }, [router.events])

  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          href={getStrapiMedia(global?.attributes?.favicon)}
        />
      </Head>
      <GlobalContext.Provider value={global?.attributes}>
        <QueryClientProvider client={queryClient}>
          <Contracts />
          <Script
            id="gtag-base"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer', '${GTM_ID}');
              `,
            }}
          />
          <Component {...pageProps} />
        </QueryClientProvider>
      </GlobalContext.Provider>
    </>
  )
}

// getInitialProps disables automatic static optimization for pages that don't
// have getStaticProps. So article, category and home pages still get SSG.
// Hopefully we can replace this with getStaticProps once this issue is fixed:
// https://github.com/vercel/next.js/discussions/10949
MyApp.getInitialProps = async (ctx) => {
  // Calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(ctx)

  // Fetch global site settings from Strapi
  const globalRes = await fetchAPI("/global", {
    populate: {
      favicon: "*",
      defaultSeo: {
        populate: "*",
      },
    },
  })

  // Pass the data to our page via props
  return {
    ...appProps,
    pageProps: { global: globalRes?.data },
    styles: [
      process.env.NODE_ENV === "production" ? (
        <style
          key="custom"
          dangerouslySetInnerHTML={{
            __html: bundledCss,
          }}
        />
      ) : (
        <></>
      ),
    ],
  }
}

export default MyApp
