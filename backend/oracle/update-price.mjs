import algosdk from "algosdk";

const algodServer = process.env.ALGOD_SERVER || "https://testnet-api.algonode.cloud";
const algodToken = process.env.ALGOD_TOKEN || "";
const algodPort = process.env.ALGOD_PORT || "";
const oracleMnemonic = process.env.ORACLE_MNEMONIC || "";
const appId = Number(process.env.APP_ID || "0");
const currentPrice = Number(process.env.CURRENT_PRICE || "0");
const currentPriceMicro = Math.round(currentPrice * 1_000_000);

if (!oracleMnemonic) {
  throw new Error("Missing ORACLE_MNEMONIC");
}
if (!appId) {
  throw new Error("Missing APP_ID");
}
if (!currentPrice || currentPrice < 0) {
  throw new Error("CURRENT_PRICE must be > 0");
}

const algod = new algosdk.Algodv2(algodToken, algodServer, algodPort);
const oracle = algosdk.mnemonicToSecretKey(oracleMnemonic);
const params = await algod.getTransactionParams().do();

const txn = algosdk.makeApplicationNoOpTxnFromObject({
  sender: oracle.addr,
  appIndex: appId,
  appArgs: [new TextEncoder().encode("update_price"), algosdk.encodeUint64(currentPriceMicro)],
  suggestedParams: params,
});

const signed = txn.signTxn(oracle.sk);
const submitted = await algod.sendRawTransaction(signed).do();
await algosdk.waitForConfirmation(algod, submitted.txid, 6);

console.log("Oracle update submitted");
console.log(`APP_ID=${appId}`);
console.log(`PRICE=${currentPrice}`);
console.log(`TX_ID=${submitted.txid}`);
