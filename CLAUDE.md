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

# Project Backlog
## Cosmetic
- [ ] move dice from right to left side of move buttons
- [ ] add tooltip over buttons
  - [ ] attribute moves
  - [ ] clock moves
  - [ ] attributes
  - [ ] contact moves 
- [ ] add exclusions to when hold shows up
- [ ] make whole background white
- [ ] make equipment section wider
- [ ] make all sizes (fonts, widths, etc) variables abstracted out and relative
- [ ] make the Coin field a selector field
## Required
- [ ] make Harm and Stress Clocks real clocks with clock moves
- [ ] change the Forward and Ongoing input to be in a popup when you roll
- [ ] ensure Health and Stress modifiers get added to rolls
- [ ] *Project* - save character move values
  - [ ] add characters.json w/ logos and Mythos moves sections
  - [ ] add logos/mythos moves page that shows them, with buttons
- [ ] *Project* - make into a widget that saves a character data
    - [ ] abstract all data out into a Characters file
    - [ ] make widget load that based on character name
    - [ ] change the Widget into a Plugin
    - [ ] create simple save/retrieve function that saves to a AWS bucket
    - [ ] put the JSON in that bucket

## Done
- [x] add dice to contact moves
- [x] add basic moves sheet that is expandible and collapsible
- [x] add track  for logos and mythos, with values for each that effect logos and mythos
  - create a table above the Mythos and Logos sections that has 3 rows and 5 columns. Row headers are (empty), "Mythos", and "Logos". Column headers are Avatar, Legendary, Borderliner, Touched, Sleeper. The Column headers should be selectable, radio-button style. Under avatar, the Mythos column is +4, and the Logos column is +0. the remaining column values are +3/+1, +2/+2, +1/+3, and +0/+4 (where the / represents a row break)
    - when a column is selected from this table, the cell value in the Mythos row of that column represents the value of Mythos when making a Mythos roll. Similarly, the cell value in the Logos row of that column represents the value of Logos when making a Logos roll.
- [x] Get rid of the Roll section below the main section
  - hide remove the "roll" section of the widget below the main section, as now the "roll" information is contained in the move history tiles
- [x] get color coding added to Roll section
  - [x] red background/white foreground for final outcome
  - [x] white on green for dice roll
  - [x] white on blue for attribute
  - [x] blue for ongoing
  - [x] green for forward
  - [x] red for health