# TSender Development Guide

## Quick Start

### 1. Start Local Blockchain (Terminal 1)

```bash
npm run anvil:dev
```

This starts Anvil with TSender contract pre-deployed at `0x5FbDB2315678afecb367f032d93F642f64180aa3`

### 2. Deploy SimpleToken (Terminal 2)

```bash
npm run deploy:token
```

This deploys a fresh SimpleToken contract for testing. Copy the deployed address from the output.

**Note:** SimpleToken is deployed fresh each time because it's not in the saved state. The address will always be `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9` if deployed first.

### 3. Start Next.js App (Terminal 3)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Wallet Setup (MetaMask)

### Add LocalHost Network

1. Network Name: `LocalHost 8545`
2. RPC URL: `http://127.0.0.1:8545`
3. Chain ID: `31337`
4. Currency Symbol: `ETH`

### Import Test Account

Import the first Anvil account (has all the tokens):

- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

### Import SimpleToken

To see tokens in MetaMask:

1. Click "Import tokens"
2. Token Address: `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9`
3. Symbol: `SIMPLE`
4. Decimals: `18`

## Available Scripts

### Development

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Testing

- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once

### Blockchain

- `npm run anvil` - Start fresh Anvil (empty state)
- `npm run anvil:dev` - Start Anvil with TSender pre-deployed
- `npm run deploy:token` - Deploy SimpleToken to running Anvil
- `npm run check:balance` - Check token balance (add address as argument)

## Contract Addresses (Anvil)

### Pre-deployed (in tsender-deployed.json)

- **TSender**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

### Deploy Each Time

- **SimpleToken**: `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9` (if deployed first)

## Test Accounts

All accounts have 10,000 ETH:

```
Account 0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (Token Owner)
Account 1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Account 2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
... (10 accounts total)
```

## Troubleshooting

### MetaMask stuck on "Connecting to LocalHost"

1. Make sure Anvil is running (`npm run anvil:dev`)
2. Check RPC URL in MetaMask has `http://` prefix
3. Try disconnecting and reconnecting the wallet
4. Refresh the page

### "Circuit breaker" error

You're using the old token. Deploy SimpleToken with `npm run deploy:token` and use that address instead.

### Token not showing in MetaMask

Import the token manually using the SimpleToken address above.

## Why Two Separate Steps?

**Q: Why not include SimpleToken in tsender-deployed.json?**

A: The old state had a token with circuit breaker issues. Rather than fix the complex token, we:

1. Keep TSender (works fine) in saved state
2. Deploy fresh SimpleToken each time (simple, no issues)

This gives you a clean testing environment every time!
