import { SECONDS_IN_A_MONTH } from "../constants";

const veOgvToOgv = (
  blockTimestamp: number,
  veOgvAmount: number,
  lockupDuration: number
): number => {
  // as specified here: https://github.com/OriginProtocol/ousd-governance/blob/master/contracts/OgvStaking.sol#L21
  const votingDecayFactor = 1.8;

  // block.timestamp of when OgvStaking.sol was launched
  const epoch = 1657584000;
  const duration = lockupDuration * SECONDS_IN_A_MONTH;
  // Since we'll be using blockTimestamp from CURRENT block, calculation will be
  // a hair outdated... but it's negligible
  const start = blockTimestamp > epoch ? blockTimestamp : epoch; // In prod, should always be blockTimestamp
  const end = start + duration;
  const dist = end - epoch; // Distance between end of staking period and the very beginning when staking was launched
  const multiplier = dist / 365 / 86400;
  const lockupAmount = veOgvAmount / votingDecayFactor ** multiplier;
  return lockupAmount;
};

export default veOgvToOgv;
