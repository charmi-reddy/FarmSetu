import algosdk from "algosdk";

export const depositAlgo = async (
  sender: string,
  appId: number,
  amount: number,
  peraWallet: any
) => {
  try {
    const algodClient = new algosdk.Algodv2(
      "",
      "https://testnet-api.algonode.cloud",
      ""
    );

    const params = await algodClient.getTransactionParams().do();
    

    const appAddress = algosdk.getApplicationAddress(appId);

    console.log("App ID:", appId);

    console.log("App Address:", appAddress);

    // 💰 Txn 1: Payment
    const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      sender,
      receiver: appAddress,
      amount: amount * 1_000_000, // ALGO → microAlgos
      suggestedParams: params,
    });
    console.log("Receiver being used:", appAddress);

    // 📞 Txn 2: App Call
const encoder = new TextEncoder();

const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
  sender,
  appIndex: appId,
  appArgs: [encoder.encode("deposit")],
  suggestedParams: params,
});

    // 🔗 GROUP THEM
    const groupID = algosdk.computeGroupID([paymentTxn, appCallTxn]);

    paymentTxn.group = groupID;
    appCallTxn.group = groupID;

    const txGroup = [
      { txn: paymentTxn, signers: [sender] },
      { txn: appCallTxn, signers: [sender] },
    ];

    const signedTxn = await peraWallet.signTransaction([txGroup]);

    const txId = await algodClient.sendRawTransaction(signedTxn).do();

    console.log("✅ Deposit success:", txId);

  } catch (error) {
    console.error("Deposit failed:", error);
  }

  console.log("App Address:", algosdk.getApplicationAddress(appId));

};