# fleek-deployment

Deploy to storage and update ENS:

```
IPFS_HASH=`node fleekDeployIPFS.js file`
echo $IPFS_HASH
node updateENS.mjs  $IPFS_HASH
```
