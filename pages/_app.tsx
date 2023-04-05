import bundledCss from "@originprotocol/origin-storybook/lib/styles.css";
import "../styles/globals.css";
import Script from "next/script";
//@ts-ignore
import App from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { fetchAPI } from "../lib/api";
import { getStrapiMedia } from "../lib/media";
import { QueryClient, QueryClientProvider } from "react-query";
import { GTM_ID, pageview } from "../lib/gtm";
import transformLinks from "../src/utils/transformLinks";
import { useContracts, usePreviousRoute } from "../src/hooks";
import { createContext, useEffect } from "react";

const defaultQueryFn = async ({ queryKey }) => {
  return await fetch(queryKey).then((res) => res.json());
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

export const GlobalContext = createContext({
  defaultSeo: {},
  siteName: "",
});

const { provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()]
);

const wagmiClient = createClient({
  autoConnect: false,
  provider,
  webSocketProvider,
});

const MyApp = ({ Component, pageProps }) => {
  const { global } = pageProps;
  const router = useRouter();

  const getLayout = Component.getLayout || ((page) => page);

  usePreviousRoute();
  useContracts();

  useEffect(() => {
    router.events.on("routeChangeComplete", pageview);
    return () => {
      router.events.off("routeChangeComplete", pageview);
    };
  }, [router.events]);

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
          <WagmiConfig client={wagmiClient}>
            {getLayout(<Component {...pageProps} />, {
              links: pageProps?.navLinks,
              pathname: router.pathname,
            })}
          </WagmiConfig>
        </QueryClientProvider>
      </GlobalContext.Provider>
    </>
  );
};

MyApp.getInitialProps = async (ctx) => {
  const appProps = await App.getInitialProps(ctx);

  // Fetch global site settings from Strapi
  const [globalRes, navRes] = await Promise.all([
    fetchAPI("/global", {
      populate: {
        favicon: "*",
        defaultSeo: {
          populate: "*",
        },
      },
    }),
    fetchAPI("/ousd-nav-links", {
      populate: {
        links: {
          populate: "*",
        },
      },
    }),
  ]);

  const navLinks = transformLinks(navRes?.data);

  // Pass the data to our page via props
  return {
    ...appProps,
    pageProps: { global: globalRes?.data, navLinks },
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
