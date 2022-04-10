## The Graph

**The Graph:**  Subgraph query has been used to fetch cash flow transactions of DAO subscription services of Superfluid incoming streaming.

https://github.com/DAO-Guru/DAOGuru/blob/master/src/context/SuperfluidContext.js


```javascript

const searchByAddressDocument = gql`
  query Search($addressId: ID, $addressBytes: Bytes) {
    tokensByAddress: tokens(where: { id: $addressId, isSuperToken: true }) {
      id
      symbol
      name
      isListed
    }
    tokensByUnderlyingAddress: tokens(
      where: { isSuperToken: true, underlyingAddress: $addressBytes }
    ) {
      id
      symbol
      name
      isListed
    }
    accounts(where: { id: $addressId }) {
      id
    }
  }
`;


 async function getUSDCXBalance(
  provider ,
  subAddress, 
) {
  const signer = provider.getSigner(subAddress);
  const contract = new ethers.Contract(USDCx, Daix, signer);
  let result = await contract.balanceOf(subAddress);
  return ethers.utils.formatEther(result);
}

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const queryData = networks.map((network) =>
    sfSubgraph.useCustomQuery({
      chainId: network.chainId,
      document: searchByAddressDocument,
      variables: {
        addressId: user?.attributes?.ethAddress?.toLowerCase(),
        addressBytes: user?.attributes?.ethAddress?.toLowerCase(),
      },
    })
  );

  const subQueryData = networks.map((network) =>
    sfSubgraph.useCustomQuery({
      chainId: network.chainId,
      document: searchByAddressDocument,
      variables: {
        addressId: subAddress.toLowerCase(),
        addressBytes: subAddress.toLowerCase(),
      },
    })
  );
  const subFetchStream = sfSubgraph.usePrefetch("streams");
  subFetchStream({
    chainId: networks[0].chainId,
    filter: {
      sender: queryData[0].currentData?.accounts[0]?.id,
    },
  }); 

  const prefetchStreamsQuery = sfSubgraph.usePrefetch("streams");
  prefetchStreamsQuery({
    chainId: networks[0].chainId,
    filter: {
      receiver: queryData[0].currentData?.accounts[0]?.id,
    },
  });

  const incomingStreamsQuery = sfSubgraph.useStreamsQuery({
    chainId: networks[0].chainId,
    filter: {
      receiver: queryData[0].currentData?.accounts[0]?.id,
    },
  });

  const outgoingStreamsQuery = sfSubgraph.useStreamsQuery({
    chainId: networks[0].chainId,
    filter: { 
      sender: subAddress,
    },
  }); 
  
  async function outgoingFlows() {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider,
    });
    const flows = await sf.cfaV1.getAccountFlowInfo({
      superToken: USDCx,
      account: subAddress,
      providerOrSigner: signer,
    }); 

    setSubFlow(
      outgoingStreamsQuery.data?.data[
        outgoingStreamsQuery.data?.data.length - 1
      ]
    );

    function calculateStream(flowRate) {
      const stream = new BigNumber(flowRate * (86400 * 30)).shiftedBy(-18);
      return stream.toFixed(2);
    }
    function toPositive(n) {
      if (n < 0) {
        n = n * -1;
      }
      return n;
    }
    setSubTotal(toPositive(calculateStream(flows.flowRate)));
  }


```
