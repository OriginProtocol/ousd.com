import Head from "next/head";
import React from "react";
import transformLinks from "../src/utils/transformLinks";
import Footer from "../src/components/Footer";
import {
  GovernanceIntro,
  GovernanceProcess,
  StepByStep,
  Calculator,
} from "../src/governance/sections";
import { Header } from "@originprotocol/origin-storybook";
import { fetchAPI } from "../lib/api";
import { Link } from "../src/types";
import {
  fetchContributorsFromRepos,
  fetchImprovementProposals,
  fetchVoterCount,
} from "../src/governance/utils";
import { GetStaticProps } from "next";

const overrideCss = "bg-origin-bg-grey";

interface GovernanceProps {
  navLinks: Link[];
  holderCount: number;
  contributorCount: number;
  improvementProposalCount: number;
}

const GovernanceInfo = ({
  navLinks,
  holderCount,
  contributorCount,

  improvementProposalCount,
}: GovernanceProps) => {
  return (
    <>
      <Head>
        <title>Governance</title>
      </Head>

      <div className={overrideCss}>
        <Header mappedLinks={navLinks} webProperty="defi" />
      </div>

      {/* Introduction */}
      <GovernanceIntro
        sectionOverrideCss={overrideCss}
        holderCount={holderCount}
        contributorCount={contributorCount}
        improvementProposalCount={improvementProposalCount}
      />

      {/* Governance Process */}
      <GovernanceProcess sectionOverrideCss={overrideCss} />

      {/* Step by step instructions on governance */}
      <StepByStep sectionOverrideCss={overrideCss} />

      {/* OGV to veOGV Calculator */}
      <Calculator sectionOverrideCss={overrideCss} />

      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({
  locale,
}): Promise<
  | {
      props: GovernanceProps;
      revalidate: number;
    }
  | { notFound: true }
> => {
  if (locale !== "en") {
    return {
      notFound: true,
    };
  }

  const navResPromise = fetchAPI("/ousd-nav-links", {
    populate: {
      links: {
        populate: "*",
      },
    },
  });

  const holderCountPromise = fetchVoterCount();
  const contributorsPromise = fetchContributorsFromRepos();
  const improvementProposalCountPromise = fetchImprovementProposals();

  const [navRes, holderCount, contributors, improvementProposalCount] =
    await Promise.all([
      navResPromise,
      holderCountPromise,
      contributorsPromise,
      improvementProposalCountPromise,
    ]);

  const navLinks: Link[] = transformLinks(navRes.data) as Link[];

  return {
    props: {
      navLinks,
      holderCount,
      contributorCount: contributors.length,
      improvementProposalCount,
    },
    revalidate: 300,
  };
};

export default GovernanceInfo;
