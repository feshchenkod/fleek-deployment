require("dotenv").config();
const {
  FleekSdk,
  PersonalAccessTokenService,
} = require("@fleek-platform/sdk/node");
const path = require("path");
const fs = require("fs");
const { Readable } = require("stream");

const accessTokenService = new PersonalAccessTokenService({
  personalAccessToken: process.env.FLEEK_PAT,
  projectId: process.env.FLEEK_PROJECT_ID,
});

const fleekSdk = new FleekSdk({
  accessTokenService,
});

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: node fleekDeployStorage.js <file-path>");
  console.error(
    "Ensure that .env contains PERSONAL_ACCESS_TOKEN and PROJECT_ID"
  );
  process.exit(1);
}

const nodeStreamToReadableStream = (nodeStream) => {
  return new ReadableStream({
    start(controller) {
      nodeStream.on("data", (chunk) => controller.enqueue(chunk));
      nodeStream.on("end", () => controller.close());
      nodeStream.on("error", (err) => controller.error(err));
    },
    cancel() {
      nodeStream.destroy();
    },
  });
};

const uploadToStorage = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const readableStream = nodeStreamToReadableStream(fileStream);

  const fileLike = {
    name: path.basename(filePath),
    stream: () => readableStream,
  };

  const result = await fleekSdk.storage().uploadFile({
    file: fileLike,
  });

  return result;
};

uploadToStorage(filePath)
  .then((res) => {
    console.log(res.pin.cid);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Upload failed:", err);
    process.exit(1);
  });
