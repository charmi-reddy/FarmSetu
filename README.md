# FarmSetu Forward Contract Platform

A decentralized forward contract platform for farmers and buyers built on Algorand.

## Current Status

✅ **Frontend UI Complete** - Beautiful landing page with wallet integration
✅ **Wallet Integration** - Pera Wallet connect buttons (Farmers & Buyers)
✅ **Role-based Interface** - Separate dashboards for farmers and buyers
✅ **Responsive Design** - Works on desktop and mobile
⏳ **Smart Contracts** - Coming next (separate deployment)
⏳ **Full Contract Operations** - Ready for smart contract integration

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Set `VITE_CONTRACT_MODE=local` for mock mode, or `VITE_CONTRACT_MODE=onchain` and set `VITE_FORWARD_APP_ID`.
Optional: set `VITE_EXPLORER_BASE_URL` for transaction/app links in history.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5176](http://localhost:5176) to view the app.

### 4. Test Wallet Integration
- Click "🌾 Connect as Farmer" or "🛒 Connect as Buyer"
- Pera Wallet extension will open for connection
- After connecting, you'll see the role-specific dashboard

## Features

### Landing Page
- **Hero Section**: Clear value proposition
- **Role Selection**: Choose between Farmer or Buyer
- **Connect Buttons**: Working Pera Wallet integration
- **How It Works**: 3-step process explanation
- **Responsive Design**: Beautiful on all devices

### Farmer Dashboard (After Connection)
- Create new forward contracts
- View your active contracts
- Monitor contract status
- Transaction history

### Buyer Dashboard (After Connection)
- Browse available contracts
- Accept contracts with deposits
- View accepted contracts
- Settle completed contracts

## Project Structure

```
src/
├── App.tsx              # Main app with wallet integration
├── pages/Dashboard.tsx  # Role-based dashboard
├── components/          # Reusable UI components
├── hooks/              # React hooks for wallet/contracts
├── services/           # Algorand contract operations
└── types/              # TypeScript definitions
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Blockchain**: Algorand (TestNet ready)
- **Wallet**: Pera Wallet
- **Smart Contracts**: TypeScript (AlgoKit ready)

## Next Steps

1. **Deploy Smart Contract** to get APP_ID
```bash
algokit project build
algokit project deploy testnet
```

2. **Update contractService.ts** with APP_ID
```typescript
const APP_ID = <YOUR_DEPLOYED_APP_ID>;
```

3. **Enable Full Contract Operations**
   - Contract creation and acceptance
   - Price updates and settlement
   - Transaction monitoring

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

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Blockchain**: Algorand (TestNet)
- **Wallet**: Pera Wallet
- **Smart Contracts**: TypeScript (AlgoKit)

## Next Steps

1. **Deploy Smart Contract** to get APP_ID
2. **Update contractService.ts** with APP_ID
3. **Enable wallet integration** in hooks
4. **Test full workflow** end-to-end</content>
<parameter name="filePath">c:\Users\Charmi\Desktop\FarmSetu\README.md
