/**
 * Market Price Service
 * Provides commodity prices for Indian states
 * In production, this would connect to Indian agricultural price APIs
 */

// Indian States
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
];

// Mock price data for Indian states (in INR per quintal)
// These are realistic price ranges for major agricultural commodities in India
const INDIAN_STATE_PRICES: Record<string, Record<string, { min: number; max: number; avg: number }>> = {
  "Punjab": {
    WHEAT: { min: 2200, max: 2500, avg: 2350 },
    RICE: { min: 1800, max: 2200, avg: 2000 },
    COTTON: { min: 5500, max: 6500, avg: 6000 },
    CORN: { min: 1600, max: 1900, avg: 1750 },
    SOYBEANS: { min: 3800, max: 4200, avg: 4000 }
  },
  "Haryana": {
    WHEAT: { min: 2100, max: 2400, avg: 2250 },
    RICE: { min: 1700, max: 2000, avg: 1850 },
    COTTON: { min: 5200, max: 6200, avg: 5700 },
    CORN: { min: 1500, max: 1800, avg: 1650 },
    SOYBEANS: { min: 3600, max: 4000, avg: 3800 }
  },
  "Maharashtra": {
    WHEAT: { min: 1900, max: 2200, avg: 2050 },
    RICE: { min: 1600, max: 1900, avg: 1750 },
    COTTON: { min: 5800, max: 6800, avg: 6300 },
    CORN: { min: 1400, max: 1700, avg: 1550 },
    SOYBEANS: { min: 3200, max: 3600, avg: 3400 }
  },
  "Karnataka": {
    WHEAT: { min: 1800, max: 2100, avg: 1950 },
    RICE: { min: 2000, max: 2400, avg: 2200 },
    COTTON: { min: 4800, max: 5800, avg: 5300 },
    CORN: { min: 1300, max: 1600, avg: 1450 },
    SOYBEANS: { min: 3000, max: 3400, avg: 3200 }
  },
  "Tamil Nadu": {
    WHEAT: { min: 1700, max: 2000, avg: 1850 },
    RICE: { min: 2200, max: 2600, avg: 2400 },
    COTTON: { min: 4500, max: 5500, avg: 5000 },
    CORN: { min: 1200, max: 1500, avg: 1350 },
    SOYBEANS: { min: 2800, max: 3200, avg: 3000 }
  },
  "Uttar Pradesh": {
    WHEAT: { min: 2000, max: 2300, avg: 2150 },
    RICE: { min: 1800, max: 2100, avg: 1950 },
    COTTON: { min: 5000, max: 6000, avg: 5500 },
    CORN: { min: 1400, max: 1700, avg: 1550 },
    SOYBEANS: { min: 3400, max: 3800, avg: 3600 }
  },
  "West Bengal": {
    WHEAT: { min: 1600, max: 1900, avg: 1750 },
    RICE: { min: 2400, max: 2800, avg: 2600 },
    COTTON: { min: 4200, max: 5200, avg: 4700 },
    CORN: { min: 1100, max: 1400, avg: 1250 },
    SOYBEANS: { min: 2600, max: 3000, avg: 2800 }
  },
  "Gujarat": {
    WHEAT: { min: 1900, max: 2200, avg: 2050 },
    RICE: { min: 1600, max: 1900, avg: 1750 },
    COTTON: { min: 6000, max: 7000, avg: 6500 },
    CORN: { min: 1500, max: 1800, avg: 1650 },
    SOYBEANS: { min: 3500, max: 3900, avg: 3700 }
  },
  "Rajasthan": {
    WHEAT: { min: 2000, max: 2300, avg: 2150 },
    RICE: { min: 1500, max: 1800, avg: 1650 },
    COTTON: { min: 5300, max: 6300, avg: 5800 },
    CORN: { min: 1300, max: 1600, avg: 1450 },
    SOYBEANS: { min: 3100, max: 3500, avg: 3300 }
  },
  "Madhya Pradesh": {
    WHEAT: { min: 1800, max: 2100, avg: 1950 },
    RICE: { min: 1700, max: 2000, avg: 1850 },
    COTTON: { min: 4800, max: 5800, avg: 5300 },
    CORN: { min: 1200, max: 1500, avg: 1350 },
    SOYBEANS: { min: 2900, max: 3300, avg: 3100 }
  }
};

// Default prices for states not in our database
const DEFAULT_STATE_PRICES: Record<string, { min: number; max: number; avg: number }> = {
  WHEAT: { min: 1800, max: 2200, avg: 2000 },
  RICE: { min: 1700, max: 2100, avg: 1900 },
  COTTON: { min: 5000, max: 6000, avg: 5500 },
  CORN: { min: 1300, max: 1600, avg: 1450 },
  SOYBEANS: { min: 3000, max: 3500, avg: 3250 }
};

export interface CommodityPrice {
  commodity: string;
  price: number;
  date: string;
  currency: string;
  state: string;
  priceRange: {
    min: number;
    max: number;
    avg: number;
  };
}

export async function fetchCommodityPrice(commodity: string, state: string): Promise<CommodityPrice> {
  const upperCommodity = commodity.toUpperCase();
  const statePrices = INDIAN_STATE_PRICES[state] || DEFAULT_STATE_PRICES;
  const commodityPrices = statePrices[upperCommodity];

  if (!commodityPrices) {
    throw new Error(`Price data not available for ${commodity} in ${state}`);
  }

  // Add some randomization to simulate real market fluctuations
  const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
  const currentPrice = commodityPrices.avg * (1 + variation);

  return {
    commodity: upperCommodity,
    price: Math.round(currentPrice),
    date: new Date().toISOString().split('T')[0],
    currency: "INR",
    state: state,
    priceRange: commodityPrices
  };
}

export async function fetchAllCommodityPrices(state: string): Promise<Record<string, CommodityPrice | null>> {
  const results: Record<string, CommodityPrice | null> = {};
  const commodities = ["WHEAT", "RICE", "COTTON", "CORN", "SOYBEANS"];

  for (const commodity of commodities) {
    try {
      const priceData = await fetchCommodityPrice(commodity, state);
      results[commodity] = priceData;
    } catch (error) {
      console.error(`Failed to fetch ${commodity} price for ${state}:`, error);
      results[commodity] = null;
    }
  }

  return results;
}

// Legacy function for backward compatibility (uses Punjab as default)
export async function fetchCommodityPriceGlobal(commodity: string): Promise<CommodityPrice> {
  return fetchCommodityPrice(commodity, "Punjab");
}