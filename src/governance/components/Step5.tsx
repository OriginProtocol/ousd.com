import React from "react";
import Image from "next/image";
import { Typography } from "@originprotocol/origin-storybook";
import { Gradient2Button } from "../../components";
import { assetRootPath } from "../../utils/image";

interface Step5Props {
  className?: string;
}

const Step5 = ({ className }: Step5Props) => {
  return (
    <div className={className}>
      <Typography.Body2 className="text-blurry">
        If you wish to vote
      </Typography.Body2>

      <Typography.Body2 className="text-white-grey mt-4">
        Sorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis
        molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
        fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
        elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
        lectus. Class aptent taciti sociosqu ad litora torquent per conubia
        nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
        egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse
        ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi
        convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
      </Typography.Body2>

      <Gradient2Button
        className="bg-transparent hover:bg-transparent mt-10"
        outerDivClassName="mt-10 inline py-4 px-5 mr-4"
        onClick={() =>
          process.browser &&
          window.open("https://vote.ousd.com/", "_blank", "noopener noreferrer")
        }
      >
        <Typography.Body2 className="inline">
          View snapshot proposals{" "}
        </Typography.Body2>
        <Image
          src={assetRootPath("/images/external-link-white.svg")}
          width={12}
          height={12}
          alt="External Link"
          className="ml-2 inline"
        />
      </Gradient2Button>
      <Gradient2Button
        className="bg-transparent hover:bg-transparent mt-4"
        outerDivClassName="mt-10 inline py-4 px-5"
        onClick={() =>
          process.browser &&
          window.open(
            "https://governance.ousd.com/",
            "_blank",
            "noopener noreferrer"
          )
        }
      >
        <Typography.Body2 className="inline">
          View on-chain proposals{" "}
        </Typography.Body2>
        <Image
          src={assetRootPath("/images/external-link-white.svg")}
          width={12}
          height={12}
          alt="External Link"
          className="ml-2 inline"
        />
      </Gradient2Button>
    </div>
  );
};

export default Step5;
