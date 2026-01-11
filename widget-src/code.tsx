const { widget } = figma
const { Rectangle, AutoLayout, Frame, Text, useSyncedState, usePropertyMenu, useEffect, Ellipse, Input } = widget

import { charts as chartsData } from './charts.js'
import { GAMES } from './games/GameLoader'
import { getGameData, getAvailableGames, getDefaultGame } from './lib/GameDefinition'
import { Grid } from './Grid'
import { MoveHistory } from './components/MoveHistory'
import { BasicMoves } from './components/BasicMoves'
import { CharacterMoves } from './components/CharacterMoves'
import { Clocks } from './components/Clocks'
import { Contacts } from './components/Contacts'
import { MythosAndLogos } from './components/MythosAndLogos'
import { Dialog } from './components/Dialog'

function pbta_character() {
  // Game selection state
  const [selectedGame, setSelectedGame] = useSyncedState("selectedGame", getDefaultGame(GAMES).id)

  // Load game data based on selected game
  const gameData = getGameData(GAMES, selectedGame)
  const movesData = gameData.moves
  const characterData = { characters: gameData.characters }

  // Build attributes array dynamically from AttributeMoves keys
  const moves = movesData.AttributeMoves
  const attributes = Object.keys(moves)

  const [initialized, setInitialized] = useSyncedState("initialized", false)
  const [sides1, setSides1] = useSyncedState("side1", null)
  const [sides2, setSides2] = useSyncedState("side2", null)
  const [modifier, setModifier] = useSyncedState("modifier", 0)
  const [modifierName, setModifierName] = useSyncedState("modifierName", "")
  const [forward, setForward] = useSyncedState("forward", 0)
  const [ongoing, setOngoing] = useSyncedState("ongoing", 0)
  const [characterName, setCharacterName] = useSyncedState("characterName", characterData.characters[0]?.name || "")
  const [selectedMove, setSelectedMove] = useSyncedState("selectedMove", null)
  const [moveHistory, setMoveHistory] = useSyncedState("moveHistory", [])
  const [historyPage, setHistoryPage] = useSyncedState("historyPage", 0)
  const [attributesLocked, setAttributesLocked] = useSyncedState("attributesLocked", false)
  const [pendingMultiAttributeMove, setPendingMultiAttributeMove] = useSyncedState("pendingMultiAttributeMove", null)
  const [characterMovesExpanded, setCharacterMovesExpanded] = useSyncedState("characterMovesExpanded", false)
  const [basicMovesExpanded, setBasicMovesExpanded] = useSyncedState("basicMovesExpanded", false)
  const [chartsExpanded, setChartsExpanded] = useSyncedState("chartsExpanded", false)
  const [pendingRoll, setPendingRoll] = useSyncedState("pendingRoll", null)
  const [popupForward, setPopupForward] = useSyncedState("popupForward", 0)
  const [popupOngoing, setPopupOngoing] = useSyncedState("popupOngoing", 0)
  const [popupApplyHarm, setPopupApplyHarm] = useSyncedState("popupApplyHarm", true)
  const [popupApplyStress, setPopupApplyStress] = useSyncedState("popupApplyStress", true)
  const [selectedTooltipMove, setSelectedTooltipMove] = useSyncedState("selectedTooltipMove", null)

  // Archetype selection
  const [selectedArchetype, setSelectedArchetype] = useSyncedState("selectedArchetype", "Borderliner")

  // Mythos and Logos fields
  const [mythosName, setMythosName] = useSyncedState("mythosName", "")
  const [mythosConcept, setMythosConcept] = useSyncedState("mythosConcept", "")
  const [mythosQuestion, setMythosQuestion] = useSyncedState("mythosQuestion", "")
  const [mythosAttention, setMythosAttention] = useSyncedState("mythosAttention", [false, false, false, false, false])
  const [mythosFade, setMythosFade] = useSyncedState("mythosFade", [false, false, false])
  const [mythosValue, setMythosValue] = useSyncedState("mythosValue", 2)
  const [logosName, setLogosName] = useSyncedState("logosName", "")
  const [logosConcept, setLogosConcept] = useSyncedState("logosConcept", "")
  const [logosStatement, setLogosStatement] = useSyncedState("logosStatement", "")
  const [logosAttention, setLogosAttention] = useSyncedState("logosAttention", [false, false, false, false, false])
  const [logosCrack, setLogosCrack] = useSyncedState("logosCrack", [false, false, false])
  const [logosValue, setLogosValue] = useSyncedState("logosValue", 2)

  // Helper function to get attribute value from any source
  const getAttributeValue = (attrName: string): number => {
    // Check if it's in additionalAttributes
    if (movesData.AdditionalAttributes?.includes(attrName)) {
      // Dynamically map additional attributes to their state values
      const additionalAttrMap: Record<string, number> = {}
      movesData.AdditionalAttributes.forEach((attr: string) => {
        if (attr === "Mythos") additionalAttrMap[attr] = mythosValue
        if (attr === "Logos") additionalAttrMap[attr] = logosValue
      })
      return additionalAttrMap[attrName] || 0
    }
    // Otherwise check standard attributes
    return attributeValues[attrName] || 0
  }

  // Load clock definitions from game data
  const clockDefinitions = movesData.Clocks || []

  // Check if this game uses experience
  const usesExperience = clockDefinitions.some(clock => clock.clockId === 'experience')

  // Helper function to get modifier from a clock by clockId
  const getClockModifier = (clockId: string, clockState: boolean[]): number => {
    const clockDef = clockDefinitions.find(c => c.clockId === clockId)
    if (!clockDef) return 0

    let lastCheckedIndex = -1
    for (let i = clockState.length - 1; i >= 0; i--) {
      if (clockState[i]) {
        lastCheckedIndex = i
        break
      }
    }
    if (lastCheckedIndex === -1) return 0
    const modStr = clockDef.entries[lastCheckedIndex]?.modifier || ""
    return modStr ? parseInt(modStr) : 0
  }

  // Helper function to get current Harm modifier
  const getHarmModifier = (): number => {
    return getClockModifier('harm', harmChecked)
  }

  // Helper function to get current Stress modifier
  const getStressModifier = (): number => {
    return getClockModifier('stress', stressChecked)
  }

  // Standard outcomes for basic rolls
  const STANDARD_OUTCOMES = {
    outcomes: {
      "13+": "Critical Success",
      "10+": "Great Success",
      "7-9": "Partial Success",
      "6-": "Failure"
    }
  }

  const [harmChecked, setHarmChecked] = useSyncedState("harmChecked", Array(7).fill(false))
  const [stressChecked, setStressChecked] = useSyncedState("stressChecked", Array(7).fill(false))
  const [luckChecked, setLuckChecked] = useSyncedState("luckChecked", Array(7).fill(false))
  const [experienceChecked, setExperienceChecked] = useSyncedState("experienceChecked", Array(5).fill(false))
  const [showLevelUpPopup, setShowLevelUpPopup] = useSyncedState("showLevelUpPopup", false)
  const [showMarkExperiencePopup, setShowMarkExperiencePopup] = useSyncedState("showMarkExperiencePopup", false)
  const [pendingExperienceRollIndex, setPendingExperienceRollIndex] = useSyncedState("pendingExperienceRollIndex", -1)
  const [harmSymbols, setHarmSymbols] = useSyncedState("harmSymbols", Array(7).fill(""))
  const [stressSymbols, setStressSymbols] = useSyncedState("stressSymbols", Array(7).fill(""))
  const [harmModifiers, setHarmModifiers] = useSyncedState("harmModifiers", Array(7).fill(""))
  const [stressModifiers, setStressModifiers] = useSyncedState("stressModifiers", Array(7).fill(""))

  // Contacts tracking
  const [contactNames, setContactNames] = useSyncedState("contactNames", Array(5).fill(""))
  const [contactTypes, setContactTypes] = useSyncedState("contactTypes", Array(5).fill("Mythos"))
  const [contactRatings, setContactRatings] = useSyncedState("contactRatings", Array(5).fill(0))
  const [contactExpertise, setContactExpertise] = useSyncedState("contactExpertise", Array(5).fill(""))
  const [contactRelationships, setContactRelationships] = useSyncedState("contactRelationships", Array(5).fill(""))
  const [contactDescriptions, setContactDescriptions] = useSyncedState("contactDescriptions", Array(5).fill(""))

  // Equipment tracking
  const equipmentTypeOptions = ["melee", "ranged", "vehicle", "domicile", "accessory", ""]
  const [equipmentNames, setEquipmentNames] = useSyncedState("equipmentNames", Array(7).fill(""))
  const [equipmentTypes, setEquipmentTypes] = useSyncedState("equipmentTypes", ["melee", "ranged", "vehicle", "domicile", "accessory", "accessory", ""])
  const [equipmentCoin, setEquipmentCoin] = useSyncedState("equipmentCoin", Array(7).fill(0))
  const [equipmentHarm, setEquipmentHarm] = useSyncedState("equipmentHarm", Array(7).fill(null))
  const [equipmentTags, setEquipmentTags] = useSyncedState("equipmentTags", Array(7).fill(""))

  // Snapshot of modifiers used in the last roll
  const [rolledForward, setRolledForward] = useSyncedState("rolledForward", 0)
  const [rolledOngoing, setRolledOngoing] = useSyncedState("rolledOngoing", 0)
  const [rolledModifier, setRolledModifier] = useSyncedState("rolledModifier", 0)
  const [rollText, setRollText] = useSyncedState("rollText", "")

  // Initialize attribute values as an object
  const initialAttributeValues = {}
  attributes.forEach(attr => {
    initialAttributeValues[attr] = 0
  })
  const [attributeValues, setAttributeValues] = useSyncedState("attributeValues", initialAttributeValues)

  let roll = (mod, name, moveData = null, forwardMod = 0, ongoingMod = 0, harmMod = 0, stressMod = 0, subtitle = null) => {
    let number1 = Math.floor(Math.random() * 6) + 1
    let number2 = Math.floor(Math.random() * 6) + 1
    let total = number1 + number2 + mod + forwardMod + ongoingMod + harmMod + stressMod

    // Build roll text
    let rollTextStr = `${total} = [(${number1} + ${number2})`
    if (name) {
      rollTextStr += modifierName && mod !== 0 ? (mod >= 0 ? ' +' + mod : ' -' + Math.abs(mod)) + ' (' + name + ')' : mod === 0 ? ' +' + mod + ' (' + name + ')' : ''
    }
    rollTextStr += ']'
    if (forwardMod !== 0) {
      rollTextStr += (forwardMod >= 0 ? ' +' + forwardMod : ' -' + Math.abs(forwardMod)) + ' (Forward)'
    }
    if (ongoingMod !== 0) {
      rollTextStr += (ongoingMod >= 0 ? ' +' + ongoingMod : ' -' + Math.abs(ongoingMod)) + ' (Ongoing)'
    }
    if (harmMod !== 0) {
      rollTextStr += (harmMod >= 0 ? ' +' + harmMod : ' -' + Math.abs(harmMod)) + ' (Harm)'
    }
    if (stressMod !== 0) {
      rollTextStr += (stressMod >= 0 ? ' +' + stressMod : ' -' + Math.abs(stressMod)) + ' (Stress)'
    }

    // Save snapshot of modifiers used in this roll
    setSides1(number1)
    setSides2(number2)
    setRolledModifier(mod)
    setModifierName(name)
    setRolledForward(forwardMod)
    setRolledOngoing(ongoingMod)
    setRollText(rollTextStr)

    // Add to move history if a move was passed directly
    if (moveData) {
      const historyEntry = {
        type: "move",
        move: {
          ...moveData,
          description: moveData.description || null
        },
        subtitle: subtitle,
        total: total,
        dice: [number1, number2],
        modifier: mod,
        modifierName: name,
        forward: forwardMod,
        ongoing: ongoingMod,
        harm: harmMod,
        stress: stressMod,
        rollText: rollTextStr,
        timestamp: Date.now()
      }
      console.log('HISTORY ENTRY:', JSON.stringify(historyEntry, null, 2))
      setMoveHistory([historyEntry, ...moveHistory])

      // Show mark experience popup if roll is 6 or less (only if game uses experience)
      if (usesExperience && total <= 6) {
        setPendingExperienceRollIndex(0) // New entry is at index 0
        setShowMarkExperiencePopup(true)
      }
    }

    console.log(number1, number2, mod, forwardMod, ongoingMod, harmMod, stressMod)
    figma.notify('You rolled a ' + number1 + ' and a ' + number2 + ' (total: ' + total + ')')
  }

  // Clock registry - maps clock names to their state, setter, and size
  const clocks = {
    'mythosFade': { state: mythosFade, setter: setMythosFade, size: 3 },
    'logosCrack': { state: logosCrack, setter: setLogosCrack, size: 3 },
    'mythosAttention': { state: mythosAttention, setter: setMythosAttention, size: 5 },
    'logosAttention': { state: logosAttention, setter: setLogosAttention, size: 5 },
    'harm': { state: harmChecked, setter: setHarmChecked, size: 7 },
    'stress': { state: stressChecked, setter: setStressChecked, size: 7 },
    'luck': { state: luckChecked, setter: setLuckChecked, size: 7 },
    'experience': {
      state: experienceChecked,
      setter: setExperienceChecked,
      size: 5,
      onCheckboxChange: (index: number, newState: boolean[]) => {
        // Check if the 5th checkbox (index 4) was just checked (only if game uses experience)
        if (usesExperience && index === 4 && newState[4] === true) {
          setShowLevelUpPopup(true)
        }
      }
    }
  }

  // Fix corrupted clock states
  useEffect(() => {
    Object.entries(clocks).forEach(([name, clock]) => {
      if (clock.state.length !== clock.size) {
        console.log(`Fixing ${name} length from ${clock.state.length} to ${clock.size}`)
        clock.setter(Array(clock.size).fill(false))
      }
    })
  })

  const handleClockMove = (clockName, action, moveName) => {
    console.log('handleClockMove called:', clockName, action)
    const clock = clocks[clockName]
    console.log('clock:', clock)
    if (!clock) {
      console.log('No clock found for:', clockName)
      return
    }
    if (!Array.isArray(clock.state)) {
      console.log('Clock state is not an array:', clock.state)
      return
    }

    const currentState = clock.state
    console.log('currentState:', currentState)

    // Clock display names
    const clockDisplayNames = {
      'mythosFade': 'Fade',
      'logosCrack': 'Crack',
      'mythosAttention': 'Mythos Attention',
      'logosAttention': 'Logos Attention',
      'harm': 'Harm',
      'stress': 'Stress',
      'luck': 'Luck',
      'experience': 'Experience'
    }

    let didChange = false
    let newClockValue = 0

    if (action === 'advance') {
      // Find first unchecked box
      let firstUnchecked = -1
      for (let i = 0; i < currentState.length; i++) {
        console.log('Checking index', i, ':', currentState[i], 'type:', typeof currentState[i])
        if (currentState[i] === false) {
          firstUnchecked = i
          break
        }
      }
      console.log('firstUnchecked:', firstUnchecked)
      if (firstUnchecked !== -1) {
        const newClock = [...currentState]
        newClock[firstUnchecked] = true
        console.log('Setting new clock state:', newClock)
        clock.setter(newClock)
        console.log('Set New Clock State:', newClock)
        didChange = true
        newClockValue = newClock.filter(v => v === true).length
        console.log('New Clock Value:', newClockValue)
      }
    } else if (action === 'rollback') {
      // Find last checked box
      for (let i = currentState.length - 1; i >= 0; i--) {
        if (currentState[i] === true) {
          const newClock = [...currentState]
          newClock[i] = false
          clock.setter(newClock)
          didChange = true
          newClockValue = newClock.filter(v => v === true).length
          break
        }
      }
    }

    // Add to move history if the clock was changed
    if (didChange) {
      const actionText = action === 'advance' ? 'Advanced' : 'Rolled back'
      const clockDisplayName = clockDisplayNames[clockName] || clockName
      const description = `${actionText} the ${clockDisplayName} clock by 1. ${clockDisplayName} now at ${newClockValue}`

      console.log('Logging Description for Clock Value:', description)
      const historyEntry = {
        type: "clock",
        move: {
          name: moveName,
          description: description
        },
        timestamp: Date.now()
      }
      console.log('Adding Move History:', historyEntry)
      setMoveHistory([historyEntry, ...moveHistory])
      console.log('Finished Setting :', historyEntry)
    }
  }

  useEffect(() => {
    figma.widget.waitForTask(() => new Promise(async resolve => {
      if (!initialized) {
        roll()
        loadAttributesFromCharacter(characterName)
        loadConceptFromCharacter(characterName)
        setInitialized(true)
      }

      resolve(true)
    }))
  })

  // Helper function to load equipment from character data
  const loadEquipmentFromCharacter = (charName) => {
    const currentCharacter = characterData.characters.find(c => c.name === charName)
    if (currentCharacter && currentCharacter.equipment) {
      const equipment = currentCharacter.equipment
      const maxItems = 7

      const names = Array(maxItems).fill("")
      const types = Array(maxItems).fill("")
      const coins = Array(maxItems).fill(0)
      const harms = Array(maxItems).fill(null)
      const tags = Array(maxItems).fill("")

      equipment.forEach((item, idx) => {
        if (idx < maxItems) {
          names[idx] = item.name || ""
          types[idx] = item.type || ""
          coins[idx] = item.coin !== undefined && item.coin !== null ? item.coin : 0
          // Handle harm - can be string ("+2"), number, or null/undefined
          if (item.harm !== undefined && item.harm !== null) {
            // Keep as-is (string or number)
            harms[idx] = item.harm
          } else {
            harms[idx] = null
          }
          tags[idx] = item.tags || ""
        }
      })

      setEquipmentNames(names)
      setEquipmentTypes(types)
      setEquipmentCoin(coins)
      setEquipmentHarm(harms)
      setEquipmentTags(tags)
    }
  }

  // Helper function to load contacts from character data
  const loadContactsFromCharacter = (charName) => {
    const currentCharacter = characterData.characters.find(c => c.name === charName)
    const maxContacts = 5

    const names = Array(maxContacts).fill("")
    const types = Array(maxContacts).fill("Mythos")
    const ratings = Array(maxContacts).fill(0)
    const expertise = Array(maxContacts).fill("")
    const relationships = Array(maxContacts).fill("")
    const descriptions = Array(maxContacts).fill("")

    if (currentCharacter && currentCharacter.contacts) {
      const contacts = currentCharacter.contacts

      contacts.forEach((contact, idx) => {
        if (idx < maxContacts) {
          names[idx] = contact.name || ""
          types[idx] = contact.type || "Mythos"
          ratings[idx] = contact.rating !== undefined && contact.rating !== null ? contact.rating : 0
          expertise[idx] = contact.expertise || ""
          relationships[idx] = contact.relationship || ""
          descriptions[idx] = contact.description || ""
        }
      })
    }

    setContactNames(names)
    setContactTypes(types)
    setContactRatings(ratings)
    setContactExpertise(expertise)
    setContactRelationships(relationships)
    setContactDescriptions(descriptions)
  }

  // Helper function to load attributes from character data
  const loadAttributesFromCharacter = (charName) => {
    const currentCharacter = characterData.characters.find(c => c.name === charName)

    if (currentCharacter && currentCharacter.attributes) {
      const newAttributeValues = { ...attributeValues }
      currentCharacter.attributes.forEach(attr => {
        if (attr.name && attr.value !== undefined) {
          newAttributeValues[attr.name] = attr.value
        }
      })
      setAttributeValues(newAttributeValues)
    }
  }

  // Helper function to load concept data from character data
  const loadConceptFromCharacter = (charName) => {
    const currentCharacter = characterData.characters.find(c => c.name === charName)

    if (currentCharacter && currentCharacter.concept) {
      const mythosConcept = currentCharacter.concept.find(c => c.type === "Mythos")
      const logosConcept = currentCharacter.concept.find(c => c.type === "Logos")

      if (mythosConcept) {
        setMythosName(mythosConcept.name || "")
        setMythosConcept(mythosConcept.concept || "")
        setMythosQuestion(mythosConcept.tenet || "")
      }

      if (logosConcept) {
        setLogosName(logosConcept.name || "")
        setLogosConcept(logosConcept.concept || "")
        setLogosStatement(logosConcept.tenet || "")
      }
    }
  }

  return (
      <AutoLayout direction="vertical" spacing={16}>
        <AutoLayout direction="horizontal" spacing={16}>
      <AutoLayout direction="vertical" spacing={0} horizontalAlignItems="center" stroke="#333333" strokeWidth={2} cornerRadius={8} width={1200}>
        {/* Game Selection Header */}
        <AutoLayout padding={16} width="fill-parent" fill="#F0F0F0" spacing={16} verticalAlignItems="center">
          <Text fontSize={32} fontWeight={700}>Game: </Text>
          <AutoLayout
              fill="#333333"
              padding={12}
              cornerRadius={8}
              onClick={() => {
                const availableGames = getAvailableGames(GAMES)
                const currentIndex = availableGames.findIndex(g => g.id === selectedGame)
                const nextIndex = (currentIndex + 1) % availableGames.length
                const newGame = availableGames[nextIndex].id
                setSelectedGame(newGame)
                // Reset character to first character of new game
                const newGameData = getGameData(GAMES, newGame)
                if (newGameData.characters.length > 0) {
                  setCharacterName(newGameData.characters[0].name)
                  loadEquipmentFromCharacter(newGameData.characters[0].name)
                  loadContactsFromCharacter(newGameData.characters[0].name)
                  loadAttributesFromCharacter(newGameData.characters[0].name)
                  loadConceptFromCharacter(newGameData.characters[0].name)
                }
              }}
              width="fill-parent"
              horizontalAlignItems="center"
          >
            <Text fontSize={32} fontWeight={700} fill="#FFFFFF">
              {getAvailableGames(GAMES).find(g => g.id === selectedGame)?.name || selectedGame}
            </Text>
          </AutoLayout>
        </AutoLayout>
        {/* Character Selection Header */}
        <AutoLayout padding={16} width="fill-parent" fill="#FFFFFF" spacing={16} verticalAlignItems="center">
          <AutoLayout
              fill={attributesLocked ? "#FF5555" : "#55FF55"}
              padding={12}
              cornerRadius={8}
              onClick={() => setAttributesLocked(!attributesLocked)}
          >
            <Text fontSize={32} fontWeight={700}>{attributesLocked ? "🔒" : "🔓"}</Text>
          </AutoLayout>
          <Text fontSize={40} fontWeight={700}>Character: </Text>
          <AutoLayout
              fill="#E6E6E6"
              padding={12}
              cornerRadius={8}
              onClick={() => {
                const currentIndex = characterData.characters.findIndex(c => c.name === characterName)
                const nextIndex = (currentIndex + 1) % characterData.characters.length
                const newCharacterName = characterData.characters[nextIndex].name
                setCharacterName(newCharacterName)
                loadEquipmentFromCharacter(newCharacterName)
                loadContactsFromCharacter(newCharacterName)
                loadAttributesFromCharacter(newCharacterName)
                loadConceptFromCharacter(newCharacterName)
              }}
              width="fill-parent"
              direction="vertical"
              horizontalAlignItems="center"
              verticalAlignItems="center"
              spacing={4}
          >
            <Text fontSize={40} fontWeight={700}>{characterName}</Text>
            <Text fontSize={28} fill="#666666">{characterData.characters.find(c => c.name === characterName)?.subtitle || null}</Text>
          </AutoLayout>
        </AutoLayout>
        {movesData.usesMythosAndLogos && (
          <MythosAndLogos
            mythosName={mythosName}
            setMythosName={setMythosName}
            mythosConcept={mythosConcept}
            setMythosConcept={setMythosConcept}
            mythosQuestion={mythosQuestion}
            setMythosQuestion={setMythosQuestion}
            mythosAttention={mythosAttention}
            setMythosAttention={setMythosAttention}
            mythosFade={mythosFade}
            setMythosFade={setMythosFade}
            mythosValue={mythosValue}
            setMythosValue={setMythosValue}
            logosName={logosName}
            setLogosName={setLogosName}
            logosConcept={logosConcept}
            setLogosConcept={setLogosConcept}
            logosStatement={logosStatement}
            setLogosStatement={setLogosStatement}
            logosAttention={logosAttention}
            setLogosAttention={setLogosAttention}
            logosCrack={logosCrack}
            setLogosCrack={setLogosCrack}
            logosValue={logosValue}
            setLogosValue={setLogosValue}
            selectedArchetype={selectedArchetype}
            setSelectedArchetype={setSelectedArchetype}
            setPendingRoll={setPendingRoll}
            STANDARD_OUTCOMES={STANDARD_OUTCOMES}
          />
        )}
        <AutoLayout direction="horizontal" spacing={24} padding={24} horizontalAlignItems="start">
          <AutoLayout direction="vertical" spacing={8}>
            {attributes.map(attr => (
              <AutoLayout
                  key={attr}
                  fill="#FFFFFF"
                  padding={12}
                  cornerRadius={8}
                  spacing={12}
                  verticalAlignItems="center"
              >
                <AutoLayout direction="vertical" spacing={4}>
                  <AutoLayout
                      fill={attributesLocked ? "#FFCCCC" : "#CCFFCC"}
                      padding={4}
                      cornerRadius={4}
                      width={24}
                      horizontalAlignItems="center"
                      onClick={() => {
                        if (!attributesLocked) {
                          const newVal = Math.min(5, attributeValues[attr] + 1)
                          setAttributeValues({
                            ...attributeValues,
                            [attr]: newVal
                          })
                        }
                      }}
                  >
                    <Text fontSize={12} fontWeight={600} opacity={attributesLocked ? 0.5 : 1}>+</Text>
                  </AutoLayout>
                  <AutoLayout
                      fill={attributesLocked ? "#FFCCCC" : "#CCFFCC"}
                      padding={4}
                      cornerRadius={4}
                      width={24}
                      horizontalAlignItems="center"
                      onClick={() => {
                        if (!attributesLocked) {
                          const newVal = Math.max(-5, attributeValues[attr] - 1)
                          setAttributeValues({
                            ...attributeValues,
                            [attr]: newVal
                          })
                        }
                      }}
                  >
                    <Text fontSize={12} fontWeight={600} opacity={attributesLocked ? 0.5 : 1}>-</Text>
                  </AutoLayout>
                </AutoLayout>
                <Frame
                    width={60}
                    height={60}
                    stroke="#333333"
                    strokeWidth={2}
                    cornerRadius={30}
                    fill="#FFFFFF"
                >
                  <AutoLayout
                      width={60}
                      height={60}
                      horizontalAlignItems="center"
                      verticalAlignItems="center"
                  >
                    <Input
                        value={(attributeValues[attr] >= 0 ? '+' : '') + String(attributeValues[attr])}
                        onTextEditEnd={(e) => {
                          if (!attributesLocked) {
                            let val = parseInt(e.characters)
                            if (!isNaN(val)) {
                              setAttributeValues({
                                ...attributeValues,
                                [attr]: Math.max(-5, Math.min(5, val))
                              })
                            }
                          }
                        }}
                        fontSize={24}
                        width={50}
                        horizontalAlignText="center"
                    />
                  </AutoLayout>
                </Frame>
                <AutoLayout
                    onClick={() => {
                      const attributeRoll = {
                        name: "+" + attr,
                        description: null,
                        ...STANDARD_OUTCOMES
                      }
                      setPendingRoll({ modifier: attributeValues[attr], modifierName: "+" + attr, move: attributeRoll })
                    }}
                    fill="#333333"
                    padding={8}
                    cornerRadius={4}
                    horizontalAlignItems="start"
                    spacing={6}
                    width={188}
                >
                  <Frame width={27} height={27} fill="#FFFFFF" cornerRadius={4}>
                    <AutoLayout
                        horizontalAlignItems="center"
                        verticalAlignItems="center"
                        width={27}
                        height={27}
                        padding={6}
                    >
                      <Grid sides={6} size={4.5} fill="#333333" spacing={3} />
                    </AutoLayout>
                  </Frame>
                  <Text fontSize={24} fontWeight={700} fill="#FFFFFF">+{attr}</Text>
                </AutoLayout>
                <AutoLayout direction="vertical" spacing={4}>
                  {moves[attr].map((move, idx) => (
                    <AutoLayout
                        key={`${attr}-${idx}`}
                        fill="#E6E6E6"
                        padding={8}
                        cornerRadius={4}
                        onClick={() => {
                          setPendingRoll({ modifier: attributeValues[attr], modifierName: "+" + attr, move: move })
                        }}
                        onPointerEnter={() => setSelectedTooltipMove(move)}
                        spacing={6}
                        width={350}
                    >
                      <Frame width={18} height={18} fill="#333333" cornerRadius={3}>
                        <AutoLayout
                            horizontalAlignItems="center"
                            verticalAlignItems="center"
                            width={18}
                            height={18}
                            padding={4}
                        >
                          <Grid sides={6} size={3} fill="#FFFFFF" spacing={2} />
                        </AutoLayout>
                      </Frame>
                      <Text fontSize={18} fontWeight={600}>{move.name}</Text>
                    </AutoLayout>
                  ))}
                </AutoLayout>
              </AutoLayout>
            ))}
          </AutoLayout>
          <AutoLayout direction="vertical" spacing={8}>
            {movesData.MultiAttributeMoves?.map((section, sectionIdx) => (
              <AutoLayout key={sectionIdx} direction="vertical" spacing={8} padding={12} fill="#FFFFFF" cornerRadius={8}>
                <Text fontSize={24} fontWeight={700}>{section.Name}</Text>
                {section.Moves?.map((move, idx) => (
                  <AutoLayout
                      key={idx}
                      fill="#E6E6E6"
                      padding={8}
                      cornerRadius={4}
                      onClick={() => {
                        setPendingMultiAttributeMove({ move: move, attributes: section.Attributes })
                      }}
                      onPointerEnter={() => setSelectedTooltipMove(move)}
                      spacing={6}
                      width={350}
                  >
                    <Frame width={18} height={18} fill="#333333" cornerRadius={3}>
                      <AutoLayout
                          horizontalAlignItems="center"
                          verticalAlignItems="center"
                          width={18}
                          height={18}
                          padding={4}
                      >
                        <Grid sides={6} size={3} fill="#FFFFFF" spacing={2} />
                      </AutoLayout>
                    </Frame>
                    <Text fontSize={18} fontWeight={600}>{move.name}</Text>
                  </AutoLayout>
                ))}
              </AutoLayout>
            ))}
            <AutoLayout direction="vertical" spacing={8} padding={12} fill="#FFFFFF" cornerRadius={8}>
              <Text fontSize={24} fontWeight={700}>Clock Moves</Text>
              {movesData.ClockMoves.map((clockMove, idx) => (
                <AutoLayout key={idx} direction="vertical" spacing={4} width={350}>
                  <Text fontSize={16} fontWeight={600} fill="#666666">{clockMove.name}</Text>
                  {clockMove.advance.map((advanceMove, advIdx) => (
                    <AutoLayout
                        key={`advance-${advIdx}`}
                        fill="#E6E6E6"
                        padding={8}
                        cornerRadius={4}
                        onClick={() => {
                          handleClockMove(clockMove.clock, "advance", advanceMove.name)
                        }}
                        onPointerEnter={() => setSelectedTooltipMove(advanceMove)}
                        spacing={6}
                        width="fill-parent"
                    >
                      <Text fontSize={18} fontWeight={600}>→ {advanceMove.name}</Text>
                    </AutoLayout>
                  ))}
                  {clockMove.rollback.map((rollbackMove, rbIdx) => (
                    <AutoLayout
                        key={`rollback-${rbIdx}`}
                        fill="#E6E6E6"
                        padding={8}
                        cornerRadius={4}
                        onClick={() => {
                          handleClockMove(clockMove.clock, "rollback", rollbackMove.name)
                        }}
                        onPointerEnter={() => setSelectedTooltipMove(rollbackMove)}
                        spacing={6}
                        width="fill-parent"
                    >
                      <Text fontSize={18} fontWeight={600}>← {rollbackMove.name}</Text>
                    </AutoLayout>
                  ))}
                </AutoLayout>
              ))}
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
      <AutoLayout direction="vertical" spacing={16} padding={16} width={1350} height="fill-parent" fill="#F5F5F5" stroke="#333333" strokeWidth={2} cornerRadius={8}>
        <Clocks
          clockDefinitions={clockDefinitions}
          clocks={clocks}
        />
        {movesData.usesContacts && (
          <Contacts
            contactNames={contactNames}
            setContactNames={setContactNames}
            contactTypes={contactTypes}
            setContactTypes={setContactTypes}
            contactRatings={contactRatings}
            setContactRatings={setContactRatings}
            contactExpertise={contactExpertise}
            setContactExpertise={setContactExpertise}
            contactRelationships={contactRelationships}
            setContactRelationships={setContactRelationships}
            contactDescriptions={contactDescriptions}
            setContactDescriptions={setContactDescriptions}
            attributesLocked={attributesLocked}
            movesData={movesData}
            setPendingRoll={setPendingRoll}
            setSelectedTooltipMove={setSelectedTooltipMove}
          />
        )}
        <AutoLayout direction="vertical" spacing={8} width="fill-parent">
          <Text fontSize={36} fontWeight={700}>Equipment</Text>
          {/* Header Row */}
          <AutoLayout spacing={4} width="fill-parent">
            <Text fontSize={21} fontWeight={700} width={320}>Name</Text>
            <Text fontSize={21} fontWeight={700} width={150}>Type</Text>
            <Text fontSize={21} fontWeight={700} width={100}>Coin</Text>
            <Text fontSize={21} fontWeight={700} width={100}>Harm</Text>
            <Text fontSize={21} fontWeight={700} width={620}>Tags</Text>
          </AutoLayout>
          {/* Equipment Rows */}
          {equipmentTypes.map((equipType, idx) => (
            <AutoLayout key={idx} spacing={4} width="fill-parent" verticalAlignItems="center">
              {idx < 6 && <Text fontSize={24}>⭐</Text>}
              <Input
                  value={equipmentNames[idx]}
                  onTextEditEnd={(e) => {
                    const newNames = [...equipmentNames]
                    newNames[idx] = e.characters
                    setEquipmentNames(newNames)
                  }}
                  fontSize={21}
                  placeholder="Name"
                  width={idx < 6 ? 290 : 320}
              />
              <AutoLayout
                  fill={attributesLocked ? "#FFCCCC" : "#E6E6E6"}
                  padding={9}
                  cornerRadius={4}
                  width={150}
                  horizontalAlignItems="center"
                  onClick={() => {
                    if (!attributesLocked) {
                      const newTypes = [...equipmentTypes]
                      const currentIndex = equipmentTypeOptions.indexOf(equipType)
                      newTypes[idx] = equipmentTypeOptions[(currentIndex + 1) % equipmentTypeOptions.length]
                      setEquipmentTypes(newTypes)
                    }
                  }}
              >
                <Text fontSize={18}>{equipType || "---"}</Text>
              </AutoLayout>
              <AutoLayout spacing={4} verticalAlignItems="center">
                <AutoLayout direction="vertical" spacing={2}>
                  <AutoLayout
                      fill={attributesLocked ? "#FFCCCC" : "#CCFFCC"}
                      padding={3}
                      cornerRadius={2}
                      width={24}
                      horizontalAlignItems="center"
                      onClick={() => {
                        if (!attributesLocked) {
                          const newCoin = [...equipmentCoin]
                          newCoin[idx] = Math.min(3, newCoin[idx] + 1)
                          setEquipmentCoin(newCoin)
                        }
                      }}
                  >
                    <Text fontSize={15} fontWeight={600} opacity={attributesLocked ? 0.5 : 1}>+</Text>
                  </AutoLayout>
                  <AutoLayout
                      fill={attributesLocked ? "#FFCCCC" : "#CCFFCC"}
                      padding={3}
                      cornerRadius={2}
                      width={24}
                      horizontalAlignItems="center"
                      onClick={() => {
                        if (!attributesLocked) {
                          const newCoin = [...equipmentCoin]
                          newCoin[idx] = Math.max(-3, newCoin[idx] - 1)
                          setEquipmentCoin(newCoin)
                        }
                      }}
                  >
                    <Text fontSize={15} fontWeight={600} opacity={attributesLocked ? 0.5 : 1}>-</Text>
                  </AutoLayout>
                </AutoLayout>
                <Input
                    value={(equipmentCoin[idx] >= 0 ? '+' : '') + String(equipmentCoin[idx])}
                    onTextEditEnd={(e) => {
                      if (!attributesLocked) {
                        let val = parseInt(e.characters)
                        if (!isNaN(val)) {
                          const newCoin = [...equipmentCoin]
                          newCoin[idx] = Math.max(-3, Math.min(3, val))
                          setEquipmentCoin(newCoin)
                        }
                      }
                    }}
                    fontSize={21}
                    width={72}
                    horizontalAlignText="center"
                />
              </AutoLayout>
              <AutoLayout spacing={4} verticalAlignItems="center">
                <AutoLayout direction="vertical" spacing={2}>
                  <AutoLayout
                      fill={attributesLocked ? "#FFCCCC" : "#CCFFCC"}
                      padding={3}
                      cornerRadius={2}
                      width={24}
                      horizontalAlignItems="center"
                      onClick={() => {
                        if (!attributesLocked) {
                          const newHarm = [...equipmentHarm]
                          const currentVal = newHarm[idx] === null || newHarm[idx] === undefined ? 0 : Number(newHarm[idx])
                          newHarm[idx] = Math.min(4, currentVal + 1)
                          setEquipmentHarm(newHarm)
                        }
                      }}
                  >
                    <Text fontSize={15} fontWeight={600} opacity={attributesLocked ? 0.5 : 1}>+</Text>
                  </AutoLayout>
                  <AutoLayout
                      fill={attributesLocked ? "#FFCCCC" : "#CCFFCC"}
                      padding={3}
                      cornerRadius={2}
                      width={24}
                      horizontalAlignItems="center"
                      onClick={() => {
                        if (!attributesLocked) {
                          const newHarm = [...equipmentHarm]
                          const currentVal = newHarm[idx] === null || newHarm[idx] === undefined ? 0 : Number(newHarm[idx])
                          newHarm[idx] = Math.max(0, currentVal - 1)
                          setEquipmentHarm(newHarm)
                        }
                      }}
                  >
                    <Text fontSize={15} fontWeight={600} opacity={attributesLocked ? 0.5 : 1}>-</Text>
                  </AutoLayout>
                </AutoLayout>
                <Input
                    value={equipmentHarm[idx] === null || equipmentHarm[idx] === undefined ? "NA" : String(equipmentHarm[idx])}
                    onTextEditEnd={(e) => {
                      if (!attributesLocked) {
                        if (e.characters.toUpperCase() === "NA" || e.characters.trim() === "") {
                          const newHarm = [...equipmentHarm]
                          newHarm[idx] = null
                          setEquipmentHarm(newHarm)
                        } else {
                          let val = parseInt(e.characters)
                          if (!isNaN(val)) {
                            const newHarm = [...equipmentHarm]
                            newHarm[idx] = Math.max(0, Math.min(4, val))
                            setEquipmentHarm(newHarm)
                          }
                        }
                      }
                    }}
                    fontSize={21}
                    width={72}
                    horizontalAlignText="center"
                />
              </AutoLayout>
              <Input
                  value={equipmentTags[idx]}
                  onTextEditEnd={(e) => {
                    const newTags = [...equipmentTags]
                    newTags[idx] = e.characters
                    setEquipmentTags(newTags)
                  }}
                  fontSize={21}
                  placeholder="Tags"
                  width={620}
              />
            </AutoLayout>
          ))}
        </AutoLayout>
      </AutoLayout>
      <MoveHistory
        moveHistory={moveHistory}
        setMoveHistory={setMoveHistory}
        historyPage={historyPage}
        setHistoryPage={setHistoryPage}
        experienceChecked={experienceChecked}
        setExperienceChecked={setExperienceChecked}
        usesExperience={usesExperience}
      />
        </AutoLayout>

      {/* Character Moves Section */}
      <CharacterMoves
        characterData={characterData}
        characterName={characterName}
        characterMovesExpanded={characterMovesExpanded}
        setCharacterMovesExpanded={setCharacterMovesExpanded}
        getAttributeValue={getAttributeValue}
        setPendingRoll={setPendingRoll}
        handleClockMove={handleClockMove}
      />

      {/* Basic Moves Section */}
      <BasicMoves
        movesData={movesData}
        basicMovesExpanded={basicMovesExpanded}
        setBasicMovesExpanded={setBasicMovesExpanded}
        attributeValues={attributeValues}
        setPendingRoll={setPendingRoll}
        setPendingMultiAttributeMove={setPendingMultiAttributeMove}
        handleClockMove={handleClockMove}
        setSelectedTooltipMove={setSelectedTooltipMove}
      />

      {/* Charts Section */}
      <AutoLayout
          direction="vertical"
          width={2250}
          fill="#FFFFFF"
          stroke="#333333"
          strokeWidth={2}
          padding={16}
          spacing={12}
          cornerRadius={8}
      >
        <AutoLayout
            direction="horizontal"
            width="fill-parent"
            verticalAlignItems="center"
            spacing={12}
        >
          <AutoLayout
              fill="#333333"
              padding={8}
              cornerRadius={4}
              onClick={() => setChartsExpanded(!chartsExpanded)}
          >
            <Text fontSize={25} fontWeight={700} fill="#FFFFFF">
              {chartsExpanded ? "▼" : "▶"}
            </Text>
          </AutoLayout>
          <Text fontSize={30} fontWeight={700} width="fill-parent" horizontalAlignText="center">
            Charts
          </Text>
        </AutoLayout>

        {chartsExpanded && (
          <AutoLayout direction="vertical" spacing={24} width="fill-parent">
            {chartsData.map((chart, chartIdx) => (
              <AutoLayout key={chartIdx} direction="vertical" spacing={8} width="fill-parent">
                <Text fontSize={28} fontWeight={700}>{chart.title}</Text>
                <AutoLayout direction="vertical" width="fill-parent" stroke="#333333" strokeWidth={2}>
                  {/* Header Row */}
                  <AutoLayout direction="horizontal" width="fill-parent" fill="#E6E6E6">
                    {chart.columns.map((col, colIdx) => (
                      <AutoLayout
                          key={col.id}
                          width="fill-parent"
                          padding={8}
                          stroke="#333333"
                          strokeWidth={1}
                          verticalAlignItems="center"
                      >
                        <Text fontSize={18} fontWeight={700} width="fill-parent" horizontalAlignText="center">
                          {col.header}
                        </Text>
                      </AutoLayout>
                    ))}
                  </AutoLayout>
                  {/* Data Rows */}
                  {chart.columns[0].values.map((_, rowIdx) => (
                    <AutoLayout key={rowIdx} direction="horizontal" width="fill-parent" fill="#FFFFFF">
                      {chart.columns.map((col) => (
                        <AutoLayout
                            key={col.id}
                            width="fill-parent"
                            padding={8}
                            stroke="#333333"
                            strokeWidth={1}
                            verticalAlignItems="center"
                        >
                          <Text fontSize={16} width="fill-parent" horizontalAlignText="center">
                            {col.values[rowIdx]}
                          </Text>
                        </AutoLayout>
                      ))}
                    </AutoLayout>
                  ))}
                </AutoLayout>
              </AutoLayout>
            ))}
          </AutoLayout>
        )}
      </AutoLayout>

      {pendingRoll && (() => {
        const harmMod = getHarmModifier()
        const stressMod = getStressModifier()
        return (
          <AutoLayout
              positioning="absolute"
              x={400}
              y={400}
              fill="#FFFFFF"
              stroke="#333333"
              strokeWidth={3}
              cornerRadius={8}
              padding={24}
              direction="vertical"
              spacing={16}
              width={400}
              effect={[
                {
                  type: 'drop-shadow',
                  color: { r: 0, g: 0, b: 0, a: 0.5 },
                  offset: { x: 0, y: 4 },
                  blur: 20,
                  spread: 0,
                },
              ]}
          >
            <Text fontSize={24} fontWeight={700}>{pendingRoll.move.name}</Text>
            <AutoLayout direction="horizontal" spacing={12} verticalAlignItems="center">
              <Text fontSize={20} width={100}>Forward:</Text>
              <AutoLayout direction="vertical" spacing={4}>
                <AutoLayout
                    fill="#E6E6E6"
                    padding={4}
                    cornerRadius={4}
                    width={24}
                    horizontalAlignItems="center"
                    onClick={() => setPopupForward(Math.min(5, popupForward + 1))}
                >
                  <Text fontSize={12} fontWeight={600}>+</Text>
                </AutoLayout>
                <AutoLayout
                    fill="#E6E6E6"
                    padding={4}
                    cornerRadius={4}
                    width={24}
                    horizontalAlignItems="center"
                    onClick={() => setPopupForward(Math.max(-5, popupForward - 1))}
                >
                  <Text fontSize={12} fontWeight={600}>-</Text>
                </AutoLayout>
              </AutoLayout>
              <Input
                  value={(popupForward >= 0 ? '+' : '') + String(popupForward)}
                  onTextEditEnd={(e) => {
                    let val = parseInt(e.characters)
                    if (!isNaN(val)) {
                      setPopupForward(Math.max(-5, Math.min(5, val)))
                    }
                  }}
                  fontSize={24}
                  width={60}
                  horizontalAlignText="center"
              />
            </AutoLayout>
            <AutoLayout direction="horizontal" spacing={12} verticalAlignItems="center">
              <Text fontSize={20} width={100}>Ongoing:</Text>
              <AutoLayout direction="vertical" spacing={4}>
                <AutoLayout
                    fill="#E6E6E6"
                    padding={4}
                    cornerRadius={4}
                    width={24}
                    horizontalAlignItems="center"
                    onClick={() => setPopupOngoing(Math.min(5, popupOngoing + 1))}
                >
                  <Text fontSize={12} fontWeight={600}>+</Text>
                </AutoLayout>
                <AutoLayout
                    fill="#E6E6E6"
                    padding={4}
                    cornerRadius={4}
                    width={24}
                    horizontalAlignItems="center"
                    onClick={() => setPopupOngoing(Math.max(-5, popupOngoing - 1))}
                >
                  <Text fontSize={12} fontWeight={600}>-</Text>
                </AutoLayout>
              </AutoLayout>
              <Input
                  value={(popupOngoing >= 0 ? '+' : '') + String(popupOngoing)}
                  onTextEditEnd={(e) => {
                    let val = parseInt(e.characters)
                    if (!isNaN(val)) {
                      setPopupOngoing(Math.max(-5, Math.min(5, val)))
                    }
                  }}
                  fontSize={24}
                  width={60}
                  horizontalAlignText="center"
              />
            </AutoLayout>
            <AutoLayout direction="horizontal" spacing={12} verticalAlignItems="center">
              <AutoLayout
                  width={20}
                  height={20}
                  fill={popupApplyHarm ? "#333333" : "#FFFFFF"}
                  stroke="#333333"
                  strokeWidth={2}
                  cornerRadius={4}
                  horizontalAlignItems="center"
                  verticalAlignItems="center"
                  onClick={() => setPopupApplyHarm(!popupApplyHarm)}
              >
                {popupApplyHarm && <Text fontSize={14} fill="#FFFFFF">✓</Text>}
              </AutoLayout>
              <Text fontSize={20} width={80}>Harm:</Text>
              <Text fontSize={24} width={60} horizontalAlignText="center">{harmMod !== 0 ? (harmMod >= 0 ? '+' : '') + harmMod : '0'}</Text>
            </AutoLayout>
            <AutoLayout direction="horizontal" spacing={12} verticalAlignItems="center">
              <AutoLayout
                  width={20}
                  height={20}
                  fill={popupApplyStress ? "#333333" : "#FFFFFF"}
                  stroke="#333333"
                  strokeWidth={2}
                  cornerRadius={4}
                  horizontalAlignItems="center"
                  verticalAlignItems="center"
                  onClick={() => setPopupApplyStress(!popupApplyStress)}
              >
                {popupApplyStress && <Text fontSize={14} fill="#FFFFFF">✓</Text>}
              </AutoLayout>
              <Text fontSize={20} width={80}>Stress:</Text>
              <Text fontSize={24} width={60} horizontalAlignText="center">{stressMod !== 0 ? (stressMod >= 0 ? '+' : '') + stressMod : '0'}</Text>
            </AutoLayout>
            <AutoLayout
                fill="#4CAF50"
                padding={12}
                cornerRadius={4}
                onClick={() => {
                  const appliedHarm = popupApplyHarm ? harmMod : 0
                  const appliedStress = popupApplyStress ? stressMod : 0
                  roll(pendingRoll.modifier, pendingRoll.modifierName, pendingRoll.move, popupForward, popupOngoing, appliedHarm, appliedStress, pendingRoll.subtitle || null)
                  setPendingRoll(null)
                  setPopupForward(0)
                  setPopupOngoing(0)
                  setPopupApplyHarm(true)
                  setPopupApplyStress(true)
                }}
                width="fill-parent"
                horizontalAlignItems="center"
            >
              <Text fontSize={20} fontWeight={600} fill="#FFFFFF">Roll</Text>
            </AutoLayout>
            <AutoLayout
                fill="#FF5555"
                padding={12}
                cornerRadius={4}
                onClick={() => {
                  setPendingRoll(null)
                  setPopupForward(0)
                  setPopupOngoing(0)
                  setPopupApplyHarm(true)
                  setPopupApplyStress(true)
                }}
                width="fill-parent"
                horizontalAlignItems="center"
            >
              <Text fontSize={18} fontWeight={600} fill="#FFFFFF">Cancel</Text>
            </AutoLayout>
          </AutoLayout>
        )
      })()}

      {pendingMultiAttributeMove && (
        <AutoLayout
            positioning="absolute"
            x={300}
            y={300}
            fill="#FFFFFF"
            stroke="#333333"
            strokeWidth={3}
            cornerRadius={8}
            padding={24}
            direction="vertical"
            spacing={16}
            effect={[
              {
                type: 'drop-shadow',
                color: { r: 0, g: 0, b: 0, a: 0.5 },
                offset: { x: 0, y: 4 },
                blur: 20,
                spread: 0,
              },
            ]}
        >
          <AutoLayout direction="vertical" spacing={8} width="fill-parent">
            <Text fontSize={24} fontWeight={700}>Select Attribute for {pendingMultiAttributeMove.move.name}</Text>
            <AutoLayout direction="vertical" spacing={8} width="fill-parent">
              {pendingMultiAttributeMove.attributes.map(attr => {
                const value = getAttributeValue(attr)
                return (
                  <AutoLayout
                      key={attr}
                      fill="#333333"
                      padding={12}
                      cornerRadius={4}
                      onClick={() => {
                        setPendingRoll({ modifier: value, modifierName: "+" + attr, move: pendingMultiAttributeMove.move })
                        setPendingMultiAttributeMove(null)
                      }}
                      width="fill-parent"
                      horizontalAlignItems="center"
                  >
                    <Text fontSize={20} fontWeight={600} fill="#FFFFFF">+{attr} ({(value >= 0 ? '+' : '') + value})</Text>
                  </AutoLayout>
                )
              })}
            </AutoLayout>
            <AutoLayout
                fill="#FF5555"
                padding={12}
                cornerRadius={4}
                onClick={() => setPendingMultiAttributeMove(null)}
                width="fill-parent"
                horizontalAlignItems="center"
            >
              <Text fontSize={18} fontWeight={600} fill="#FFFFFF">Cancel</Text>
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
      )}

      {/* Level Up Popup */}
      {showLevelUpPopup && (
        <Dialog
          title="Level Up!"
          message="When you have filled all five experience boxes, you level up. Erase the marks and pick an improvement from your Playbook"
          buttons={[
            {
              label: "OK",
              onClick: () => setShowLevelUpPopup(false)
            }
          ]}
          backgroundColor="#CCFFCC"
        />
      )}

      {/* Mark Experience Popup */}
      {showMarkExperiencePopup && (
        <Dialog
          title="Mark Experience?"
          message="Whenever you roll and get a total of 6 or less, or when a move tells you to, mark an experience box."
          backgroundColor="#FFCCCC"
          buttons={[
            {
              label: "Yes",
              onClick: () => {
                // Mark the experience checkbox in move history
                const updatedHistory = [...moveHistory]
                updatedHistory[pendingExperienceRollIndex].experienceMarked = true
                setMoveHistory(updatedHistory)

                // Mark the first unchecked experience box
                const firstUncheckedIndex = experienceChecked.findIndex(checked => !checked)
                if (firstUncheckedIndex !== -1) {
                  const newExperienceChecked = [...experienceChecked]
                  newExperienceChecked[firstUncheckedIndex] = true
                  setExperienceChecked(newExperienceChecked)
                }

                // Close popup
                setShowMarkExperiencePopup(false)
                setPendingExperienceRollIndex(-1)
              }
            },
            {
              label: "No",
              backgroundColor: "#FF5555",
              onClick: () => {
                setShowMarkExperiencePopup(false)
                setPendingExperienceRollIndex(-1)
              }
            }
          ]}
        />
      )}
      </AutoLayout>
  )
}
widget.register(pbta_character)