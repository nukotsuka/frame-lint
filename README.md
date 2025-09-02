# Frame Lint

A powerful Figma plugin for maintaining consistent frame naming conventions across your design system. Find and fix invalid frame names with customizable pattern matching.

## Features

### 🎯 Pattern-Based Validation

- Define custom naming patterns using wildcards (e.g., `Component*`, `Section_*`, `Frame*`)
- Support for multiple patterns separated by commas
- Real-time validation against your defined patterns

### 🔍 Smart Frame Detection

- Automatically scans all frames in your Figma document
- Hierarchical view showing nested frame structures
- Visual indicators for frame layout modes (horizontal, vertical, none)

### ✏️ Quick Fix Capabilities

- One-click rename functionality for invalid frames
- Suggests valid names based on your patterns
- Batch processing support for multiple frames

### 🎨 User-Friendly Interface

- Clean, intuitive UI built with Chakra UI
- Dark/Light mode support with persistent preference
- Real-time feedback with toast notifications
- Empty state guidance for getting started

### 🚀 Productivity Features

- **Lint All**: Check all frames in your document at once
- **Lint Selected**: Focus on specific frames or sections
- **Focus Navigation**: Jump directly to any frame in your design
- **Live Updates**: Pattern changes apply immediately

## Use Cases

- **Design System Maintenance**: Ensure all components follow naming conventions
- **Team Collaboration**: Maintain consistency across multiple designers
- **Documentation**: Keep frame names descriptive and organized
- **Quality Assurance**: Catch naming issues before handoff to development

## Requirements

- [pnpm](https://pnpm.io/)

## Getting Started

1. Install dependencies with `pnpm install`
2. Build the plugin with `pnpm build`
3. Load the plugin in Figma
4. Define your naming patterns
5. Run the linter to find and fix invalid frame names
