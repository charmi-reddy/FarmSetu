import algosdk from "algosdk";

export const getAlgodClient = () =>
  new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
