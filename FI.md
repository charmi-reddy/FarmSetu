# FarmSetu → Fortuna Integration Guide

## Overview

This guide explains how to integrate FarmSetu's forward contract business logic into Fortuna's existing React + Pera Wallet application.

## Architecture

```
FORTUNA (React Frontend + AlgoKit SmartContracts)
├── src/
│   ├── hooks/
│   │   ├── useWallet.ts          ← Pera Wallet integration (preserved)
│   │   └── useContracts.ts       ← NEW: FarmSetu contract management
│   ├── services/
│   │   └── contractService.ts    ← NEW: Contract operations
│   ├── pages/
│   │   └── Dashboard.tsx         ← NEW: FarmSetu dashboard UI
│   ├── components/
│   │   ├── CreateContractForm.tsx
│   │   ├── ContractList.tsx
│   │   ├── AcceptContractModal.tsx
│   │   ├── SettleContractModal.tsx
│   │   └── TransactionHistory.tsx
│   ├── types/
│   │   └── contract.ts           ← NEW: Contract types
│   └── App.tsx                   ← NEW: Updated to use Dashboard
│
└── backend/savings_vault/smart_contracts/
    └── farmsetu_forward.ts       ← NEW: Algorand smart contract
```

## Integration Steps

### 1. Install Dependencies

All required dependencies are already in `package.json`:
- `@perawallet/connect` - Wallet integration
- `algosdk` - Algorand SDK
- `@algorandfoundation/algokit-utils` - AlgoKit utilities

### 2. File Structure

The following files have been created/modified:

**New Hooks:**
- `src/hooks/useWallet.ts` - Enhanced wallet hook (extracted from App.tsx)
- `src/hooks/useContracts.ts` - Contract state management hook

**New Services:**
- `src/services/contractService.ts` - Contract operations (create, accept, update price, settle)

**New Components:**
- `src/pages/Dashboard.tsx` - Main application page
- `src/components/CreateContractForm.tsx` - Form to create contracts
- `src/components/ContractList.tsx` - View and manage contracts
- `src/components/AcceptContractModal.tsx` - Accept contract dialog
- `src/components/SettleContractModal.tsx` - Settle contract dialog
- `src/components/TransactionHistory.tsx` - Transaction log

**New Types:**
- `src/types/contract.ts` - TypeScript interfaces for contracts

**Smart Contract:**
- `backend/savings_vault/smart_contracts/farmsetu_forward.ts` - Algorand smart contract

### 3. Wallet Integration

Fortuna's wallet is preserved and used by all contract operations:

```typescript
// In your components
import { useWallet } from "../hooks/useWallet";

function MyComponent() {
  const wallet = useWallet();
  
  // wallet.accountAddress - user's Algorand address
  // wallet.isConnected - boolean
  // wallet.connect() - initiate connection
  // wallet.disconnect() - disconnect wallet
  // wallet.signTransaction() - sign transactions
}
```

### 4. Contract Operations

All contract operations go through `contractService.ts`:

```typescript
import * as contractService from "../services/contractService";

// Create a contract
const result = await contractService.createForwardContract(
  {
    farmerAddress: farmerAddress,
    oracleAddress: oracleAddress,
    cropName: "Wheat",
    quantity: 100,
    agreedPrice: 50
  },
  wallet,
  userAddress
);

// Accept a contract
await contractService.acceptContract(
  {
    contractId: appId,
    buyerAddress: buyerAddress,
    depositedAmount: 5000
  },
  wallet,
  userAddress
);

// Update price (oracle only)
await contractService.updatePrice(
  {
    contractId: appId,
    currentPrice: 55
  },
  wallet,
  userAddress
);

// Settle contract
await contractService.settleContract(
  {
    contractId: appId
  },
  wallet,
  userAddress
);
```

### 5. Smart Contract Deployment

Deploy the smart contract using AlgoKit:

```bash
cd backend/savings_vault
npm run build
npm run deploy:testnet
```

This will:
1. Compile the TypeScript contract to TEAL
2. Deploy to Algorand TestNet
3. Generate contract artifacts
4. Update `contractService.ts` with the APP_ID

