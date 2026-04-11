# FarmSetu Forward Contract Platform

A decentralized forward contract platform for farmers and buyers built on Algorand, featuring oracle-powered price settlement.

## Current Status

✅ **Complete Implementation** - Full-stack dApp with smart contracts
✅ **Smart Contract Fixed** - Proper settlement payments based on price differences
✅ **Oracle Integration** - Automated commodity price feeds from AlphaVantage
✅ **Role-based Authentication** - Separate dashboards for farmers and buyers
✅ **Wallet Integration** - Pera Wallet connect with persistent login
✅ **Market Price Guidance** - Real-time price data for informed contract creation
✅ **GitHub Ready** - Clean codebase with proper .gitignore and environment setup

## Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd FarmSetu
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

**Required Setup:**
- Get AlphaVantage API key: https://www.alphavantage.co/support/#api-key
- Set `VITE_ALPHA_VANTAGE_API_KEY` in `.env.local`
- For on-chain mode, deploy contracts and set `VITE_FORWARD_APP_ID`

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5176](http://localhost:5176) to view the app.

### 4. Test the Platform
- Connect as Farmer or Buyer using Pera Wallet
- Farmers: Create contracts with market price guidance
- Buyers: Browse and accept available contracts
- Oracle: Automatically provides settlement prices

## Features

### 🔐 Authentication System
- **Role-based Login**: Choose between Farmer or Buyer roles
- **Persistent Sessions**: Login state saved across browser refreshes
- **Secure Logout**: Clean session management

### 🌾 Farmer Dashboard
- **Market Price Guidance**: Real-time commodity prices from AlphaVantage
- **Contract Creation**: Set forward prices with market awareness
- **Contract Management**: View and manage active contracts
- **Settlement Tracking**: Monitor contract lifecycle

### 🛒 Buyer Dashboard
- **Contract Discovery**: Browse available forward contracts
- **Smart Acceptance**: Deposit funds to accept contracts
- **Settlement Execution**: Settle contracts using oracle prices

### 📊 Oracle System
- **Automated Price Feeds**: AlphaVantage integration for 5 commodities
- **Secure Updates**: Only oracle wallet can update prices
- **Fair Settlement**: Price differences paid automatically
- **Market Transparency**: Current prices visible to all users

### � India State-Specific Pricing
- **State Selection**: Farmers choose their state for relevant pricing
- **Localized Prices**: Each state has different commodity price ranges
- **Realistic Data**: Based on actual Indian agricultural market data
- **Currency**: All prices in INR (Indian Rupees) per quintal

### 💰 Smart Contract Settlement
- **Price Difference Calculation**: `(Current Price - Agreed Price) × Quantity`
- **Automatic Payments**: 
  - **Prices rise**: Farmer receives the difference
  - **Prices fall**: Buyer receives the difference
  - **Prices equal**: Deposit returned to farmer
- **Trustless Execution**: No intermediaries needed

## Project Structure

```
FarmSetu/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── CreateContractForm.tsx    # Contract creation with price guidance
│   │   ├── ContractList.tsx          # Contract display and actions
│   │   └── SettleContractModal.tsx   # Settlement interface
│   ├── hooks/
│   │   ├── useAuth.tsx               # Authentication state management
│   │   ├── useContracts.ts           # Contract operations
│   │   └── useWallet.ts              # Pera Wallet integration
│   ├── pages/
│   │   ├── LoginPage.tsx             # Role selection and wallet connect
│   │   └── Dashboard.tsx             # Role-based dashboard
│   ├── services/
│   │   ├── contractService.ts        # Smart contract interactions
│   │   ├── marketPriceService.ts     # AlphaVantage API integration
│   │   └── networkConfig.ts          # Algorand network settings
│   └── types/
│       └── contract.ts               # TypeScript definitions
├── backend/
│   ├── contracts/forward/            # TEAL smart contracts
│   ├── oracle/                       # Price feed scripts
│   └── scripts/                      # Deployment and testing scripts
├── public/                           # Static assets
└── package.json                      # Dependencies and scripts
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Blockchain**: Algorand (TestNet + MainNet ready)
- **Wallet**: Pera Wallet integration
- **Smart Contracts**: TEAL (Algorand Virtual Machine)
- **Oracle**: AlphaVantage API for commodity prices
- **State Management**: React Context + localStorage
- **Build Tools**: Vite, TypeScript, ESLint

## Deployment

### Smart Contract Deployment
```bash
# Build contract artifacts
npm run build:artifacts

# Deploy to testnet
cd backend
node scripts/deploy-forward.mjs

# Note the APP_ID from deployment output
```

### Environment Setup for Production
```bash
# Copy and configure environment
cp .env.example .env.local

# Required variables:
VITE_ALPHA_VANTAGE_API_KEY=your_api_key
VITE_FORWARD_APP_ID=deployed_app_id
VITE_CONTRACT_MODE=onchain
```

### Build and Deploy Frontend
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

## Development Notes

- **Wallet Integration**: Uses `@perawallet/connect` SDK
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Smooth UX with loading indicators
- **Type Safety**: Full TypeScript coverage
- **Responsive**: Mobile-first design approach
- Enable contract creation/acceptance
- Add transaction monitoring

## Architecture

```
src/
├── App.tsx              # Main app (currently minimal UI)
├── pages/Dashboard.tsx  # Full dashboard (ready for integration)
├── components/          # Reusable UI components
├── hooks/              # React hooks for wallet/contracts
├── services/           # Algorand contract operations
└── types/              # TypeScript definitions
```

## Oracle Integration

FarmSetu uses a **state-specific oracle system** for Indian agricultural commodity prices:

- **India State-Specific Pricing**: Prices vary by state (Punjab, Maharashtra, Karnataka, etc.)
- **Realistic Price Database**: Based on actual Indian agricultural price ranges (in INR per quintal)
- **Supported Commodities**: WHEAT, RICE, COTTON, CORN, SOYBEANS
- **Supported States**: All 29 Indian states + Delhi, Puducherry
- **Security**: Only the oracle wallet can update prices

### Price Data Source
The oracle provides **state-specific market prices** instead of global commodity prices:
- **Punjab**: Major wheat producer (₹2,000-2,500/quintal)
- **Maharashtra**: Cotton and soybean hub (₹5,000-7,000/quintal)
- **Karnataka**: Rice producer (₹2,000-2,400/quintal)
- **Tamil Nadu**: Rice and cotton (₹2,000-2,600/quintal)

### Oracle Commands
```bash
# Build contract artifacts (contains compiled TEAL code)
node backend/scripts/build-artifacts.mjs

# Deploy to testnet (requires ALGOD_* and ORACLE_MNEMONIC env vars)
node backend/scripts/deploy-forward.mjs

# Update contract prices (requires APP_ID and ORACLE_MNEMONIC)
node backend/oracle/update-price.mjs
```

## Smart Contract Artifacts & App ID

### Artifacts Location
- **File**: `artifacts/forward-contract.json`
- **Contents**: Compiled TEAL bytecode, ABI, deployment metadata
- **Purpose**: Contains the smart contract code ready for deployment

### Getting an App ID
The App ID is generated when you deploy the contract to Algorand:

```bash
# 1. Set environment variables
cp .env.example .env.local
# Edit .env.local with your ALGOD_* and ORACLE_MNEMONIC values

# 2. Deploy contract
node backend/scripts/deploy-forward.mjs

# 3. Note the APP_ID from the output
# Example output: "App ID: 123456789"

# 4. Update your .env.local
VITE_FORWARD_APP_ID=123456789
VITE_CONTRACT_MODE=onchain
```

### Why No App ID in Repo?
- **Security**: App IDs are deployment-specific
- **Environment-Specific**: Different for testnet/mainnet
- **Fresh Deployment**: Each environment needs its own contract instance

## How Forward Contracts Work

1. **Farmer Creates Contract**: Sets agreed forward price with market guidance
2. **Buyer Accepts**: Deposits funds to lock in the contract
3. **Oracle Updates Price**: Provides current market price at settlement time
4. **Settlement**: Contract pays price difference automatically
   - If market price > agreed price: Farmer gets the difference
   - If agreed price > market price: Buyer gets the difference

## Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Testing Contract Operations
```bash
# Local mode (default)
VITE_CONTRACT_MODE=local npm run dev

# On-chain mode (requires deployed contract)
VITE_CONTRACT_MODE=onchain VITE_FORWARD_APP_ID=12345 npm run dev
```

## Security Notes

- **Oracle Security**: Only the designated oracle address can update prices
- **Contract Immutability**: Settlement logic is trustless and automatic
- **Price Transparency**: All users can see current market prices
- **No Admin Keys**: No privileged accounts can manipulate outcomes

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Run `npm run build` to ensure no build errors
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

MIT License - see LICENSE file for details.
