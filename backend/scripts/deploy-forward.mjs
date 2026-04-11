import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import algosdk from "algosdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const algodServer = process.env.ALGOD_SERVER || "https://testnet-api.algonode.cloud";
const algodToken = process.env.ALGOD_TOKEN || "";
const algodPort = process.env.ALGOD_PORT || "";
const creatorMnemonic = process.env.CREATOR_MNEMONIC || "";
const oracleAddress = process.env.ORACLE_ADDRESS || "";
const cropName = process.env.CROP_NAME || "WHEAT";
const quantity = Number(process.env.QUANTITY || "100");
const agreedPrice = Number(process.env.AGREED_PRICE || "10");

if (!creatorMnemonic) {
  throw new Error("Missing CREATOR_MNEMONIC");
}
if (!oracleAddress) {
  throw new Error("Missing ORACLE_ADDRESS");
}

const algod = new algosdk.Algodv2(algodToken, algodServer, algodPort);
const creator = algosdk.mnemonicToSecretKey(creatorMnemonic);

const approvalPath = path.resolve(__dirname, "..", "contracts", "forward", "approval.teal");
const clearPath = path.resolve(__dirname, "..", "contracts", "forward", "clear.teal");
const approvalSource = await readFile(approvalPath, "utf8");
const clearSource = await readFile(clearPath, "utf8");

const [approvalCompiled, clearCompiled] = await Promise.all([
  algod.compile(approvalSource).do(),
  algod.compile(clearSource).do(),
]);

const approvalProgram = algosdk.base64ToBytes(approvalCompiled.result);
const clearProgram = algosdk.base64ToBytes(clearCompiled.result);

const params = await algod.getTransactionParams().do();
const txn = algosdk.makeApplicationCreateTxnFromObject({
  sender: creator.addr,
  approvalProgram,
  clearProgram,
  numGlobalInts: 6,
  numGlobalByteSlices: 4,
  numLocalInts: 0,
  numLocalByteSlices: 0,
  onComplete: algosdk.OnApplicationComplete.NoOpOC,
  appArgs: [
    new TextEncoder().encode("create"),
    algosdk.decodeAddress(oracleAddress).publicKey,
    new TextEncoder().encode(cropName),
    algosdk.encodeUint64(quantity),
    algosdk.encodeUint64(agreedPrice),
  ],
  suggestedParams: params,
});

const signed = txn.signTxn(creator.sk);
const submitted = await algod.sendRawTransaction(signed).do();
const confirmed = await algosdk.waitForConfirmation(algod, submitted.txid, 8);
const appId = Number(confirmed["application-index"]);

console.log("Forward contract deployed");
console.log(`APP_ID=${appId}`);
console.log(`CREATOR=${creator.addr}`);
console.log(`ORACLE=${oracleAddress}`);
