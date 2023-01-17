import { Plugin } from "chart.js";
import { BigNumber } from "ethers";

const getOrCreateLegendList = (chart, id) => {
  const legendContainer = document.getElementById(id);
  let listContainer = legendContainer.querySelector("ul");

  if (!listContainer) {
    listContainer = document.createElement("ul");
    listContainer.style.display = "flex";
    listContainer.style.flexDirection = "column";
    listContainer.style.margin = "0";
    listContainer.style.padding = "2rem 0 0 0";

    legendContainer.appendChild(listContainer);
  }

  return listContainer;
};

export const distributionLegendPlugin: Plugin = {
  id: "distributionLegend",
  afterUpdate(chart, args, options) {
    if (chart.config.type !== "doughnut") return;
    const ul = getOrCreateLegendList(chart, options.containerId);

    while (ul.firstChild) ul.firstChild.remove();

    const { data } = chart.config;

    // Reuse the built-in legendItems generator
    const { labels, datasets } = data;

    (labels as string[]).forEach((item, i) => {
      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.width = "100%";
      li.style.paddingBottom = "2rem";

      // Color box
      const boxSpan = document.createElement("span");
      boxSpan.style.background = datasets[0].backgroundColor[i];
      boxSpan.style.borderWidth = datasets[0].borderWidth + "px";
      boxSpan.style.display = "inline-block";
      boxSpan.style.height = "20px";
      boxSpan.style.maxHeight = "20px";
      boxSpan.style.width = "20px";
      boxSpan.style.minWidth = "20px";
      boxSpan.style.borderRadius = "100%";

      // Shareholder
      const textContainer = document.createElement("p");
      textContainer.style.display = "inline";
      textContainer.style.color = "#FFF";
      textContainer.style.margin = "0";
      textContainer.style.padding = "0 1.5rem";

      const text = document.createTextNode(item);
      textContainer.appendChild(text);

      // Percentage
      const percentContainer = document.createElement("p");
      percentContainer.style.display = "inline";
      percentContainer.style.color = "#FFF";
      percentContainer.style.marginLeft = "auto";
      percentContainer.style.fontWeight = "800";

      const dataLabel = datasets[0].label;
      const totalSupply = BigNumber.from(dataLabel);
      // Maintains precesion until 2 decimal places
      const percentage = (
        BigNumber.from(datasets[0].data[i])
          .mul(10000)
          .div(totalSupply)
          .toNumber() / 100
      ).toString();

      const percentageNode = document.createTextNode(percentage + "%");
      percentContainer.appendChild(percentageNode);

      li.appendChild(boxSpan);
      li.appendChild(textContainer);
      li.appendChild(percentContainer);
      ul.appendChild(li);
    });
  },
};

export default distributionLegendPlugin;
