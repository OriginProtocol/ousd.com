import { Typography } from "@originprotocol/origin-storybook";
import Image from "next/image";
import React from "react";
import { Gradient2Button } from "../../components";
import { assetRootPath } from "../../utils/image";

interface Step3Props {
  className?: string;
}

const Step3 = ({ className }: Step3Props) => {
  return (
    <div className={className}>
      <Typography.Body2 className="text-blurry">
        Whether you're wanting to discuss a proposal you have in mind, to get a
        feeling from the community, or looking to participate in discissions on
        exisiting proposals, this is the place to start.
      </Typography.Body2>

      <Typography.Body2 className="text-white-grey mt-4">
        Sorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis
        molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
        fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
        elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
        lectus. Class aptent taciti sociosqu ad litora torquent per conubia
        nostra, per inceptos himenaeos.
      </Typography.Body2>

      <Gradient2Button
        className="bg-transparent hover:bg-transparent py-3"
        outerDivClassName="mt-10"
        onClick={() =>
          process.browser &&
          window.open("https://www.google.com", "_blank", "noopener noreferrer")
        }
      >
        <Typography.Body2 className="inline">
          Origin Protocol Discord server
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

export default Step3;
