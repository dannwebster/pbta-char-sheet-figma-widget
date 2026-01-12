# Tasks
*[ ] Validate Heroes of the Mist functionality
*[ ] Submit to Figma 

## BUGS
*[ ] Charts moves to the top when you go back to a game with charts (otherwise it stays at the bottom)

## Visual/UI
*[ ] Make Clocks potentially horizontal
*[ ] make star not there for i-o equipment
*[ ] add a color for each game

## Correctness/Quality
*[ ] refactor all declarations in code.tsx that are game specific into the character loader

 
## Functionality
*[ ] Make Popups appear near mouse
*[ ] Make descriptions in Clock moves added to move history in addition to the basic stuff
*[ ] make array values into checkboxes (for haven, tools and techniques, etc)
*[ ] separate out Playbook funcitonality
  [ ] define attributes as per moves.json
  [ ] create a playbooks/ folder
  [ ] charactes should just be unique data, and names of icons and options that are checked

## Data

## Completed
*[x] Make sections Optional
  *[x] Logos/Mythos
    * BUG: Move Mythos/Logos chart into MythosAndLogos widget
  *[x] Contacts
  *[x] Charts
    *[x] Refactor Charts into the Game, and make them optional
  *[x] General Moves
*[x] Make Dropdown for Game
*[x] Make Dropdown for Characters
*[x] Make Experience optional
*[x] add a Look section
*[x] Make Lock icon lock game and character
*[x] Add popup when you need to Mark Experience. make Experience optional
*[x] Refactor Export Luck Special into Additional Moves, so that there is no anchormove/additionalmove
  *[x] for ruby.json
  *[x] for peeps.json
*[x] Replace Composure with Nerve
  *[x] Make sure Composure or Cool doesnt show up in any move (Nerve instead)
*[x] Replace Fortitude with Vigor
  *[x] Make sure Composure or Fortitude doesnt show up in any move (Vigor instead)
*[x] Replace Perception with Insight
  *[x] Make sure Perception or Sharp doesnt show up in any move (Insight instead)
*[x] Replace Kick some Ass with Necessary Violence
*[x] Remove "Gear Options" in peeps.json
*[x] add combat magic options into Ruby's equipment lest
*[x] make MultiAttributes Empty/nullableThe error indicates that the BasicMoves component is trying to access the name property of an undefined move. This is likely happening because invisible-orders and monster-of-the-week have empty MultiAttributeMoves arrays.
*[x] Widen the Attribute names
*[x] Make Clocks a list per game
  *[x] Harm
  *[x] Stress
  *[x] Luck
  *[x] Experience
*[x] Make Moves allow named arrays
*[x] Use Move Sections rather than logos and mythos moves

# Not Doing
## Cleanliness/Code Quality
*[ ] rename moves.json to rules.json

## Bugs
*[ ] Why do attributes not load initially
