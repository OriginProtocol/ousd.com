import Head from "next/head";
import React from "react";
import transformLinks from "../src/utils/transformLinks";
import { Link } from "../src/types";
import { Header } from "@originprotocol/origin-storybook";
import { fetchAPI } from "../lib/api";
import { ContentIntro, Title } from "../src/litepaper/sections";
import Footer from "../src/components/Footer";

interface LitepaperProps {
  navLinks: Link[];
}

const Litepaper = ({ navLinks }: LitepaperProps) => {
  return (
    <>
      <Head>
        <title>Litepaper</title>
      </Head>
      <Header mappedLinks={navLinks} webProperty="ousd" />

      {/* Page title */}
      <Title />

      {/* Table of contents and Litepaper image */}
      <ContentIntro />

      <Footer locale={null} />
    </>
  );
};

export const getStaticProps = async (): Promise<{ props: LitepaperProps }> => {
  const navRes = await fetchAPI("/ousd-nav-links", {
    populate: {
      links: {
        populate: "*",
      },
    },
  });

  const navLinks: Link[] = transformLinks(navRes.data) as Link[];
  return {
    props: {
      navLinks,
    },
  };
};

export default Litepaper;
