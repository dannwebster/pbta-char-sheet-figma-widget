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

## Game System Architecture

The widget supports multiple PbtA (Powered by the Apocalypse) game systems through a static import structure. Games are compiled into the widget at build time.

### Directory Structure

```
widget-src/
  lib/
    GameDefinition.ts       # Type definitions and helper functions
  games/
    GameLoader.ts           # Central game registry (static imports)
    heroes-of-the-mist/     # Example game system
      moves.json            # Game moves and mechanics
      CharacterLoader.ts    # Character imports
      characters/           # Character JSON files
        dakota.json
        jake.json
        silas.json
    monster-of-the-week/    # Example game system
      moves.json
      CharacterLoader.ts
      characters/
        sam-winchester.json
        buffy-summers.json
        mulder-scully.json
```

### Key Files

- **`lib/GameDefinition.ts`**: Contains the `GameData` interface and helper functions (`getGameData()`, `getAvailableGames()`, `getDefaultGame()`)
- **`games/GameLoader.ts`**: Imports all game data and exports the `GAMES` object. This is the only file that needs modification when adding a new game.
- **`games/[game-name]/moves.json`**: Defines the game's moves, attributes, clocks, and mechanics
- **`games/[game-name]/CharacterLoader.ts`**: Imports and exports all character files for the game
- **`games/[game-name]/characters/*.json`**: Individual character definitions

### Adding a New Game System

To add a new game to the widget:

#### 1. Create the game folder structure

```bash
mkdir -p widget-src/games/your-game-name/characters
```

#### 2. Create `moves.json`

In `widget-src/games/your-game-name/moves.json`, define your game's moves and mechanics. Required structure:

```json
{
  "AttributeMoves": {
    "AttributeName": [
      {
        "name": "Move Name",
        "description": "When you do something..., roll +Attribute",
        "outcomes": {
          "10+": "Success description",
          "7-9": "Partial success description",
          "6-": "Failure description"
        },
        "hold": [
          "Optional hold spending options"
        ]
      }
    ]
  },
  "AdditionalAttributes": [],
  "MultiAttributeMoves": [
    {
      "Name": "Section Name",
      "Attributes": ["Attribute1", "Attribute2"],
      "Moves": []
    }
  ],
  "ClockMoves": [
    {
      "name": "Clock Name",
      "clock": "clockStateName",
      "description": "Clock description",
      "advance": [{"name": "Advance Move", "description": "..."}],
      "rollback": [{"name": "Rollback Move", "description": "..."}]
    }
  ],
  "ContactMove": {
    "name": "Contact Move Name",
    "description": "When you use a contact...",
    "outcomes": {},
    "hold": []
  }
}
```

#### 3. Create character JSON files

In `widget-src/games/your-game-name/characters/`, create character files:

```json
{
  "characters": [
    {
      "name": "Character Name",
      "subtitle": "Character Archetype",
      "attributes": [
        { "name": "AttributeName", "value": 2 }
      ],
      "contacts": [
        {
          "name": "Contact Name",
          "type": "Mythos",
          "rating": 1,
          "expertise": "Area of expertise",
          "relationship": "How you know them",
          "description": "Brief description"
        }
      ],
      "equipment": [
        {
          "name": "Item Name",
          "type": "melee",
          "coin": 0,
          "harm": 2,
          "tags": "close, messy"
        }
      ]
    }
  ]
}
```

#### 4. Create `CharacterLoader.ts`

In `widget-src/games/your-game-name/CharacterLoader.ts`, import all your character files:

```typescript
import character1 from './characters/character1.json'
import character2 from './characters/character2.json'

export const characterModules = {
  character1,
  character2
}
```

#### 5. Update `games/GameLoader.ts`

In `widget-src/games/GameLoader.ts`, add your game to the central registry:

```typescript
// Add import at the top
import yourGameMovesData from './your-game-name/moves.json'
import { characterModules as yourGameCharacters } from './your-game-name/CharacterLoader'

// Add to the GAMES object
export const GAMES: Record<string, GameData> = {
  // ... existing games
  'your-game-name': {
    id: 'your-game-name',
    name: 'Your Game Display Name',
    moves: yourGameMovesData,
    characters: Object.values(yourGameCharacters).flatMap(module => module.characters)
  }
}
```

To set a game as the default, add `isDefault: true` to its entry.

#### 6. Rebuild

```bash
npm run build
# or if watch is running, it will auto-rebuild
```

### Important Notes

- **Static imports only**: Games must be imported at build time. You cannot add games at runtime.
- **One default game**: Only one game should have `isDefault: true` in the GAMES object.
- **Game switching**: Users can switch between games using the game selector in the widget UI (when unlocked).
