# Figma Widget: Powered by the Apocalypse Character Sheet 

### This allows you to run a Powered by the Apocalypse game entirely in Figma
## Purpose
This allows you to run a Powered by the Apocalypse game entirely in Figma, by making an editable, interactable Figma Widget that allows editing character stats, and making rolls.

Currently, this is version is configured to run my own hack of Monster of the Week and City of Mist call Mysteries of the Mist.

## Source Code
[Source Code is on github](https://github.com/dannwebster/pbta-char-sheet-figma-widget)

### Key Files
The key file is moves.json, which defines all the moves. Modifying this file should auto-adjust the Attribute Buttons and names, the moves buttons, and the basic moves sheet.

## Ackhowledgements

Thank you to [lil-dice](https://www.figma.com/community/widget/1031933047254087478) for getting me started. The original code for the dice roller and dice icons are derived from their source-code

## Project Backlog
### Cosmetic
- [ ] move dice from right to left side of move buttons
- [ ] add tooltip over buttons
   - [ ] attribute moves
   - [ ] clock moves
   - [ ] attributes
   - [ ] contact moves
- [ ] add exclusions to when hold shows up
- [ ] make whole background white
- [ ] make equipment section wider
- [ ] make field names (ongoing, forward) longer, so they don't break mid word
- [ ] fix formatting of Flaws in Character Moves
- [ ] make popup's appear near mouse button that was clicked
    > currently, the attribute popup and the modifier popup always appear in the same place. instead make them appear relative to the button that was just clicked, about 100 px above, and 100 px to the right of the upper   right corner of the button.
- [ ] make all sizes (fonts, widths, etc) variables abstracted out and relative
- [ ] make the Coin field a selector field
### Bugs
- [ ] Flaw buttons don't work
### Features
- [ ] add a Charts section. 
- [ ] add a Charts section.
  - [ ] add a prices chart
- [ ] *Project* - make into a widget that saves a character data
   - [ ] abstract all data out into a Characters file
     - [ ] equipment
     - [ ] contacts
     - [ ] name
     - [ ] mythos info 
     - [ ] logos info
     - [ ] archetype
     - [ ] stats

- [ ] *Project* - make into a widget into a Plugin
   - [ ] change the Widget into a Plugin
   - [ ] create simple save/retrieve function that saves to a AWS bucket
   - [ ] put the JSON in that bucket

### Done
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
