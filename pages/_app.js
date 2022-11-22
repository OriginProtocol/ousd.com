import App from "next/app"
import Head from "next/head"
import React, { createContext, useEffect } from "react"
import { useRouter } from "next/router"
import { fetchAPI } from "../lib/api"
import { getStrapiMedia } from "../lib/media"
import "../styles/globals.css"
import bundledCss from "@originprotocol/origin-storybook/lib/styles.css"
import { QueryClient, QueryClientProvider } from "react-query"
import analytics from "../src/utils/analytics"
import { AnalyticsProvider } from "use-analytics"
import { setUserSource } from "../src/utils/user"

const queryClient = new QueryClient();
export const GlobalContext = createContext({});

const MyApp = ({ Component, pageProps }) => {
  const { global } = pageProps;
  const router = useRouter();

  const trackPageView = (url, lastURL) => {
    const data = {
      toURL: url,
    };

    if (lastURL) {
      data.fromURL = lastURL;
    }

    analytics.page(data);

    if (url.indexOf("?") > 0) {
      const searchParams = new URLSearchParams(
        url.substr(url.indexOf("?") + 1)
      );
      const utmSource = searchParams.get("utm_source");
      if (utmSource) {
        setUserSource(utmSource);
      }
    } else {
      /* if first page load is not equipped with the 'utm_source' we permanently mark
       * user source as unknown
       */
      setUserSource("unknown");
    }
  };

  useEffect(() => {
    let lastURL = window.location.pathname + window.location.search;

    // track initial page load
    trackPageView(lastURL);

    const handleRouteChange = (url) => {
      /* There is this weird behaviour with react router where `routeChangeComplete` gets triggered
       * on initial load only if URL contains search parameters. And without this check and search
       * parameters present the inital page view would be tracked twice.
       */
      if (url === lastURL) {
        return;
      }
      // track when user navigates to a new page
      trackPageView(url, lastURL);
      lastURL = url;
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

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
          <AnalyticsProvider instance={analytics}>
            <Component {...pageProps} />
          </AnalyticsProvider>
        </QueryClientProvider>
      </GlobalContext.Provider>
    </>
  );
};

// getInitialProps disables automatic static optimization for pages that don't
// have getStaticProps. So article, category and home pages still get SSG.
// Hopefully we can replace this with getStaticProps once this issue is fixed:
// https://github.com/vercel/next.js/discussions/10949
MyApp.getInitialProps = async (ctx) => {
  // Calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(ctx);

  // Fetch global site settings from Strapi
  const globalRes = await fetchAPI("/global", {
    populate: {
      favicon: "*",
      defaultSeo: {
        populate: "*",
      },
    },
  });

  // Pass the data to our page via props
  return {
    ...appProps,
    pageProps: { global: globalRes.data },
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
  };
};

export default MyApp;
