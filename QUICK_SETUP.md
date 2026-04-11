# FarmSetu Forward Contract Platform - Setup

## What's Included

✅ Farmer & Buyer interface for forward contracts
✅ Pera Wallet integration  
✅ React components with Tailwind CSS
✅ TypeScript smart contract for Algorand
✅ Contract lifecycle management (create, accept, settle)
✅ Transaction tracking and history

## Quick Start

### 1. Install & Run Frontend
```bash
npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`

### 2. Deploy Smart Contract (Coming Next)
```bash
algokit project build
algokit project deploy testnet
```

### 3. Update App ID
After deployment, update `src/services/contractService.ts`:
```typescript
const APP_ID = <YOUR_DEPLOYED_APP_ID>;
```

### 4. Get TestNet ALGO
Visit: https://testnet.algoexplorer.io/ → Request ALGO

### 5. Use the App
- Open http://localhost:5173
- Select role: Farmer or Buyer
- Connect Pera Wallet
- Create or accept contracts

## Project Structure

### Frontend
- `src/App.tsx` - Main app wrapper
- `src/pages/Dashboard.tsx` - Main dashboard with role selection
- `src/components/` - Reusable UI components
- `src/hooks/` - React hooks for wallet and contracts
- `src/services/` - Algorand contract operations
- `src/types/` - TypeScript type definitions

### Pages
- `src/pages/Dashboard.tsx` - Main dashboard

### Components
- `src/components/CreateContractForm.tsx`
- `src/components/ContractList.tsx`
- `src/components/AcceptContractModal.tsx`
- `src/components/SettleContractModal.tsx`
- `src/components/TransactionHistory.tsx`

### Types
- `src/types/contract.ts` - TypeScript interfaces

### Smart Contracts
- `backend/savings_vault/smart_contracts/farmsetu_forward.ts`

### Documentation
- `FARMSET_INTEGRATION.md` - Full integration guide
- `QUICK_SETUP.md` - This file

## Architecture

```
User connects wallet (Pera)
     ↓
Dashboard shows contracts
     ↓
User performs operation (create/accept/settle)
     ↓
contractService builds & signs transaction
     ↓
Pera Wallet signs (user confirms)
     ↓
Transaction submitted to Algorand
     ↓
UI updates with result
```

## Key Changes to Fortuna

**App.tsx:** Updated to use new Dashboard component instead of basic wallet demo

**package.json:** All dependencies already present
- @perawallet/connect v1.5.2
- algosdk v3.5.2

## Environment

- **Network:** Algorand TestNet (CHAIN_ID: 416002)
- **Wallet:** Pera Wallet (browser extension)
- **Frontend:** React 19 + TypeScript 5.9 + Tailwind CSS 4
- **Smart Contracts:** TypeScript with AlgoKit

## Wallet Functions

All preserved from Fortuna:
```typescript
wallet.connect()           // Connect wallet
wallet.disconnect()        // Disconnect
wallet.isConnected         // Boolean status
wallet.accountAddress      // User's address
wallet.signTransaction()   // Sign txn (used by contracts)
```

## Contract Operations

New functions in `contractService.ts`:
```typescript
createForwardContract()    // Create contract
acceptContract()           // Accept & deposit
updatePrice()              // Update price (oracle)
settleContract()           // Settle & calculate
getContract()              // Fetch details
listUserContracts()        // Get user's contracts
```

## Address Format

Valid Algorand addresses:
```
Length: 58 characters
Charset: A-Z, 2-7 (Base32)
Example: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
```

Validation: `/^[A-Z2-7]{58}$/`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to initialize wallet" | Refresh page, check Pera extension |
| "Contract already created" | Contract state is wrong, check APP_ID |
| "Insufficient deposit" | Calculate: quantity × agreed_price |
| "Only oracle can update price" | Only oracle address can call |
| "Connection cancelled" | User closed Pera Wallet popup |

## Performance Tips

- Contracts are cached in component state
- Use React.memo for list components if large
- Consider pagination for many contracts
- Transactions update atomically

## Next: Production

Before deploying to Mainnet:
1. Test all flows on TestNet
2. Add price Oracle service
3. Implement contract search/filters
4. Add advanced settlement logic
5. Security audit of smart contract
6. Load testing with multiple users

## Documentation

- `FARMSET_INTEGRATION.md` - Full integration guide
- `FORTUNA_MERGER_PLAN.md` - Original merger plan
- Smart contract in TypeScript with comments
- All components have JSDoc comments

## Questions?

Check:
1. [Pera Wallet Docs](https://docs.perawallet.app/)
2. [Algorand Developer Docs](https://developer.algorand.org/)
3. [AlgoKit Docs](https://github.com/algorandfoundation/algokit-cli)
4. Console errors: Open Developer Tools (F12)

---

**Status:** ✅ Ready for integration testing
**Last Updated:** 2024
