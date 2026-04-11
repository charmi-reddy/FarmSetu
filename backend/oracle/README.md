# FarmSetu Oracle Integration

This directory contains the oracle price feed integration for FarmSetu forward contracts.

## Files

- `fetch-price.mjs` - Fetches commodity prices from AlphaVantage API
- `update-price.mjs` - Manual price update script (existing)
- `update-price-oracle.mjs` - Automated price update using AlphaVantage data

## Setup

1. Get an AlphaVantage API key from https://www.alphavantage.co/support/#api-key
2. Add it to your `.env` file:
   ```
   ALPHA_VANTAGE_API_KEY=your_api_key_here
   ```

## Usage

### Fetch Current Prices
```bash
npm run oracle:fetch
```

### Update Contract Price Automatically
```bash
npm run oracle:update
```

### Manual Price Update (existing)
```bash
node backend/oracle/update-price.mjs
```

## Supported Commodities

- WHEAT
- CORN
- SOYBEANS
- RICE
- COTTON

## API Rate Limits

AlphaVantage free tier allows:
- 5 API calls per minute
- 500 calls per day

The scripts include rate limiting to respect these limits.

## Price Conversion

Prices are fetched in USD and converted to ALGO using a fixed rate (0.1 ALGO = 1 USD). In production, you should use a proper USD/ALGO price feed.