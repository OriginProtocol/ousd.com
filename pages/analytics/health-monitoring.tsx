import { GetServerSideProps } from "next";
import { Typography } from "@originprotocol/origin-storybook";
import Head from "next/head";
import { LayoutBox, TwoColumnLayout } from "../../src/components";

const monitoring = {
  macro: [
    "https://ousd-dashboard.ogn.app/d-solo/0YIjaWh4z/main-dashboard?orgId=1&panelId=10",
    "https://ousd-dashboard.ogn.app/d-solo/0YIjaWh4z/main-dashboard?orgId=1&panelId=22",
    "https://ousd-dashboard.ogn.app/d-solo/0YIjaWh4z/main-dashboard?orgId=1&panelId=24",
    "https://ousd-dashboard.ogn.app/d-solo/0YIjaWh4z/main-dashboard?orgId=1&panelId=34",
    "https://ousd-dashboard.ogn.app/d-solo/0YIjaWh4z/main-dashboard?orgId=1&panelId=32",
  ],
  statistics: [
    "https://ousd-dashboard.ogn.app/d-solo/0YIjaWh4z/main-dashboard?orgId=1&panelId=26",
    "https://ousd-dashboard.ogn.app/d-solo/0YIjaWh4z/main-dashboard?orgId=1&panelId=2",
    "https://ousd-dashboard.ogn.app/d-solo/0YIjaWh4z/main-dashboard?orgId=1&panelId=4",
    "https://ousd-dashboard.ogn.app/d-solo/0YIjaWh4z/main-dashboard?orgId=1&panelId=28",
    "https://ousd-dashboard.ogn.app/d-solo/0YIjaWh4z/main-dashboard?orgId=1&panelId=30",
  ],
  strategies: [
    "https://ousd-dashboard.ogn.app/d-solo/0YIjaWh4z/main-dashboard?orgId=1&panelId=8",
    "https://ousd-dashboard.ogn.app/d-solo/0YIjaWh4z/main-dashboard?orgId=1&panelId=18",
    "https://ousd-dashboard.ogn.app/d-solo/0YIjaWh4z/main-dashboard?orgId=1&panelId=6",
    "https://ousd-dashboard.ogn.app/d-solo/0YIjaWh4z/main-dashboard?orgId=1&panelId=20",
  ],
};

const AnalyticsHealthMonitoring = () => {
  return (
    <>
      <Head>
        <title>Analytics | Health Monitoring</title>
      </Head>
      <div className="flex flex-col w-full h-full space-y-10">
        <Typography.Caption className="text-subheading">
          Monitoring the health of DEFI contracts that can affect OUSD strategy
          health.
        </Typography.Caption>
        <div className="flex flex-col w-full space-y-6">
          <Typography.Caption>Macro situation</Typography.Caption>
          <div className="grid grid-cols-12 gap-6">
            {monitoring?.macro.map((url) => (
              <div
                key={url}
                className="flex flex-col space-y-2 col-span-12 lg:col-span-6"
              >
                <LayoutBox className="min-h-[420px]">
                  <div className="w-full h-full space-y-2">
                    <iframe
                      src={url}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                    />
                  </div>
                </LayoutBox>
                <div className="relative flex flex-col w-full bg-origin-bg-grey rounded-md p-6">
                  <Typography.Caption className="text-subheading">
                    Add a few lines of text on why we chose to monitor this
                    chart
                  </Typography.Caption>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[3px] bg-origin-bg-grey w-full flex-shrink-0" />
        <div className="flex flex-col w-full space-y-6">
          <Typography.Caption>General statistics</Typography.Caption>
          <div className="grid grid-cols-12 gap-6">
            {monitoring?.statistics.map((url) => (
              <div
                key={url}
                className="flex flex-col space-y-2 col-span-12 lg:col-span-6"
              >
                <LayoutBox className="h-[420px]">
                  <div className="w-full h-full space-y-2">
                    <iframe
                      src={url}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                    />
                  </div>
                </LayoutBox>
                <div className="relative flex flex-col w-full bg-origin-bg-grey rounded-md p-6">
                  <Typography.Caption className="text-subheading">
                    Add a few lines of text on why we chose to monitor this
                    chart
                  </Typography.Caption>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[3px] bg-origin-bg-grey w-full flex-shrink-0" />
        <div className="flex flex-col w-full space-y-6">
          <Typography.Caption>Strategies</Typography.Caption>
          <div className="grid grid-cols-12 gap-6">
            {monitoring?.strategies.map((url) => (
              <div
                key={url}
                className="flex flex-col space-y-2 col-span-12 lg:col-span-6"
              >
                <LayoutBox className="h-[420px]">
                  <div className="w-full h-full space-y-2">
                    <iframe
                      src={url}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                    />
                  </div>
                </LayoutBox>
                <div className="relative flex flex-col w-full bg-origin-bg-grey rounded-md p-6">
                  <Typography.Caption className="text-subheading">
                    Add a few lines of text on why we chose to monitor this
                    chart
                  </Typography.Caption>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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

export default AnalyticsHealthMonitoring;

AnalyticsHealthMonitoring.getLayout = (page, props) => (
  <TwoColumnLayout {...props}>{page}</TwoColumnLayout>
);
