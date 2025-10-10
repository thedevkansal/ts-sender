# 🚀 TSender - ERC20 Token Airdrop Platform

<div align="center">

![TSender Logo](public/next.svg)

**A modern, user-friendly platform for distributing ERC20 tokens to multiple addresses in a single transaction.**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![RainbowKit](https://img.shields.io/badge/RainbowKit-2.2.8-blue?style=flat-square)](https://www.rainbowkit.com/)
[![Wagmi](https://img.shields.io/badge/Wagmi-2.17.5-purple?style=flat-square)](https://wagmi.sh/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

[Features](#-features) • [Quick Start](#-quick-start) • [Development](#-development) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

TSender is a decentralized application (dApp) that simplifies the process of sending ERC20 tokens to multiple recipients. Instead of making individual transfers, TSender batches them into a single transaction, saving time and gas fees.

### Why TSender?

- ⚡ **Gas Efficient** - Send to multiple addresses in one transaction
- 🔒 **Secure** - Built with industry-standard smart contracts
- 🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS
- 🔗 **Multi-Chain** - Supports Ethereum, ZKSync, Sepolia, and local testing
- 🦊 **Easy Wallet Connection** - Seamless integration with MetaMask and other wallets via RainbowKit

## ✨ Features

### Core Functionality

- 📤 **Batch Token Transfers** - Send ERC20 tokens to multiple addresses at once
- 📊 **CSV Support** - Import recipient lists from CSV files
- ✅ **Input Validation** - Real-time validation of addresses and amounts
- 💰 **Balance Checking** - Automatic token balance and allowance verification
- 🔐 **Auto-Approval** - Seamless token approval flow with MetaMask

### User Experience

- 🌓 **Responsive Design** - Works on desktop, tablet, and mobile
- 📱 **Transaction Details** - Clear breakdown of total amounts and recipients
- ⚡ **Real-time Feedback** - Loading states and transaction confirmations
- 🎯 **Error Handling** - Clear error messages and recovery suggestions

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- [Foundry](https://book.getfoundry.sh/getting-started/installation) for smart contract deployment
- MetaMask or another Web3 wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/thedevkansal/ts-sender.git
cd ts-sender

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your WalletConnect Project ID to .env.local
```

### Running Locally

1. **Start Local Blockchain** (Terminal 1)

   ```bash
   npm run anvil:dev
   ```

   This starts Anvil with the TSender contract pre-deployed.

2. **Deploy Test Token** (Terminal 2)

   ```bash
   npm run deploy:token
   ```

   Deploys SimpleToken for testing. Note the deployed address.

3. **Start Development Server** (Terminal 3)

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app.

4. **Configure MetaMask**
   - Add LocalHost network (RPC: `http://127.0.0.1:8545`, Chain ID: `31337`)
   - Import test account: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - Import SimpleToken: `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9`

📖 For detailed setup instructions, see [DEVELOPMENT.md](./DEVELOPMENT.md)

## 🛠 Tech Stack

### Frontend

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[RainbowKit](https://www.rainbowkit.com/)** - Wallet connection UI

### Blockchain Integration

- **[Wagmi](https://wagmi.sh/)** - React Hooks for Ethereum
- **[Viem](https://viem.sh/)** - TypeScript Ethereum library
- **[Foundry](https://book.getfoundry.sh/)** - Smart contract development toolkit

### Testing & Development

- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[Anvil](https://book.getfoundry.sh/anvil/)** - Local Ethereum node
- **Turbopack** - Fast development builds

## 📁 Project Structure

```
ts-sender/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── layout.tsx         # Root layout
│   │   └── providers.tsx      # Web3 providers
│   ├── components/            # React components
│   │   ├── AirdropForm.tsx    # Main airdrop interface
│   │   └── header.tsx         # Navigation header
│   ├── utils/                 # Utility functions
│   │   ├── sendAirdrop.ts     # Airdrop transaction logic
│   │   ├── approveToken.ts    # Token approval logic
│   │   ├── checkAllowance.ts  # Allowance checking
│   │   └── parseAirdropData.ts # CSV/input parsing
│   ├── constants.ts           # Contract addresses & ABIs
│   └── rainbowkitConfig.tsx   # Wallet configuration
├── public/                    # Static assets
├── SimpleToken.sol            # Test ERC20 token
├── tsender-deployed.json      # Anvil state snapshot
└── DEVELOPMENT.md             # Development guide
```

## 🔧 Available Scripts

| Command                 | Description                       |
| ----------------------- | --------------------------------- |
| `npm run dev`           | Start development server          |
| `npm run build`         | Build for production              |
| `npm run start`         | Start production server           |
| `npm test`              | Run tests in watch mode           |
| `npm run test:run`      | Run tests once                    |
| `npm run anvil`         | Start fresh Anvil instance        |
| `npm run anvil:dev`     | Start Anvil with TSender deployed |
| `npm run deploy:token`  | Deploy SimpleToken to Anvil       |
| `npm run check:balance` | Check ERC20 token balance         |

## 🌐 Supported Networks

- **Ethereum Mainnet** (coming soon)
- **ZKSync Era**
- **Sepolia Testnet**
- **Localhost (Anvil)** - For development

Network configurations are in [`src/rainbowkitConfig.tsx`](./src/rainbowkitConfig.tsx)

## 📝 Smart Contracts

### TSender Contract

- **Address (Anvil)**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Function**: `airdropERC20(address token, address[] recipients, uint256[] amounts, uint256 totalAmount)`

### SimpleToken (Test Token)

- **Address (Anvil)**: `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9`
- **Symbol**: SIMPLE
- **Decimals**: 18
- **Initial Supply**: 1,000,000 tokens

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests once (CI mode)
npm run test:run

# Test specific file
npm test parseAirdropData.test.ts
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [RainbowKit](https://www.rainbowkit.com/) for the beautiful wallet connection UI
- [Wagmi](https://wagmi.sh/) for the excellent React hooks
- [Foundry](https://book.getfoundry.sh/) for the powerful development toolkit
- [Next.js](https://nextjs.org/) team for the amazing framework

## 📞 Support

- 📧 Email: [thedevkansal@gmail.com](mailto:thedevkansal@gmail.com)
- 🐛 Issues: [GitHub Issues](https://github.com/thedevkansal/ts-sender/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/thedevkansal/ts-sender/discussions)

---

<div align="center">

**Built with ❤️ by [thedevkansal](https://github.com/thedevkansal)**

⭐ Star this repo if you find it useful!

</div>
