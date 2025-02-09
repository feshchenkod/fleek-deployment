import { createWalletClient, custom, http } from "viem";
import { mainnet } from "viem/chains";
import { addEnsContracts } from "@ensdomains/ensjs";
import { setContentHashRecord } from "@ensdomains/ensjs/wallet";
import { privateKeyToAccount } from "viem/accounts";
import dotenv from "dotenv";

dotenv.config();

const ENS_DOMAIN = process.env.ENS_DOMAIN;
const IPFS_HASH = "ipfs://" + process.argv[2];

const account = privateKeyToAccount(process.env.PRIVATE_KEY);

const wallet = createWalletClient({
  account,
  chain: addEnsContracts(mainnet),
  transport: http(),
});

const hash = await setContentHashRecord(wallet, {
  name: ENS_DOMAIN,
  contentHash: IPFS_HASH,
  resolverAddress: "0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63",
});
