import algosdk from "algosdk";
import { fetchCommodityPrice } from "./fetch-price.mjs";

const algodServer = process.env.ALGOD_SERVER || "https://testnet-api.algonode.cloud";
const algodToken = process.env.ALGOD_TOKEN || "";
const algodPort = process.env.ALGOD_PORT || "";
const oracleMnemonic = process.env.ORACLE_MNEMONIC || "";
const appId = Number(process.env.APP_ID || "0");
const cropName = process.env.CROP_NAME || "WHEAT";

// AlphaVantage API configuration
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || "Q4YKBLWVHQ57980I";

if (!oracleMnemonic) {
  throw new Error("Missing ORACLE_MNEMONIC");
}
if (!appId) {
  throw new Error("Missing APP_ID");
}
if (!ALPHA_VANTAGE_API_KEY) {
  throw new Error("Missing ALPHA_VANTAGE_API_KEY");
}

const algod = new algosdk.Algodv2(algodToken, algodServer, algodPort);
const oracle = algosdk.mnemonicToSecretKey(oracleMnemonic);

async function updatePriceFromOracle() {
  try {
    console.log(`Fetching current ${cropName} price from AlphaVantage...`);

    // Fetch price from AlphaVantage
    const currentPrice = await fetchCommodityPrice(cropName);

    // Convert to microAlgos (assuming price is in USD, convert to ALGO equivalent)
    // For demo purposes, we'll assume 1 USD = 0.1 ALGO (adjust as needed)
    const usdToAlgoRate = 0.1; // This should be fetched from an oracle too
    const currentPriceAlgo = currentPrice * usdToAlgoRate;
    const currentPriceMicro = Math.round(currentPriceAlgo * 1_000_000);

    console.log(`Current ${cropName} price: $${currentPrice} USD = ${currentPriceAlgo} ALGO`);

    // Update the contract
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

    console.log("✅ Oracle price update successful!");
    console.log(`APP_ID=${appId}`);
    console.log(`PRICE=${currentPriceAlgo} ALGO`);
    console.log(`TX_ID=${submitted.txid}`);

  } catch (error) {
    console.error("❌ Oracle price update failed:", error.message);
    process.exit(1);
  }
}

// Run the update
updatePriceFromOracle();