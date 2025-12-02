# @ultrade/shared

Shared code, utilities, and types for Ultrade platform packages. Supports both Node.js and browser environments.

**Repository:** [https://github.com/ultrade-org/ultrade-shared](https://github.com/ultrade-org/ultrade-shared)

## Package Info

- **Name:** `@ultrade/shared`
- **Dual Build:** Browser and Node.js builds

## Installation

Install the package using your preferred package manager:

```bash
npm install @ultrade/shared
```

```bash
yarn add @ultrade/shared
```

```bash
pnpm add @ultrade/shared
```

## TypeScript Configuration

For proper type resolution and convenient development, you need to configure your `tsconfig.json` correctly.

### Recommended Configuration

The configuration should be able to resolve types that account for the `exports` field in `package.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "nodenext"
    // Alternative options: "node16" or "bundler"
  }
}
```

### Alternative: Manual Path Configuration

If you cannot change your TypeScript settings, you can explicitly specify paths:

```json
{
  "compilerOptions": {
    "paths": {
      "@ultrade/shared/browser/*": ["../shared/dist/browser/*"],
      "@ultrade/shared/node/*": ["../shared/dist/node/*"]
    }
  }
}
```

## Structure

```
src/
├── common/                    # Common utilities (shared between browser/node)
│   ├── auth.helper.ts         # Authentication helpers
│   ├── big-number.helper.ts   # BigNumber utilities
│   ├── mappers/               # Data mapping utilities
│   │   ├── amm.mappers.ts
│   │   ├── order.mappers.ts
│   │   ├── pair.mappers.ts
│   │   └── vip.mappers.ts
│   ├── utils/                 # Common utility functions
│   │   ├── auth.utils.ts
│   │   ├── common.utils.ts
│   │   ├── decimal.utils.ts
│   │   ├── errors.utils.ts
│   │   └── validation.utils.ts
│   └── index.ts
│
├── constants/                 # Constants
│   ├── allowedUrls.ts
│   ├── auth.ts
│   ├── cctp.ts                # Cross-Chain Transfer Protocol
│   ├── codex.ts
│   ├── env.ts
│   ├── response.ts
│   ├── settings.ts
│   ├── social.ts
│   ├── withdrawalWalletsMessage.ts
│   └── index.ts
│
├── enums/                     # Enumerations
│   ├── chains.enum.ts         # Blockchain chains
│   ├── db/                    # Database enums (23 files)
│   ├── maintenanceMode.enum.ts
│   ├── notification.enum.ts
│   ├── rabbitMq.ts
│   ├── social.enum.ts
│   └── index.ts
│
├── helpers/                   # Helper functions
│   ├── algo.helper.ts         # Algorand helpers
│   ├── assert.helper.ts       # Assertion utilities
│   ├── atomic.helper.ts       # Atomic conversion helpers
│   ├── balance.helper.ts      # Balance calculations
│   ├── codex/                 # Codex protocol helpers
│   │   ├── cancel-order.helper.ts
│   │   ├── create-order.helper.ts
│   │   ├── dtw.helper.ts
│   │   ├── login.helper.ts
│   │   ├── trading-key.helper.ts
│   │   ├── transfer.helper.ts
│   │   └── withdraw.helper.ts
│   ├── codex.helper.ts
│   ├── Encoding.ts
│   ├── eth.helper.ts          # Ethereum helpers
│   ├── interval.helpers.ts
│   ├── liquidity.helper.ts
│   ├── order.helper.ts
│   ├── pair.helper.ts
│   ├── pointSystem.helper.ts
│   ├── ticker.helpers.ts
│   ├── vaa.helper.ts          # Wormhole VAA helpers
│   ├── withdraw.helper.ts
│   └── index.ts
│
├── interfaces/                # TypeScript interfaces
│   ├── accountInfo.interface.ts
│   ├── api/                   # API-related interfaces
│   ├── cache.interface.ts
│   ├── db/                    # Database interfaces (11 files)
│   ├── dto/                   # Data transfer objects
│   ├── emailService.interface.ts
│   ├── kmsService.interface.ts
│   ├── last-look-trade.interface.ts
│   ├── market.interface.ts
│   ├── order.interface.ts
│   ├── pagination.interface.ts
│   ├── pair.interface.ts
│   ├── query.interface.ts
│   ├── services/              # Service interfaces (9 files)
│   ├── streaming.interface.ts
│   ├── timestream.interface.ts
│   ├── trading.interface.ts
│   ├── tradingKey.interface.ts
│   ├── transfer.interface.ts
│   ├── wallet.interface.ts
│   ├── withdrawalWallets.interface.ts
│   └── index.ts
│
└── types/                     # Type definitions
    ├── algo-order.type.ts
    ├── amm/                   # AMM types
    ├── api/                   # API types
    ├── codex.types.ts
    ├── hummingbots.types.ts
    ├── notification.type.ts
    ├── settings.type.ts
    ├── state.type.ts
    └── index.ts
```

## TypeScript Path Aliases

Defined in `tsconfig.alias.json`:

| Alias | Path | Description |
|-------|------|-------------|
| `@common/*` | `./src/common/*` | Common utilities |
| `@constants` | `./src/constants/index.ts` | Constants |
| `@enums` | `./src/enums/index.ts` | Enumerations |
| `@helpers/*` | `./src/helpers/*` | Helper functions |
| `@interfaces` | `./src/interfaces/index.ts` | Interfaces |
| `@types` | `./src/types/index.ts` | Type definitions |

## Package Exports

The package uses conditional exports for browser and node environments:

```json
{
  "./browser/common/*": {
    "import": "./dist/browser/common/*.js",
    "types": "./dist/common/*.d.ts"
  },
  "./node/common/*": {
    "import": "./dist/node/common/*.js",
    "types": "./dist/common/*.d.ts"
  },
  "./browser/helpers/*": {
    "import": "./dist/browser/helpers/*.js",
    "types": "./dist/helpers/*.d.ts"
  },
  "./node/helpers/*": {
    "import": "./dist/node/helpers/*.js",
    "types": "./dist/helpers/*.d.ts"
  },
  "./browser/*": {
    "import": "./dist/browser/*/index.js",
    "types": "./dist/*/index.d.ts"
  },
  "./node/*": {
    "import": "./dist/node/*/index.js",
    "types": "./dist/*/index.d.ts"
  }
}
```

## Build Commands

**Important:** First install node_modules from monorepo root (npm_packages)

- `npm run build` - Production build (both browser and node)
- `npm run dev` - Development build with watch
- `npm run dev:node` - Node.js development build
- `npm run dev:browser` - Browser development build
- `npm run version:update` - Bump patch version

## Usage Examples

### Browser Environment
```typescript
import { makeLoginMsg } from '@ultrade/shared/browser/helpers/codex.helper';
import { PROVIDERS } from '@ultrade/shared/browser/interfaces';
import { OrderStatus } from '@ultrade/shared/browser/enums';
```

### Node.js Environment
```typescript
import { validateOrder } from '@ultrade/shared/node/helpers';
import { DbOrderStatus } from '@ultrade/shared/node/enums/db';
```