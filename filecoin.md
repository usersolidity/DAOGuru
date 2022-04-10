## Filecoin
**IPFS Web3 Storage** : We have stored JSON data of invoices on decentralized Web3.storage of IPFS-File coin.

https://github.com/DAO-Guru/DAOGuru/blob/master/src/modal/CreateInvoiceModal.js

```javascript
  function getAccessToken() { 
    return process.env.REACT_APP_WEB3_STORAGE_API_KEY;
  }

  function makeStorageClient() {
     return new Web3Storage({ token: getAccessToken() });
  }

  function makeFileObjects(data) { 
    const blob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });

    const files = [new File([blob], "subscribtion_Details.json")];
    return files;
  } 
  async function storage(files, formData) {
   const client = makeStorageClient();
   const cid = await client.put(files);
  }

```