Note the APP_ID from deployment output and update `src/services/contractService.ts`:
```typescript
const APP_ID = <YOUR_APP_ID>; // Update this
```

### 6. Configuration

Update environment variables in `.env`:

```env
VITE_NETWORK=testnet
VITE_INDEXER_URL=https://testnet-idx.algonode.cloud
VITE_NODE_URL=https://testnet-api.algonode.cloud
```

### 7. Running the Application

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## Key Differences from FarmSetu

| FarmSetu | Fortuna | Notes |
|----------|---------|-------|
| Python Flask Backend | TypeScript Backend | Use AlgoKit for contract deployment |
| Vanilla HTML/CSS | React Components | Tailwind CSS for styling |
| Direct Contract Calls | SDK-based Calls | Uses algosdk under the hood |
| Session Storage | Pera Wallet Session | Auto-restores on page reload |
| Demo Mode | Real Wallet Only | No demo mode fallback |

## Wallet Validation

Algorand addresses must match the regex pattern:
```typescript
/^[A-Z2-7]{58}$/
```

This is automatically validated in all forms.

## Transaction Flow

```
User connects Pera Wallet
    ↓
User fills contract form
    ↓
Transaction is built (unsigned)
    ↓
Pera Wallet signs transaction (user approves in popup)
    ↓
Transaction is sent to Algorand network
    ↓
Transaction confirmation (waits for inclusion)
    ↓
UI updates with result
```

## Error Handling

All contract operations include error handling:

```typescript
try {
  await contractService.createForwardContract(input, wallet, address);
} catch (error) {
  console.error("Operation failed:", error.message);
  // Show error to user in UI
}
```

Common errors:
- `"Wallet not initialized"` - Wallet not connected
- `"Insufficient deposit"` - Not enough ALGO for deposit
- `"Contract already created"` - Contract state error
- `"Only oracle can update price"` - Permission error

## Contract State Management

The `useContracts` hook manages:
- Contract list (fetched from chain)
- Transaction history (pending/success/error)
- Loading states
- Error messages

Example usage:
```typescript
const contracts = useContracts(wallet, userAddress);

// Create contract
await contracts.create({...});

// Transaction history
contracts.transactions.forEach(tx => {
  console.log(tx.type, tx.status, tx.txnId);
});
```

## Testing

### Manual Testing
1. Open http://localhost:5173
2. Connect Pera Wallet
3. Create a contract (requires TestNet ALGO)
4. Query contract state from dashboard
5. Test accept, update price, settle operations

### With TestNet Faucet
Get free ALGO for testing:
https://testnet.algoexplorer.io/

## Deployment

### Testnet
```bash
npm run build
# Deploy to vercel/netlify/your hosting
```

### Mainnet (Production)
Update contract configuration:
```typescript
const TESTNET_NETWORK = {
  name: "mainnet",
  nodeServer: "https://mainnet-api.algonode.cloud",
  indexerServer: "https://mainnet-idx.algonode.cloud",
};
```

## Troubleshooting

### "Failed to load wallet"
- Ensure Pera Wallet browser extension is installed
- Check browser console for specific error

### "Transaction failed"
- Verify you have ALGO in wallet
- Check contract state (must be in correct status)
- Verify addresses are valid Algorand addresses

###  "Contract not found"
- Verify APP_ID is correct in contractService.ts
- Check contract was deployed to correct network

### "Insufficient funds"
- Get ALGO from testnet faucet
- Verify deposit amount calculation

## Next Steps

1. Deploy smart contract using AlgoKit
2. Update APP_ID in contractService.ts
3. Test all contract operations
4. Add price Oracle service
5. Implement contract search/filtering
6. Add analytics dashboard
7. Deploy to Testnet for user testing

## Support

Refer to:
- [Pera Wallet Documentation](https://docs.perawallet.app/)
- [Algorand SDK Docs](https://developer.algorand.org/)
- [AlgoKit Documentation](https://github.com/algorandfoundation/algokit-cli)
- [FarmSetu Original Code](../README.md)
