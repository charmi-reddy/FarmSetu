import algosdk from "algosdk";
import fetch from "node-fetch";

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || "Q4YKBLWVHQ57980I";
const BASE_URL = "https://www.alphavantage.co/query";

// Commodity symbols mapping (AlphaVantage uses specific symbols)
const COMMODITY_SYMBOLS = {
  WHEAT: "WHEAT", // AlphaVantage commodity symbol
  CORN: "CORN",
  SOYBEANS: "SOYBEANS",
  RICE: "RICE",
  COTTON: "COTTON"
};

export async function fetchCommodityPrice(commodity) {
  const symbol = COMMODITY_SYMBOLS[commodity.toUpperCase()];
  if (!symbol) {
    throw new Error(`Unsupported commodity: ${commodity}`);
  }

  const url = `${BASE_URL}?function=${symbol}&interval=monthly&apikey=${ALPHA_VANTAGE_API_KEY}`;

  try {
    console.log(`Fetching ${commodity} price from: ${url}`);
    const response = await fetch(url);
    const data = await response.json();

    console.log(`API Response for ${commodity}:`, JSON.stringify(data, null, 2));

    if (data["Error Message"]) {
      throw new Error(`AlphaVantage API Error: ${data["Error Message"]}`);
    }

    if (data["Note"]) {
      console.warn("AlphaVantage API Note:", data["Note"]);
    }

    // Extract the latest price from the data
    const timeSeries = data["Monthly Time Series"];
    if (!timeSeries) {
      // Check if it's the commodity data format (array of objects with date/value)
      if (data.data && Array.isArray(data.data)) {
        console.log(`Using commodity data format for ${commodity}`);
        const validData = data.data.filter(item => item.value !== "." && item.value !== null);
        if (validData.length === 0) {
          throw new Error("No valid price data available");
        }

        const latestData = validData[0]; // Data is already sorted newest first
        const price = parseFloat(latestData.value);

        if (isNaN(price)) {
          throw new Error("Invalid price data received");
        }

        console.log(`${commodity} price for ${latestData.date}: $${price}`);
        return price;
      }

      // Try alternative data structures
      const alternatives = ["Time Series (Daily)", "Weekly Time Series", "Monthly Time Series"];
      let foundData = null;
      for (const alt of alternatives) {
        if (data[alt]) {
          foundData = data[alt];
          console.log(`Using alternative data structure: ${alt}`);
          break;
        }
      }

      if (!foundData) {
        throw new Error("No time series data available. Available keys: " + Object.keys(data).join(", "));
      }

      const dates = Object.keys(foundData).sort().reverse();
      const latestDate = dates[0];
      const latestData = foundData[latestDate];

      const price = parseFloat(latestData["4. close"] || latestData["close"] || latestData["price"]);

      if (isNaN(price)) {
        throw new Error("Invalid price data received. Data keys: " + Object.keys(latestData).join(", "));
      }

      console.log(`${commodity} price for ${latestDate}: $${price}`);
      return price;
    }

    const dates = Object.keys(timeSeries).sort().reverse();
    const latestDate = dates[0];
    const latestData = timeSeries[latestDate];

    const price = parseFloat(latestData["4. close"]);

    if (isNaN(price)) {
      throw new Error("Invalid price data received");
    }

    console.log(`${commodity} price for ${latestDate}: $${price}`);

    return price;
  } catch (error) {
    console.error(`Failed to fetch ${commodity} price:`, error.message);
    throw error;
  }
}

export async function fetchMultipleCommodityPrices() {
  const results = {};

  for (const [commodity, symbol] of Object.entries(COMMODITY_SYMBOLS)) {
    try {
      const price = await fetchCommodityPrice(commodity);
      results[commodity] = price;
    } catch (error) {
      console.error(`Failed to fetch ${commodity}:`, error.message);
      results[commodity] = null;
    }

    // Rate limiting - AlphaVantage free tier allows 5 calls per minute
    await new Promise(resolve => setTimeout(resolve, 12000)); // 12 seconds
  }

  return results;
}