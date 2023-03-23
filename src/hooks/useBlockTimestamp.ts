import { providers } from "ethers";
import { useEffect, useState } from "react";

const useBlockTimestamp = () => {
  const [blockTimestamp, setBlockTimestamp] = useState<number | null>(null);

  useEffect(() => {
    let timestampInterval;

    (async () => {
      try {
        const provider = new providers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_ETHEREUM_RPC_PROVIDER
        );

        // Refreshes blockTimestamp every 8 seconds
        timestampInterval = setInterval(async () => {
          const blockTimestamp = (
            await provider.getBlock(await provider.getBlockNumber())
          ).timestamp;
          setBlockTimestamp(blockTimestamp);
        }, 8000);
      } catch (error) {
        console.error("Unable to fetch block.timestamp");
        throw error;
      }
    })();

    return () => clearInterval(timestampInterval);
  }, []);

  return blockTimestamp;
};

export default useBlockTimestamp;
