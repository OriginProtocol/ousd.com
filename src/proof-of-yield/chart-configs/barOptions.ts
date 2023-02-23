import { ChartOptions, TooltipModel } from "chart.js";
import { commify } from "ethers/lib/utils";
import moment from "moment";

const barOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      bottom: 24,
      left: 24,
      right: 24,
    },
  },
  plugins: {
    tooltip: {
      enabled: false,
      callbacks: {
        title: (context) =>
          moment(parseInt(context[0].label)).format("MMM DD YYYY"),
        label: (context) =>
          "$" + commify((context.raw as number).toFixed(2)).toString(),
      },
      external: () => {},
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
};

export default barOptions;
