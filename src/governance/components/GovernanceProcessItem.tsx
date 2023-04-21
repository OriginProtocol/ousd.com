import React from "react";
import Image from "next/image";
import { Typography } from "@originprotocol/origin-storybook";
import { twMerge } from "tailwind-merge";
import { Gradient2Button } from "../../components";
import { assetRootPath } from "../../utils/image";

interface GovernanceProcessItemProps {
  imgRoute: string;
  imgSize: number;
  title: string;
  description: string;
  externalDescription?: string;
  externalLink?: string;
  hasLine?: boolean;
  participationRequirments?: {
    snapshotMinimum: string;
    voteMinimum: string;
    quorumMinimum: string;
  };
  className?: string;
}

const GovernanceProcessItem = ({
  imgRoute,
  imgSize,
  title,
  description,
  externalDescription,
  externalLink,
  hasLine = true,
  participationRequirments,
  className,
}: GovernanceProcessItemProps) => {
  return (
    <div className={twMerge("flex pb-10 lg:pb-20", className)}>
      <div className="mr-4 lg:mr-14 relative">
        <div className="bg-white flex-[0_1_auto] relative w-[32px] h-[32px] lg:w-[56px] lg:h-[56px] rounded-full">
          <Image
            src={assetRootPath(imgRoute)}
            width={imgSize}
            height={imgSize}
            alt="Item Image"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        {/* Vertical line */}
        {hasLine && (
          <div className="h-full w-[2px] bg-table-title lg:mt-3 mx-auto" />
        )}
      </div>
      <div className="pt-0 lg:pt-4">
        <Typography.H7>{title}</Typography.H7>
        <Typography.Body3 className="text-sm text-subheading max-w-[996px] mt-6 leading-6">
          {description}
        </Typography.Body3>
        {participationRequirments && (
          <>
            <Typography.Body2 className="mt-6 mb-4">
              Participation requirements
            </Typography.Body2>

            {/* Snapshot */}
            <div className="mb-2">
              <Typography.Body3 className="text-sm inline text-blurry">
                {participationRequirments.snapshotMinimum}
              </Typography.Body3>
              <Typography.Body3 className="text-sm inline ml-1 text-subheading">
                to create a proposal
              </Typography.Body3>
            </div>

            {/* Vote */}
            <div className="mb-2">
              <Typography.Body3 className="text-sm text-blurry inline">
                {participationRequirments.voteMinimum}
              </Typography.Body3>
              <Typography.Body3 className="text-sm inline ml-1 text-subheading">
                to vote on existing proposals{" "}
              </Typography.Body3>
            </div>

            {/* Quorum */}
            <Typography.Body3 className="text-sm text-blurry inline">
              {participationRequirments.quorumMinimum}
            </Typography.Body3>
            <Typography.Body3 className="text-sm inline ml-1 text-subheading">
              quorum requirement
            </Typography.Body3>
          </>
        )}
        <Gradient2Button
          outerDivClassName="mt-8 lg:mt-10"
          className="bg-transparent hover:bg-transparent text-sm"
          onClick={() =>
            process.browser &&
            window.open(externalLink, "_blank", "noopener noreferrer")
          }
        >
          <Typography.Body3 className="text-xs inline">
            {externalDescription}
          </Typography.Body3>
          <Image
            src={assetRootPath("/images/external-link-white.svg")}
            width={12}
            height={12}
            alt="External Link"
            className="ml-2 inline"
          />
        </Gradient2Button>
      </div>
    </div>
  );
};

export default GovernanceProcessItem;
