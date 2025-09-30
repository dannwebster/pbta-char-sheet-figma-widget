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
