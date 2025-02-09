require("dotenv").config();
const {
  FleekSdk,
  PersonalAccessTokenService,
} = require("@fleek-platform/sdk/node");
const fs = require("fs");

const accessTokenService = new PersonalAccessTokenService({
  personalAccessToken: process.env.FLEEK_PAT,
  projectId: process.env.FLEEK_PROJECT_ID,
});

const fleekSdk = new FleekSdk({
  accessTokenService,
});

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: node fleekDeployIPFS.js <file-path>");
  console.error(
    "Ensure that .env contains PERSONAL_ACCESS_TOKEN and PROJECT_ID"
  );
  process.exit(1);
}

const uploadToIPFS = async (filePath) => {
  const content = fs.readFileSync(filePath);
  const fileName = filePath.split("/").pop();
  const result = await fleekSdk.ipfs().add({
    path: filePath,
    content,
  });

  return result;
};

uploadToIPFS(filePath)
  .then((res) => {
    console.log(res.pin.cid);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Upload failed:", err);
    process.exit(1);
  });
