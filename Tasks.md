# Tasks
*[ ] Validate Heroes of the Mist functionality
*[ ] Submit to Figma 

## BUGS
*[ ] Why do attributes not load initially

## Visual/UI
*[ ] Make Clocks potentially horizontal
*[ ] make star not there for i-o equipment
*[ ] add a color for each game
*[ ] Make Dropdown for Game
*[ ] Make Dropdown for Characters

## Correctness/Quality
*[ ] refactor all declarations in code.tsx that are game specific into the character loader
*[ ] rename moves.json to rules.json
 
## Functionality
*[ ] Make Lock icon lock game and character
*[ ] Made descriptions in Clock moves added to move history in addition to the basic stuff
*[ ] Refactor Charts into the Game
*[ ] make array values into checkboxes (for haven, tools and techniques, etc)
*[ ] Make sections Optional
  *[x] Logos/Mythos
    * BUG: Move Mythos/Logos chart into MythosAndLogos widget
  *[x] Contacts
  *[ ] Charts
  *[ ] General Moves

## Data
*[ ] Refactor Export Luck Special into Additional Moves, so that there is no anchormove/additionalmove
  *[ ] for ruby.json
  *[ ] for peeps.json
*[ ] add combat magic options into Ruby's equipment lest
*[ ] Remove "Gear Options" in peeps.json
*[ ] Replace Composure with Nerve
  *[ ] Make sure Composure or Cool doesnt show up in any move (Nerve instead)
*[ ] Replace Perception with Insight
  *[ ] Make sure Perception or Sharp doesnt show up in any move (Insight instead)


## Completed
*[x] make MultiAttributes Empty/nullableThe error indicates that the BasicMoves component is trying to access the name property of an undefined move. This is likely happening because invisible-orders and monster-of-the-week have empty MultiAttributeMoves arrays.
*[x] Widen the Attribute names
*[x] Make Clocks a list per game
  *[x] Harm
  *[x] Stress
  *[x] Luck
  *[x] Experience
*[x] Make Moves allow named arrays
*[x] Use Move Sections rather than logos and mythos moves
