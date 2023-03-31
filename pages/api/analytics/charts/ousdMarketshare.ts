import DuneClient, { toChartData, jobsLookup } from "../../../../lib/dune";
import { formatLabels } from "../../../../lib/dune/utils";

export const getOUSDMarketshareRelativeToETH = async () => {
  try {
    const client = new DuneClient(process.env.DUNE_API_KEY);

    const {
      result: { rows },
    } = await client.refresh(jobsLookup.ousdSupplyRelativeEthereum.queryId);

    rows.reverse();

    const { total, labels } = toChartData(rows, {
      ousd: "total",
      day: "labels",
    });

    return {
      labels: formatLabels(labels),
      datasets: [
        {
          id: "total",
          label: "Current",
          data: total.map((item) => item * 100),
        },
      ],
    };
  } catch (e) {
    const error = new Error("A server error occurred");
    error.status = 500;
    error.info = {
      message: e.message,
    };
    throw error;
  }
};

const getHandler = async (req, res) => {
  try {
    const data = await getOUSDMarketshareRelativeToETH();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

const handler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return getHandler(req, res);
    default:
      res.setHeader("Allow", ["GET", "OPTIONS"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
