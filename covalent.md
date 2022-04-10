## Covalent API
**COVALENT**: We are fetching all the on chain invoices details using covalent API.

https://github.com/DAO-Guru/DAOGuru/blob/master/src/pages/Invoice.js

```javascrept 

  const covalent = Moralis.Plugins.covalent; 
  async function getInvoiceData() { 
      const ids = [...tokenid];
      const result = await covalent.getNftTokenIdForContract({
          chainId: 80001,
          contractAddress: daoToken,
      })
      const dd = result.data.items && result.data.items.map(async (e) => {
          ids.push(e.token_id);
      })
      setTokenid(ids);
  }

  useEffect(() => {
      Moralis.initPlugins();
      getInvoiceData();
  }, []);

  useEffect(async () => {
      const getUri = [...ddata];
      const tokenUriData = [...uriData];
      const metadata = [...meta];

      for (let index = 0; index < tokenid.length; index++) {
          const element = tokenid[index];
          const res = await covalent.getNftExternalMetadataForContract({
              chainId: 80001,
              contractAddress: daoToken,
              tokenId: element,
          })
          getUri.push(res.data);
      }
      setDData(getUri);

      for (let index = 0; index < getUri.length; index++) {
          const element = getUri[index];
          console.log(element,"element");
          tokenUriData.push(element.items[0].nft_data[0].token_url);
      }

      for (let index = 0; index < tokenUriData.length; index++) {
          const element = tokenUriData[index]; 
          var newStr = element.replace("http://10.128.0.18", "https://ipfs.moralis.io:2053");
          const dd = await axios.get(newStr); 
          metadata.push(dd.data);
      }
      setMeta(metadata);
  }, [tokenid]);

```
