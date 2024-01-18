const fetchImprovementProposals = async () => {
  const offChainCount = await fetchOffChainProposalCount();
  const onChainCount = await fetchOnChainProposalCount();

  return offChainCount + onChainCount;
};

const fetchOffChainProposalCount = async () => {
  const data = JSON.stringify({
    query: `{
            proposals (
                first: 1000,
                skip: 0,
                where: {
                space_in: ["ousdgov.eth"],
                },
                orderBy: "created",
                orderDirection: desc
            ) {
                id
            }
        }`,
  });

  let count: number;

  try {
    const response = await fetch("https://hub.snapshot.org/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    const { data: responseData } = await response.json();
    count = responseData.proposals.length;
  } catch (err) {
    console.error("Error fetching proposal count from off-chain");
    throw err;
  }

  return count;
};

const fetchOnChainProposalCount = async () => {
  let count = 0;
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_SUBSQUID_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: ` query ProposalCount {
          ogvProposalsConnection(orderBy: id_ASC, where: {status_not_in: Canceled}) {
            totalCount
          }
        }`,
        variables: null,
        operationName: 'ProposalCount'
      })
    })
    const json = await res.json()
    count = json.ogvProposalsConnection.totalCount
  } catch (err) {
    console.error("Error fetching proposal count from chain");
    throw err;
  }

  return count;
};
export default fetchImprovementProposals;
