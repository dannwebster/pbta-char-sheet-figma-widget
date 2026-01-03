# Figma Widget: Powered by the Apocalypse Character Sheet

## Purpose

This allows you to run a Powered by the Apocalypse game entirely in Figma, by making an editable, interactable Figma Widget that allows editing character stats, and making rolls.

The widget supports **multiple game systems** that can be switched between during play. Currently includes:
- **Heroes of the Mist** - A hack combining Monster of the Week and City of Mist mechanics
- **Monster of the Week** - Classic supernatural investigation

## Features

- **Multiple game system support** - Switch between different PbtA games
- **Character management** - Track stats, equipment, contacts, and conditions
- **Dice rolling** - Click to roll with modifiers (forward, ongoing, harm, stress)
- **Move history** - Track all rolls and outcomes
- **Character-specific moves** - Each character has their own special moves
- **Clocks and conditions** - Track harm, stress, and other game-specific clocks

## Source Code
[Source Code is on github](https://github.com/dannwebster/pbta-char-sheet-figma-widget)

## Adding a New Game System

Want to add your own PbtA game? Follow these steps:

### 1. Create game folder structure

```bash
mkdir -p widget-src/games/your-game-name/characters
```

### 2. Create `moves.json`

In `widget-src/games/your-game-name/moves.json`, define your game's moves and mechanics:

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
        }
      }
    ]
  },
  "AdditionalAttributes": [],
  "MultiAttributeMoves": [],
  "ClockMoves": [],
  "ContactMove": {}
}
```

### 3. Create character files

Create character JSON files in `characters/` folder with attributes, equipment, and contacts.

### 4. Create `character-loader.ts`

```typescript
import character1 from './characters/character1.json'
import character2 from './characters/character2.json'

export const characterModules = {
  character1,
  character2
}
```

### 5. Update `games/GameLoader.ts`

Add your game to the registry:

```typescript
// Add import
import yourGameMovesData from './your-game-name/moves.json'
import { characterModules as yourGameCharacters } from './your-game-name/character-loader'

// Add to GAMES object
export const GAMES: Record<string, GameData> = {
  // ... existing games
  'your-game-name': {
    id: 'your-game-name',
    name: 'Your Game Display Name',
    moves: yourGameMovesData,
    characters: Object.values(yourGameCharacters).flatMap(module => module.characters),
    isDefault: true  // Optional: make this the default game
  }
}
```

### 6. Rebuild

```bash
npm run build
```

For detailed documentation, see [CLAUDE.md](./CLAUDE.md).

## Ackhowledgements

Thank you to [lil-dice](https://www.figma.com/community/widget/1031933047254087478) for getting me started. The original code for the dice roller and dice icons are derived from their source-code

## Project Backlog
### Cosmetic
- [ ] add tooltip over buttons
   - [ ] attribute moves
   - [ ] clock moves
   - [ ] attributes
   - [ ] contact moves
- [ ] add exclusions to when hold shows up
- [ ] make whole background white
- [ ] add stars to starting contacts
- [ ] fix formatting of Flaws in Character Moves
- [ ] make popup's appear near mouse button that was clicked
    > currently, the attribute popup and the modifier popup always appear in the same place. instead make them appear relative to the button that was just clicked, about 100 px above, and 100 px to the right of the upper   right corner of the button.
- [ ] make all sizes (fonts, widths, etc) variables abstracted out and relative
- [ ] make the Coin field a selector field

### Data

### Refactors
- [ ] extract components
    - [ ] Move History
    - [ ] Charts
    - [ ] Basic Moves
    - [ ] Contacts Table 
    - [ ] Equipment Table
    - [ ] Character Moves
    - [ ] Clock Move Button
    - [ ] Clock Move Button
### Features
- [ ] contact button should put name of contact in work your connections
- [ ] add "look" under subtitle
- [ ] add tool and armor to type under equipment
- [ ] distinguish between starting and not-starting contacts and equipment with stars
- [ ] Add hold section (text, clock, notes)
  - [ ] juice
  - [ ] read a bad situation
  - [ ] investigate a mystery
  - [ ] gear
  - [ ] other
- [ ] *Project* - pull all widget information out into the characters json file 
   - [ ] abstract all data out into a Characters file
     - [ ] archetype
     - [ ] clocks
       - [ ] harm
       - [ ] stress
       - [ ] mythosAttention
       - [ ] fade
       - [ ] logosAttention
       - [ ] crack
       - [ ] hold section (text, clock, notes)
     - [x] equipment
     - [x] contacts
     - [x] name
     - [x] mythos info 
     - [x] logos info
     - [x] stats

- [ ] *Project* - make into a widget into a Plugin
   - [ ] change the Widget into a Plugin
   - [ ] create simple save/retrieve function that saves to a AWS bucket
   - [ ] put the JSON in that bucket

### Bugs

### Done
#### Data
- [x] First Aid
- [x] Down Time
- [x] Contact Moves
- [x] Explore Mythos/Logos Lore
- [x] Cultivate a Mythos/Logos Contact
#### Bugs and Features
- [x] make equipment section wider
- [x] make field names (ongoing, forward) longer, so they don't break mid word
- [x] restructure clock move buttons and clock moves data
- [x] mythos and logos values don't initialize until manually selecting an archetype
- [x] move dice from right to left side of move buttons
- [x] allow for merging any number of character files
    - [x] BUG: data is still too hardcoded. there must be some way to make it rely entirely on the manifest file.
    - [x] FIX: use character-loader.ts
- [x] Flaw buttons don't work
- [x] add a Charts section.
    - [x] add a prices chart
- [x] *Project* - save character move values
  - [x] add characters.json w/ logos and Mythos moves sections
  - [x] add logos/mythos moves page that shows them, with buttons
- [x] make widget load moves data that based on character name
- [x] make Harm and Stress Clocks real clocks with clock moves
- [x] ensure Health and Stress modifiers get added to rolls
- [x] change the Forward and Ongoing input to be in a popup when you roll
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
   
## Boilerplate
https://www.figma.com/widget-docs/setup-guide/

This widget template uses TypeScript and NPM, two standard tools in creating JavaScript applications.

First, download Node.js which comes with NPM. This will allow you to install TypeScript and other
libraries. You can find the download link here:

https://nodejs.org/en/download/

Next, install TypeScript, esbuild and the latest type definitions by running:

npm install

If you are familiar with JavaScript, TypeScript will look very familiar. In fact, valid JavaScript code
is already valid Typescript code.

TypeScript adds type annotations to variables. This allows code editors such as Visual Studio Code
to provide information about the Figma API while you are writing code, as well as help catch bugs
you previously didn't notice.

For more information, visit https://www.typescriptlang.org/

Using TypeScript requires a compiler to convert TypeScript (widget-src/code.tsx) into JavaScript (dist/code.js)
for the browser to run. We use esbuild to do this for us.

We recommend writing TypeScript code using Visual Studio code:

1. Download Visual Studio Code if you haven't already: https://code.visualstudio.com/.
2. Open this directory in Visual Studio Code.
3. Compile TypeScript to JavaScript: Run the "Terminal > Run Build Task..." menu item,
   then select "npm: watch". You will have to do this again every time
   you reopen Visual Studio Code.

That's it! Visual Studio Code will regenerate the JavaScript file every time you save.
