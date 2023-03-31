import Head from "next/head";
import { TwoColumnLayout } from "../../src/components";
import { GetServerSideProps } from "next";

const AnalyticsHolders = () => {
  return (
    <>
      <Head>
        <title>Analytics | Holders</title>
      </Head>
      <div>TODO: Holders Breakdown</div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (): Promise<{
  props;
}> => {
  return {
    props: {},
  };
};

export default AnalyticsHolders;

AnalyticsHolders.getLayout = (page, props) => (
  <TwoColumnLayout {...props}>{page}</TwoColumnLayout>
);
