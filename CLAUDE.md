# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Frame Lint is a Figma plugin for maintaining consistent frame naming conventions across design systems. It validates frame names against custom patterns and provides quick-fix capabilities.

## Architecture

This is a monorepo using pnpm workspaces and Turbo for build orchestration. The project consists of three packages:

- **@frame-lint/plugin**: Figma plugin backend code that runs in the Figma sandbox
- **@frame-lint/ui**: React-based UI using Chakra UI that runs in an iframe
- **@frame-lint/message-types**: Shared TypeScript types for plugin-UI communication

Communication between plugin and UI happens via Figma's postMessage API with strongly-typed messages defined in message-types package.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Development mode (watches all packages)
pnpm dev

# Build all packages
pnpm build

# Run linting across all packages
pnpm lint

# Type checking across all packages
pnpm type-check

# Format code with Prettier
pnpm format

# Check formatting
pnpm format:check
```

## Package-Specific Development

Each package can be developed independently:

```bash
# Work on specific package
cd packages/plugin
pnpm dev    # Watch mode with tsup
pnpm build  # Build with tsup

cd packages/ui
pnpm dev    # Vite watch mode
pnpm build  # Vite production build
pnpm start  # Vite dev server

cd packages/message-types
pnpm dev    # tsup watch mode
pnpm build  # Build CJS/ESM/types
```

## Key Technologies

- **Build Tools**: Turbo (monorepo orchestration), tsup (plugin/message-types bundling), Vite (UI bundling)
- **UI Framework**: React 19 with Chakra UI v3
- **State Management**: React hooks with message passing to plugin
- **Type Safety**: TypeScript throughout, ts-pattern for exhaustive pattern matching
- **Code Quality**: ESLint 9 with flat config, Prettier for formatting

## Figma Plugin Specifics

- Plugin entry: `packages/plugin/dist/index.js`
- UI entry: `packages/ui/dist/index.html`
- Manifest: `manifest.json` at root
- Document access: dynamic-page mode
- No network access required

## Testing Strategy

The project uses manual testing in Figma. Load the plugin via:

1. Build with `pnpm build`
2. In Figma: Plugins → Development → Import plugin from manifest
3. Select the `manifest.json` file

## Message Flow

1. UI sends typed messages (UIToPluginMessage) via postMessage
2. Plugin processes in `packages/plugin/src/index.ts` using ts-pattern matching
3. Plugin responds with PluginToUIMessage types
4. UI updates based on received messages

## File Naming Patterns

The plugin validates frame names against user-defined patterns using wildcards:

- `Component*` - matches Component followed by anything
- `Section_*` - matches Section\_ followed by anything
- Multiple patterns separated by commas
