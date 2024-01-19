const fetchImprovementProposals = async () => {
  const offChainCount = await fetchOffChainProposalCount();
  const onChainCount = await fetchOnChainProposalCount();

  return offChainCount + onChainCount;
};

const fetchOffChainProposalCount = async () => {
  let count = 0;
  try {
    const response = await fetch("https://hub.snapshot.org/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query proposalCount {
          space(id: "ousdgov.eth"){    
            proposalsCount
          }
        }`,
      }),
    });

    const json = await response.json();
    count = json.data.space.proposalsCount;
  } catch (err) {
    console.error("Error fetching proposal count from off-chain");
  }

  return count;
};

const fetchOnChainProposalCount = async () => {
  let count = 0;
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_SUBSQUID_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query ProposalCount {
          ogvProposalsConnection(orderBy: id_ASC, where: {status_not_in: Canceled}) {
            totalCount
          }
        }`,
        variables: null,
        operationName: "ProposalCount",
      }),
    });
    const json = await res.json();
    count = json.data.ogvProposalsConnection.totalCount;
  } catch (err) {
    console.error("Error fetching proposal count from chain");
  }

  return count;
};
export default fetchImprovementProposals;
