import Head from "next/head";
import React from "react";
import transformLinks from "../../src/utils/transformLinks";
import Error from "../404";
import { useRouter } from "next/router";
import { Header } from "@originprotocol/origin-storybook";
import {
  DayBasicData,
  DayDripperBanner,
} from "../../src/proof-of-yield/sections";
import { YieldOnDayProps } from "../../src/proof-of-yield/types";
import { GetServerSideProps } from "next";
import { fetchAPI } from "../../lib/api";
import Footer from "../../src/components/Footer";

const YieldOnDay = ({ navLinks }: YieldOnDayProps) => {
  const router = useRouter();
  let { timestamp } = router.query;

  const timestampNumber = Number(timestamp as any);

  if (Number.isNaN(timestampNumber)) return <Error navLinks={navLinks} />;

  return (
    <>
      <Head>
        <title>Proof of Yield</title>
      </Head>
      <Header mappedLinks={navLinks} webProperty="ousd" />

      <DayBasicData timestamp={timestampNumber} />

      <DayDripperBanner />

      <Footer locale={null} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (): Promise<{
  props: YieldOnDayProps;
}> => {
  const navRes = await fetchAPI("/ousd-nav-links", {
    populate: {
      links: {
        populate: "*",
      },
    },
  });

  const navLinks = transformLinks(navRes.data);
  return {
    props: {
      navLinks,
    },
  };
};

export default YieldOnDay;
