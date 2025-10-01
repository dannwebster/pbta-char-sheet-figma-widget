# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Figma widget project (PbtA Dice Roller) built with TypeScript and the Figma Widget API. The widget is designed for FigJam and currently implements a simple counter interface as a starting template.

## Build System

- **Build tool**: esbuild
- **Source**: `widget-src/code.tsx`
- **Output**: `dist/code.js` (ES6 target)
- **Widget entry point**: Registered via `widget.register(Widget)` at the end of code.tsx

### Common Commands

```bash
# Install dependencies
npm install

# Build the widget once
npm run build

# Watch mode (rebuilds on file changes)
npm run watch

# Type checking (without emitting files)
npm run tsc

# Lint code
npm run lint

# Lint and auto-fix
npm run lint:fix
```

## Architecture

### Widget Structure

The widget uses Figma's declarative widget API with React-like patterns:

- **State management**: `useSyncedState` hook for synchronized state across all widget instances
- **UI components**: `AutoLayout`, `Text`, `SVG` components from `figma.widget`
- **Property menu**: `usePropertyMenu` for contextual actions (conditionally shown based on state)
- **JSX configuration**: Uses `figma.widget.h` as JSX factory (not React)

### Key Files

- `widget-src/code.tsx`: Main widget implementation
- `widget-src/tsconfig.json`: TypeScript configuration with Figma-specific settings
- `manifest.json`: Figma plugin/widget metadata (editorType: "figjam", containsWidget: true)
- `package.json`: Build scripts and ESLint configuration

### TypeScript Configuration

- JSX factory: `figma.widget.h`
- JSX fragment factory: `figma.widget.Fragment`
- Target: ES2016
- Type roots include `@figma` packages for widget type definitions

## Development Workflow

1. Make changes to `widget-src/code.tsx`
2. Run `npm run watch` to continuously rebuild
3. Reload the widget in Figma/FigJam to see changes
4. Use `npm run tsc` to catch type errors before building

## ESLint Configuration

- Extends recommended rules plus `@figma/figma-plugins` plugin
- Uses TypeScript parser with type-aware linting
- Custom rule: Allows unused variables/args/errors prefixed with underscore
