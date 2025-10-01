const { widget } = figma
const { Rectangle, AutoLayout, Frame, Text, useSyncedState, usePropertyMenu, useEffect, Ellipse, Input } = widget

import movesData from './moves.json'
import { charts as chartsData } from './charts.js'
import { characterModules } from './character-loader'

// Merge all character data from character-loader
const characterData = {
  characters: Object.values(characterModules).flatMap(module => module.characters)
}

// Build attributes array dynamically from AttributeMoves keys
const moves = movesData.AttributeMoves
const attributes = Object.keys(moves)

function Dot(props) {
  let visible = props.visible
  let size = props.size || 24
  let fill = props.fill || "#333333"
  return (
      <Ellipse
          opacity={visible ? 1 : 0}
          width={size}
          height={size}
          fill={fill}
      ></Ellipse>
  )
}

function Grid(props) {
  let sides = props.sides
  let dotSize = props.size || 24
  let dotFill = props.fill || "#333333"
  let dotSpacing = props.spacing || 12
  let attrs = {
    direction: "vertical" as const,
    spacing: dotSpacing,
    width: "fill-parent" as const
  }
  switch(sides) {
    case 1:
      return <Dot visible={true} size={dotSize} fill={dotFill} />
    case 2:
    case 3:
      return <AutoLayout {...attrs}>
        <AutoLayout horizontalAlignItems="start" width="fill-parent"><Dot visible={true} size={dotSize} fill={dotFill} /></AutoLayout>
        <AutoLayout horizontalAlignItems="center" width="fill-parent"><Dot visible={sides == 2 ? false : true} size={dotSize} fill={dotFill} /></AutoLayout>
        <AutoLayout horizontalAlignItems="end" width="fill-parent"><Dot visible={true} size={dotSize} fill={dotFill} /></AutoLayout>
      </AutoLayout>
    case 4:
    case 5:
      return <AutoLayout {...attrs}>
        <AutoLayout spacing="auto" width="fill-parent"><Dot visible={true} size={dotSize} fill={dotFill} /><Dot visible={true} size={dotSize} fill={dotFill} /></AutoLayout>
        <AutoLayout horizontalAlignItems="center" width="fill-parent"><Dot visible={sides == 4 ? false : true} size={dotSize} fill={dotFill} /></AutoLayout>
        <AutoLayout spacing="auto" width="fill-parent"><Dot visible={true} size={dotSize} fill={dotFill} /><Dot visible={true} size={dotSize} fill={dotFill} /></AutoLayout>
      </AutoLayout>
    case 6:
      return <AutoLayout direction="horizontal" spacing={dotSpacing} height="fill-parent">
        <AutoLayout direction="vertical" spacing="auto" height="fill-parent"><Dot visible={true} size={dotSize} fill={dotFill} /><Dot visible={true} size={dotSize} fill={dotFill} /><Dot visible={true} size={dotSize} fill={dotFill} /></AutoLayout>
        <AutoLayout verticalAlignItems="center" height="fill-parent"><Dot visible={false} size={dotSize} fill={dotFill} /></AutoLayout>
        <AutoLayout direction="vertical" spacing="auto" height="fill-parent"><Dot visible={true} size={dotSize} fill={dotFill} /><Dot visible={true} size={dotSize} fill={dotFill} /><Dot visible={true} size={dotSize} fill={dotFill} /></AutoLayout>
      </AutoLayout>
    default:
      return <Dot visible={true} size={dotSize} fill={dotFill} />
  }
}

function pbta_character() {
  const [initialized, setInitialized] = useSyncedState("initialized", false)
  const [sides1, setSides1] = useSyncedState("side1", null)
  const [sides2, setSides2] = useSyncedState("side2", null)
  const [modifier, setModifier] = useSyncedState("modifier", 0)
  const [modifierName, setModifierName] = useSyncedState("modifierName", "")
  const [forward, setForward] = useSyncedState("forward", 0)
  const [ongoing, setOngoing] = useSyncedState("ongoing", 0)
  const [characterName, setCharacterName] = useSyncedState("characterName", characterData.characters[0].name)
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

  // Archetype selection
  const archetypes = {
    "Avatar": { mythos: 4, logos: 0 },
    "Legendary": { mythos: 3, logos: 1 },
    "Borderliner": { mythos: 2, logos: 2 },
    "Touched": { mythos: 1, logos: 3 },
    "Sleeper": { mythos: 0, logos: 4 }
  }
  const [selectedArchetype, setSelectedArchetype] = useSyncedState("selectedArchetype", "Borderliner")

  // Mythos and Logos fields
  const [mythosName, setMythosName] = useSyncedState("mythosName", "")
  const [mythosConcept, setMythosConcept] = useSyncedState("mythosConcept", "")
  const [mythosQuestion, setMythosQuestion] = useSyncedState("mythosQuestion", "")
  const [mythosAttention, setMythosAttention] = useSyncedState("mythosAttention", [false, false, false, false, false])
  const [mythosFade, setMythosFade] = useSyncedState("mythosFade", [false, false, false])
  const [mythosValue, setMythosValue] = useSyncedState("mythosValue", 0)
  const [logosName, setLogosName] = useSyncedState("logosName", "")
  const [logosConcept, setLogosConcept] = useSyncedState("logosConcept", "")
  const [logosStatement, setLogosStatement] = useSyncedState("logosStatement", "")
  const [logosAttention, setLogosAttention] = useSyncedState("logosAttention", [false, false, false, false, false])
  const [logosCrack, setLogosCrack] = useSyncedState("logosCrack", [false, false, false])
  const [logosValue, setLogosValue] = useSyncedState("logosValue", 0)

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

  // Helper function to get current Harm modifier
  const getHarmModifier = (): number => {
    let lastCheckedIndex = -1
    for (let i = harmChecked.length - 1; i >= 0; i--) {
      if (harmChecked[i]) {
        lastCheckedIndex = i
        break
      }
    }
    if (lastCheckedIndex === -1) return 0
    const modStr = harmLevels[lastCheckedIndex]?.modifier || ""
    return modStr ? parseInt(modStr) : 0
  }

  // Helper function to get current Stress modifier
  const getStressModifier = (): number => {
    let lastCheckedIndex = -1
    for (let i = stressChecked.length - 1; i >= 0; i--) {
      if (stressChecked[i]) {
        lastCheckedIndex = i
        break
      }
    }
    if (lastCheckedIndex === -1) return 0
    const modStr = stressLevels[lastCheckedIndex]?.modifier || ""
    return modStr ? parseInt(modStr) : 0
  }

  // Harm and Stress tracking
  const harmLevels = [
    { name: "Healthy",   symbol: "☆", modifier: "" },   // White Star
    { name: "Marked",    symbol: "○", modifier: "" },   // White Circle
    { name: "Injured",   symbol: "◔", modifier: "" },   // Circle 1/4 Black
    { name: "Wounded",   symbol: "◑", modifier: "-1" }, // Circle Right Half Black
    { name: "Gasping",   symbol: "◕", modifier: "-2" }, // Circle 3/4 Black
    { name: "Out of It", symbol: "●", modifier: "-3" }, // Black Circle
    { name: "Dying",     symbol: "☠", modifier: "" }    // Skull and Crossbones
  ]

  const stressLevels = [
    { name: "Grounded",  symbol: "☆", modifier: "" },   // White Star
    { name: "Shaken",    symbol: "○", modifier: "" },   // White Circle
    { name: "Disturbed", symbol: "◔", modifier: "" },   // Circle 1/4 Black
    { name: "Unraveled", symbol: "◑", modifier: "-1" }, // Circle Right Half Black
    { name: "Haunted",   symbol: "◕", modifier: "-2" }, // Circle 3/4 Black
    { name: "Broken",    symbol: "●", modifier: "-3" }, // Black Circle
    { name: "Shattered", symbol: "☠", modifier: "" }    // Skull and Crossbones
  ]
  

  const [harmChecked, setHarmChecked] = useSyncedState("harmChecked", Array(7).fill(false))
  const [stressChecked, setStressChecked] = useSyncedState("stressChecked", Array(7).fill(false))
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

  // Equipment tracking
  const equipmentTypeOptions = ["melee", "ranged", "vehicle", "domicile", "accessory", ""]
  const [equipmentNames, setEquipmentNames] = useSyncedState("equipmentNames", Array(7).fill(""))
  const [equipmentTypes, setEquipmentTypes] = useSyncedState("equipmentTypes", ["melee", "ranged", "vehicle", "domicile", "accessory", "accessory", ""])
  const [equipmentCoin, setEquipmentCoin] = useSyncedState("equipmentCoin", Array(7).fill(0))
  const [equipmentHarm, setEquipmentHarm] = useSyncedState("equipmentHarm", Array(7).fill(0))
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

  let roll = (mod, name, moveData = null, forwardMod = 0, ongoingMod = 0, harmMod = 0, stressMod = 0) => {
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
        move: moveData,
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
      setMoveHistory([historyEntry, ...moveHistory])
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
    'stress': { state: stressChecked, setter: setStressChecked, size: 7 }
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
      'stress': 'Stress'
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
        setInitialized(true)
      }

      resolve(true)
    }))
  })

  return (
      <AutoLayout direction="vertical" spacing={16}>
        <AutoLayout direction="horizontal" spacing={0}>
      <AutoLayout direction="vertical" spacing={0} horizontalAlignItems="center" stroke="#333333" strokeWidth={2} cornerRadius={8} width={1200}>
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
                setCharacterName(characterData.characters[nextIndex].name)
              }}
              width="fill-parent"
              direction="vertical"
              horizontalAlignItems="center"
              verticalAlignItems="center"
              spacing={4}
          >
            <Text fontSize={40} fontWeight={700}>{characterName}</Text>
            <Text fontSize={28} fill="#666666">{characterData.characters.find(c => c.name === characterName)?.subtitle || ""}</Text>
          </AutoLayout>
        </AutoLayout>
        <AutoLayout direction="vertical" spacing={8} padding={16} width="fill-parent" fill="#FFFFFF">
          <AutoLayout direction="horizontal" spacing={8} width="fill-parent">
            <Text fontSize={16} fontWeight={700} width={100}></Text>
            {Object.keys(archetypes).map(archetype => (
              <AutoLayout
                  key={archetype}
                  fill={selectedArchetype === archetype ? "#333333" : "#E6E6E6"}
                  padding={8}
                  cornerRadius={4}
                  width="fill-parent"
                  horizontalAlignItems="center"
                  onClick={() => {
                    setSelectedArchetype(archetype)
                    setMythosValue(archetypes[archetype].mythos)
                    setLogosValue(archetypes[archetype].logos)
                  }}
              >
                <Text fontSize={16} fontWeight={600} fill={selectedArchetype === archetype ? "#FFFFFF" : "#333333"}>{archetype}</Text>
              </AutoLayout>
            ))}
          </AutoLayout>
          <AutoLayout direction="horizontal" spacing={8} width="fill-parent">
            <Text fontSize={16} fontWeight={700} width={100}>Mythos</Text>
            {Object.keys(archetypes).map(archetype => (
              <AutoLayout
                  key={archetype}
                  padding={8}
                  width="fill-parent"
                  horizontalAlignItems="center"
              >
                <Text fontSize={16}>+{archetypes[archetype].mythos}</Text>
              </AutoLayout>
            ))}
          </AutoLayout>
          <AutoLayout direction="horizontal" spacing={8} width="fill-parent">
            <Text fontSize={16} fontWeight={700} width={100}>Logos</Text>
            {Object.keys(archetypes).map(archetype => (
              <AutoLayout
                  key={archetype}
                  padding={8}
                  width="fill-parent"
                  horizontalAlignItems="center"
              >
                <Text fontSize={16}>+{archetypes[archetype].logos}</Text>
              </AutoLayout>
            ))}
          </AutoLayout>
        </AutoLayout>
        <AutoLayout direction="horizontal" spacing={16} padding={16} width="fill-parent" fill="#FFFFFF">
          <AutoLayout direction="vertical" spacing={8} width="fill-parent">
            <AutoLayout
                onClick={() => {
                  const mythosRoll = {
                    name: "+Mythos",
                    description: "",
                    "13+": "Critical Success",
                    "10+": "Great Success",
                    "7-9": "Partial Success",
                    "6-": "Failure"
                  }
                  setPendingRoll({ modifier: mythosValue, modifierName: "+Mythos", move: mythosRoll })
                }}
                fill="#333333"
                padding={8}
                cornerRadius={4}
                horizontalAlignItems="start"
                spacing={6}
                width={150}
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
              <Text fontSize={24} fontWeight={700} fill="#FFFFFF">+Mythos</Text>
            </AutoLayout>
            <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
              <Text fontSize={16} width={100}>Name:</Text>
              <Input
                  value={mythosName}
                  onTextEditEnd={(e) => setMythosName(e.characters)}
                  fontSize={16}
                  placeholder="Mythos Name"
                  width="fill-parent"
              />
            </AutoLayout>
            <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
              <Text fontSize={16} width={100}>Concept:</Text>
              <Input
                  value={mythosConcept}
                  onTextEditEnd={(e) => setMythosConcept(e.characters)}
                  fontSize={16}
                  placeholder="Mythos Concept"
                  width="fill-parent"
              />
            </AutoLayout>
            <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
              <Text fontSize={16} width={100}>Question:</Text>
              <Input
                  value={mythosQuestion}
                  onTextEditEnd={(e) => setMythosQuestion(e.characters)}
                  fontSize={16}
                  placeholder="Mythos Question"
                  width="fill-parent"
              />
            </AutoLayout>
            <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
              <Text fontSize={16} width={100}>Attention:</Text>
              <AutoLayout spacing={8} direction="horizontal">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <AutoLayout
                      key={idx}
                      width={18}
                      height={18}
                      fill={mythosAttention[idx] ? "#333333" : "#FFFFFF"}
                      stroke="#333333"
                      strokeWidth={2}
                      cornerRadius={4}
                      horizontalAlignItems="center"
                      verticalAlignItems="center"
                      onClick={() => {
                        const newAttention = [...mythosAttention]
                        newAttention[idx] = !newAttention[idx]
                        setMythosAttention(newAttention)
                      }}
                  >
                    {mythosAttention[idx] && <Text fontSize={12} fill="#FFFFFF">✓</Text>}
                  </AutoLayout>
                ))}
              </AutoLayout>
            </AutoLayout>
            <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
              <Text fontSize={16} width={100}>Fade:</Text>
              <AutoLayout spacing={8} direction="horizontal">
                {[0, 1, 2].map((idx) => (
                  <AutoLayout
                      key={idx}
                      width={18}
                      height={18}
                      fill={mythosFade[idx] ? "#333333" : "#FFFFFF"}
                      stroke="#333333"
                      strokeWidth={2}
                      cornerRadius={4}
                      horizontalAlignItems="center"
                      verticalAlignItems="center"
                      onClick={() => {
                        const newFade = [...mythosFade]
                        newFade[idx] = !newFade[idx]
                        setMythosFade(newFade)
                      }}
                  >
                    {mythosFade[idx] && <Text fontSize={12} fill="#FFFFFF">✓</Text>}
                  </AutoLayout>
                ))}
              </AutoLayout>
            </AutoLayout>
          </AutoLayout>
          <AutoLayout direction="vertical" spacing={8} width="fill-parent">
            <AutoLayout
                onClick={() => {
                  const logosRoll = {
                    name: "+Logos",
                    description: "",
                    "13+": "Critical Success",
                    "10+": "Great Success",
                    "7-9": "Partial Success",
                    "6-": "Failure"
                  }
                  setPendingRoll({ modifier: logosValue, modifierName: "+Logos", move: logosRoll })
                }}
                fill="#333333"
                padding={8}
                cornerRadius={4}
                horizontalAlignItems="start"
                spacing={6}
                width={150}
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
              <Text fontSize={24} fontWeight={700} fill="#FFFFFF">+Logos</Text>
            </AutoLayout>
            <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
              <Text fontSize={16} width={100}>Name:</Text>
              <Input
                  value={logosName}
                  onTextEditEnd={(e) => setLogosName(e.characters)}
                  fontSize={16}
                  placeholder="Logos Name"
                  width="fill-parent"
              />
            </AutoLayout>
            <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
              <Text fontSize={16} width={100}>Concept:</Text>
              <Input
                  value={logosConcept}
                  onTextEditEnd={(e) => setLogosConcept(e.characters)}
                  fontSize={16}
                  placeholder="Logos Concept"
                  width="fill-parent"
              />
            </AutoLayout>
            <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
              <Text fontSize={16} width={100}>Statement:</Text>
              <Input
                  value={logosStatement}
                  onTextEditEnd={(e) => setLogosStatement(e.characters)}
                  fontSize={16}
                  placeholder="Logos Statement"
                  width="fill-parent"
              />
            </AutoLayout>
            <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
              <Text fontSize={16} width={100}>Attention:</Text>
              <AutoLayout spacing={8} direction="horizontal">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <AutoLayout
                      key={idx}
                      width={18}
                      height={18}
                      fill={logosAttention[idx] ? "#333333" : "#FFFFFF"}
                      stroke="#333333"
                      strokeWidth={2}
                      cornerRadius={4}
                      horizontalAlignItems="center"
                      verticalAlignItems="center"
                      onClick={() => {
                        const newAttention = [...logosAttention]
                        newAttention[idx] = !newAttention[idx]
                        setLogosAttention(newAttention)
                      }}
                  >
                    {logosAttention[idx] && <Text fontSize={12} fill="#FFFFFF">✓</Text>}
                  </AutoLayout>
                ))}
              </AutoLayout>
            </AutoLayout>
            <AutoLayout spacing={8} width="fill-parent" verticalAlignItems="center">
              <Text fontSize={16} width={100}>Crack:</Text>
              <AutoLayout spacing={8} direction="horizontal">
                {[0, 1, 2].map((idx) => (
                  <AutoLayout
                      key={idx}
                      width={18}
                      height={18}
                      fill={logosCrack[idx] ? "#333333" : "#FFFFFF"}
                      stroke="#333333"
                      strokeWidth={2}
                      cornerRadius={4}
                      horizontalAlignItems="center"
                      verticalAlignItems="center"
                      onClick={() => {
                        const newCrack = [...logosCrack]
                        newCrack[idx] = !newCrack[idx]
                        setLogosCrack(newCrack)
                      }}
                  >
                    {logosCrack[idx] && <Text fontSize={12} fill="#FFFFFF">✓</Text>}
                  </AutoLayout>
                ))}
              </AutoLayout>
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
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
                        description: "",
                        "13+": "Critical Success",
                        "10+": "Great Success",
                        "7-9": "Partial Success",
                        "6-": "Failure"
                      }
                      setPendingRoll({ modifier: attributeValues[attr], modifierName: "+" + attr, move: attributeRoll })
                    }}
                    fill="#333333"
                    padding={8}
                    cornerRadius={4}
                    horizontalAlignItems="start"
                    spacing={6}
                    width={150}
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
            {movesData.MultiAttributeMoves.map((section, sectionIdx) => (
              <AutoLayout key={sectionIdx} direction="vertical" spacing={8} padding={12} fill="#FFFFFF" cornerRadius={8}>
                <Text fontSize={24} fontWeight={700}>{section.Name}</Text>
                {section.Moves.map((move, idx) => (
                  <AutoLayout
                      key={idx}
                      fill="#E6E6E6"
                      padding={8}
                      cornerRadius={4}
                      onClick={() => {
                        setPendingMultiAttributeMove({ move: move, attributes: section.Attributes })
                      }}
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
                <AutoLayout
                    key={idx}
                    fill="#E6E6E6"
                    padding={8}
                    cornerRadius={4}
                    onClick={() => {
                      handleClockMove(clockMove.clock, clockMove.action, clockMove.name)
                    }}
                    spacing={6}
                    width={350}
                >
                  <Text fontSize={18} fontWeight={600}>{clockMove.name}</Text>
                </AutoLayout>
              ))}
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
      <AutoLayout direction="vertical" spacing={16} padding={16} width={900} height="fill-parent" fill="#F5F5F5" stroke="#333333" strokeWidth={2} cornerRadius={8}>
        <Text fontSize={36} fontWeight={700}>Clocks</Text>
        <AutoLayout direction="horizontal" spacing={16} width="fill-parent">
          <AutoLayout direction="vertical" spacing={8} width="fill-parent">
            <Text fontSize={30} fontWeight={700}>Harm</Text>
            {harmLevels.map((level, idx) => (
              <AutoLayout key={idx} spacing={8} verticalAlignItems="center" width="fill-parent">
                <AutoLayout
                    width={30}
                    height={30}
                    fill={harmChecked[idx] ? "#333333" : "#FFFFFF"}
                    stroke="#333333"
                    strokeWidth={2}
                    cornerRadius={15}
                    horizontalAlignItems="center"
                    verticalAlignItems="center"
                    onClick={() => {
                      const newChecked = [...harmChecked]
                      newChecked[idx] = !newChecked[idx]
                      setHarmChecked(newChecked)
                    }}
                >
                  <Text fontSize={18} fill={harmChecked[idx] ? "#FFFFFF" : "#333333"}>{level.symbol}</Text>
                </AutoLayout>
                <Text fontSize={21} width={120}>{level.name}</Text>
                <Text fontSize={21} width={30}>{level.modifier}</Text>
              </AutoLayout>
            ))}
          </AutoLayout>
          <AutoLayout direction="vertical" spacing={8} width="fill-parent">
            <Text fontSize={30} fontWeight={700}>Stress</Text>
            {stressLevels.map((level, idx) => (
              <AutoLayout key={idx} spacing={8} verticalAlignItems="center" width="fill-parent">
                <AutoLayout
                    width={30}
                    height={30}
                    fill={stressChecked[idx] ? "#333333" : "#FFFFFF"}
                    stroke="#333333"
                    strokeWidth={2}
                    cornerRadius={15}
                    horizontalAlignItems="center"
                    verticalAlignItems="center"
                    onClick={() => {
                      const newChecked = [...stressChecked]
                      newChecked[idx] = !newChecked[idx]
                      setStressChecked(newChecked)
                    }}
                >
                  <Text fontSize={18} fill={stressChecked[idx] ? "#FFFFFF" : "#333333"}>{level.symbol}</Text>
                </AutoLayout>
                <Text fontSize={21} width={120}>{level.name}</Text>
                <Text fontSize={21} width={30}>{level.modifier}</Text>
              </AutoLayout>
            ))}
          </AutoLayout>
        </AutoLayout>
        <AutoLayout direction="vertical" spacing={8} width="fill-parent">
          <Text fontSize={36} fontWeight={700}>Contacts</Text>
          {/* Header Row */}
          <AutoLayout spacing={4} width="fill-parent">
            <Text fontSize={21} fontWeight={700} width={180}>Name</Text>
            <Text fontSize={21} fontWeight={700} width={90}>Type</Text>
            <Text fontSize={21} fontWeight={700} width={90}>Rating</Text>
            <Text fontSize={21} fontWeight={700} width={150}>Expertise</Text>
            <Text fontSize={21} fontWeight={700} width={150}>Relationship</Text>
            <Text fontSize={21} fontWeight={700} width={120}>Action</Text>
          </AutoLayout>
          {/* Contact Rows */}
          {[0, 1, 2, 3, 4].map((idx) => (
            <AutoLayout key={idx} spacing={4} width="fill-parent" verticalAlignItems="center">
              <Input
                  value={contactNames[idx]}
                  onTextEditEnd={(e) => {
                    const newNames = [...contactNames]
                    newNames[idx] = e.characters
                    setContactNames(newNames)
                  }}
                  fontSize={21}
                  placeholder="Name"
                  width={180}
              />
              <AutoLayout
                  fill={attributesLocked ? "#FFCCCC" : "#E6E6E6"}
                  padding={9}
                  cornerRadius={4}
                  width={90}
                  horizontalAlignItems="center"
                  onClick={() => {
                    if (!attributesLocked) {
                      const newTypes = [...contactTypes]
                      newTypes[idx] = newTypes[idx] === "Mythos" ? "Logos" : "Mythos"
                      setContactTypes(newTypes)
                    }
                  }}
              >
                <Text fontSize={18}>{contactTypes[idx]}</Text>
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
                          const newRatings = [...contactRatings]
                          newRatings[idx] = Math.min(1, newRatings[idx] + 1)
                          setContactRatings(newRatings)
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
                          const newRatings = [...contactRatings]
                          newRatings[idx] = Math.max(-1, newRatings[idx] - 1)
                          setContactRatings(newRatings)
                        }
                      }}
                  >
                    <Text fontSize={15} fontWeight={600} opacity={attributesLocked ? 0.5 : 1}>-</Text>
                  </AutoLayout>
                </AutoLayout>
                <Input
                    value={(contactRatings[idx] >= 0 ? '+' : '') + String(contactRatings[idx])}
                    onTextEditEnd={(e) => {
                      if (!attributesLocked) {
                        let val = parseInt(e.characters)
                        if (!isNaN(val)) {
                          const newRatings = [...contactRatings]
                          newRatings[idx] = Math.max(-1, Math.min(1, val))
                          setContactRatings(newRatings)
                        }
                      }
                    }}
                    fontSize={21}
                    width={52}
                    horizontalAlignText="center"
                />
              </AutoLayout>
              <Input
                  value={contactExpertise[idx]}
                  onTextEditEnd={(e) => {
                    const newExpertise = [...contactExpertise]
                    newExpertise[idx] = e.characters
                    setContactExpertise(newExpertise)
                  }}
                  fontSize={21}
                  placeholder="Expertise"
                  width={150}
              />
              <Input
                  value={contactRelationships[idx]}
                  onTextEditEnd={(e) => {
                    const newRelationships = [...contactRelationships]
                    newRelationships[idx] = e.characters
                    setContactRelationships(newRelationships)
                  }}
                  fontSize={21}
                  placeholder="Relationship"
                  width={150}
              />
              <AutoLayout
                  fill="#333333"
                  padding={9}
                  cornerRadius={4}
                  onClick={() => {
                    const contactRoll = {
                      name: "Contact: " + (contactNames[idx] || "Unknown"),
                      description: "",
                      "13+": "Critical Success",
                      "10+": "Great Success",
                      "7-9": "Partial Success",
                      "6-": "Failure"
                    }
                    setPendingRoll({ modifier: contactRatings[idx], modifierName: "+Rating", move: contactRoll })
                  }}
                  width={120}
                  horizontalAlignItems="center"
              >
                <Text fontSize={18} fontWeight={600} fill="#FFFFFF">Contact</Text>
              </AutoLayout>
            </AutoLayout>
          ))}
        </AutoLayout>
        <AutoLayout direction="vertical" spacing={8} width="fill-parent">
          <Text fontSize={36} fontWeight={700}>Equipment</Text>
          {/* Header Row */}
          <AutoLayout spacing={4} width="fill-parent">
            <Text fontSize={21} fontWeight={700} width={210}>Name</Text>
            <Text fontSize={21} fontWeight={700} width={105}>Type</Text>
            <Text fontSize={21} fontWeight={700} width={75}>Coin</Text>
            <Text fontSize={21} fontWeight={700} width={75}>Harm</Text>
            <Text fontSize={21} fontWeight={700} width={225}>Tags</Text>
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
                  width={idx < 6 ? 180 : 210}
              />
              <AutoLayout
                  fill={attributesLocked ? "#FFCCCC" : "#E6E6E6"}
                  padding={9}
                  cornerRadius={4}
                  width={105}
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
                    width={52}
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
                          newHarm[idx] = Math.min(4, newHarm[idx] + 1)
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
                          newHarm[idx] = Math.max(0, newHarm[idx] - 1)
                          setEquipmentHarm(newHarm)
                        }
                      }}
                  >
                    <Text fontSize={15} fontWeight={600} opacity={attributesLocked ? 0.5 : 1}>-</Text>
                  </AutoLayout>
                </AutoLayout>
                <Input
                    value={String(equipmentHarm[idx])}
                    onTextEditEnd={(e) => {
                      if (!attributesLocked) {
                        let val = parseInt(e.characters)
                        if (!isNaN(val)) {
                          const newHarm = [...equipmentHarm]
                          newHarm[idx] = Math.max(0, Math.min(4, val))
                          setEquipmentHarm(newHarm)
                        }
                      }
                    }}
                    fontSize={21}
                    width={37}
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
                  width={225}
              />
            </AutoLayout>
          ))}
        </AutoLayout>
      </AutoLayout>
      <AutoLayout
          direction="vertical"
          width={600}
          fill="#F5F5F5"
          stroke="#333333"
          strokeWidth={2}
          cornerRadius={8}
          padding={16}
          spacing={16}
      >
        <AutoLayout width="fill-parent" spacing={12} verticalAlignItems="center">
          <Text fontSize={25} fontWeight={700}>Move History</Text>
          {moveHistory.length > 0 && (
            <AutoLayout
                fill="#FF5555"
                padding={8}
                cornerRadius={4}
                onClick={() => {
                  setMoveHistory([])
                  setHistoryPage(0)
                }}
            >
              <Text fontSize={17.5} fontWeight={600} fill="#FFFFFF">Clear All</Text>
            </AutoLayout>
          )}
        </AutoLayout>
        {moveHistory.length === 0 ? (
          <Text fontSize={20}>Roll a move to see outcomes</Text>
        ) : (
          <>
            <AutoLayout direction="vertical" spacing={12} width="fill-parent">
              {moveHistory.slice(historyPage * 5, (historyPage * 5) + 5).map((entry, idx) => {
                if (entry.type === "clock") {
                  // Clock move - simple display
                  return (
                    <AutoLayout
                        key={idx}
                        direction="vertical"
                        fill="#FFFFFF"
                        padding={12}
                        cornerRadius={4}
                        width="fill-parent"
                        spacing={8}
                    >
                      <Text fontSize={22.5} fontWeight={700} width="fill-parent">{entry.move.name}</Text>
                      <Text fontSize={17.5} width="fill-parent">{entry.move.description}</Text>
                    </AutoLayout>
                  )
                }

                // Regular move with dice roll
                let outcomeText = ""
                let holdOptions = entry.move.hold || []
                if (entry.move.outcomes?.["13+"] && entry.total >= 13) {
                  outcomeText = `13+: ${entry.move.outcomes["13+"]}`
                } else if (entry.total >= 10) {
                  outcomeText = `10+: ${entry.move.outcomes?.["10+"]}`
                } else if (entry.total >= 7) {
                  outcomeText = `7-9: ${entry.move.outcomes?.["7-9"]}`
                } else if (entry.move.outcomes?.["6-"]) {
                  outcomeText = `6-: ${entry.move.outcomes["6-"]}`
                }

                return (
                  <AutoLayout
                      key={idx}
                      direction="vertical"
                      fill="#FFFFFF"
                      padding={12}
                      cornerRadius={4}
                      width="fill-parent"
                      spacing={8}
                  >
                    <AutoLayout spacing={8} verticalAlignItems="center" width="fill-parent">
                      <Frame width={20} height={20} fill="#333333" cornerRadius={2}>
                        <AutoLayout horizontalAlignItems="center" verticalAlignItems="center" width={20} height={20} padding={2}>
                          <Grid sides={entry.dice[0]} size={3} fill="#FFFFFF" spacing={2} />
                        </AutoLayout>
                      </Frame>
                      <Frame width={20} height={20} fill="#333333" cornerRadius={2}>
                        <AutoLayout horizontalAlignItems="center" verticalAlignItems="center" width={20} height={20} padding={2}>
                          <Grid sides={entry.dice[1]} size={3} fill="#FFFFFF" spacing={2} />
                        </AutoLayout>
                      </Frame>
                      <Text fontSize={22.5} fontWeight={700} width="fill-parent">{entry.move.name}</Text>
                    </AutoLayout>
                    {entry.rollText && (
                      <AutoLayout spacing={4} verticalAlignItems="center" width="fill-parent" wrap={true}>
                        <Text fontSize={20} fontWeight={600}>Roll:</Text>
                        <AutoLayout fill="#FF0000" padding={4} cornerRadius={4}>
                          <Text fontSize={20} fontWeight={700} fill="#FFFFFF">{entry.total}</Text>
                        </AutoLayout>
                        <Text fontSize={20} fontWeight={600}>=</Text>
                        <AutoLayout fill="#00AA00" padding={4} cornerRadius={4}>
                          <Text fontSize={20} fontWeight={700} fill="#FFFFFF">({entry.dice[0]} + {entry.dice[1]})</Text>
                        </AutoLayout>
                        {entry.modifierName && (
                          <AutoLayout fill="#0066FF" padding={4} cornerRadius={4}>
                            <Text fontSize={20} fontWeight={700} fill="#FFFFFF">{entry.modifier >= 0 ? '+' : ''}{entry.modifier} ({entry.modifierName})</Text>
                          </AutoLayout>
                        )}
                        {entry.forward !== 0 && (
                          <Text fontSize={20} fontWeight={700} fill="#00AA00">{entry.forward >= 0 ? '+' : ''}{entry.forward} (Forward)</Text>
                        )}
                        {entry.ongoing !== 0 && (
                          <Text fontSize={20} fontWeight={700} fill="#0066FF">{entry.ongoing >= 0 ? '+' : ''}{entry.ongoing} (Ongoing)</Text>
                        )}
                        {entry.harm != null && entry.harm !== 0 && (
                          <Text fontSize={20} fontWeight={700} fill="#FF0000">{entry.harm >= 0 ? '+' : ''}{entry.harm} (Harm)</Text>
                        )}
                        {entry.stress != null && entry.stress !== 0 && (
                          <Text fontSize={20} fontWeight={700} fill="#9933FF">{entry.stress >= 0 ? '+' : ''}{entry.stress} (Stress)</Text>
                        )}
                      </AutoLayout>
                    )}
                    <Text fontSize={17.5} width="fill-parent">{entry.move.description}</Text>
                    {outcomeText && (
                      <Text fontSize={17.5} fontWeight={600} width="fill-parent">{outcomeText}</Text>
                    )}
                    {holdOptions.length > 0 && (
                      <AutoLayout direction="vertical" spacing={4} width="fill-parent">
                        {holdOptions.map((option, optIdx) => (
                          <Text key={optIdx} fontSize={17.5} width="fill-parent">• {option}</Text>
                        ))}
                      </AutoLayout>
                    )}
                  </AutoLayout>
                )
              })}
            </AutoLayout>
            {moveHistory.length > 5 && (
              <AutoLayout spacing={12} horizontalAlignItems="center" width="fill-parent">
                <AutoLayout
                    fill={historyPage > 0 ? "#333333" : "#CCCCCC"}
                    padding={8}
                    cornerRadius={4}
                    onClick={() => historyPage > 0 && setHistoryPage(historyPage - 1)}
                >
                  <Text fontSize={17.5} fontWeight={600} fill="#FFFFFF">← Previous</Text>
                </AutoLayout>
                <Text fontSize={17.5}>Page {historyPage + 1} of {Math.ceil(moveHistory.length / 5)}</Text>
                <AutoLayout
                    fill={historyPage < Math.ceil(moveHistory.length / 5) - 1 ? "#333333" : "#CCCCCC"}
                    padding={8}
                    cornerRadius={4}
                    onClick={() => historyPage < Math.ceil(moveHistory.length / 5) - 1 && setHistoryPage(historyPage + 1)}
                >
                  <Text fontSize={17.5} fontWeight={600} fill="#FFFFFF">Next →</Text>
                </AutoLayout>
              </AutoLayout>
            )}
          </>
        )}
      </AutoLayout>
        </AutoLayout>

      {/* Character Moves Section */}
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
              onClick={() => setCharacterMovesExpanded(!characterMovesExpanded)}
          >
            <Text fontSize={25} fontWeight={700} fill="#FFFFFF">
              {characterMovesExpanded ? "▼" : "▶"}
            </Text>
          </AutoLayout>
          <Text fontSize={30} fontWeight={700} width="fill-parent" horizontalAlignText="center">
            Character Moves
          </Text>
        </AutoLayout>

        {characterMovesExpanded && (() => {
          const currentCharacter = characterData.characters.find(c => c.name === characterName)
          if (!currentCharacter || !currentCharacter.moves) return null

          const renderMove = (move, attribute) => (
            <AutoLayout direction="vertical" spacing={6} width="fill-parent">
              <AutoLayout direction="horizontal" spacing={8} width="fill-parent" verticalAlignItems="center">
                <Text fontSize={22} fontWeight={700} width="fill-parent">
                  {move.name}
                </Text>
                <AutoLayout
                    fill="#333333"
                    padding={6}
                    cornerRadius={4}
                    onClick={() => {
                      setPendingRoll({ modifier: getAttributeValue(attribute), modifierName: "+" + attribute, move: move })
                    }}
                >
                  <Frame width={18} height={18} fill="#FFFFFF" cornerRadius={3}>
                    <AutoLayout
                        horizontalAlignItems="center"
                        verticalAlignItems="center"
                        width={18}
                        height={18}
                        padding={4}
                    >
                      <Grid sides={6} size={3} fill="#333333" spacing={2} />
                    </AutoLayout>
                  </Frame>
                </AutoLayout>
              </AutoLayout>
              <Text fontSize={19} width="fill-parent">
                {move.description}
              </Text>
              {move.outcomes && Object.entries(move.outcomes).map(([key, value]) => (
                <Text key={key} fontSize={19} width="fill-parent">
                  • On {key}: {value}
                </Text>
              ))}
              {move.hold && move.hold.length > 0 && (
                <AutoLayout direction="vertical" spacing={3} width="fill-parent">
                  {move.hold.map((option, optIdx) => (
                    <Text key={optIdx} fontSize={19} width="fill-parent">
                      • {option}
                    </Text>
                  ))}
                </AutoLayout>
              )}
              {move.flaw && (
                <AutoLayout direction="horizontal" spacing={8} width="fill-parent" verticalAlignItems="center">
                  <AutoLayout
                      fill="#333333"
                      padding={6}
                      cornerRadius={4}
                      onClick={() => {
                        const clockName = attribute === "Mythos" ? "mythosAttention" : "logosAttention"
                        handleClockMove(clockName, "advance", `Invoke ${attribute} Flaw`)
                      }}
                  >
                    <Text fontSize={18} fontWeight={700} fill="#FFFFFF">⏱</Text>
                  </AutoLayout>
                  <Text fontSize={19} width="fill-parent">
                    FLAW: {move.flaw.name} - {move.flaw.description}
                  </Text>
                </AutoLayout>
              )}
            </AutoLayout>
          )

          return (
            <AutoLayout direction="horizontal" spacing={12} width="fill-parent">
              {/* Mythos Moves */}
              <AutoLayout
                  direction="vertical"
                  width="fill-parent"
                  fill="#F5F5F5"
                  stroke="#333333"
                  strokeWidth={2}
                  padding={16}
                  cornerRadius={8}
                  spacing={12}
              >
                <Text fontSize={27} fontWeight={700} width="fill-parent" horizontalAlignText="center">
                  Mythos Moves
                </Text>
                <Text fontSize={22} fontWeight={700} width="fill-parent">
                  Anchor Move
                </Text>
                {currentCharacter.moves.mythosMoves.anchorMove && renderMove(currentCharacter.moves.mythosMoves.anchorMove, "Mythos")}
                <Text fontSize={22} fontWeight={700} width="fill-parent">
                  Additional Moves
                </Text>
                {currentCharacter.moves.mythosMoves.additionalMoves && currentCharacter.moves.mythosMoves.additionalMoves.map((move, idx) => (
                  <AutoLayout key={idx} width="fill-parent">
                    {renderMove(move, "Mythos")}
                  </AutoLayout>
                ))}
              </AutoLayout>

              {/* Logos Moves */}
              <AutoLayout
                  direction="vertical"
                  width="fill-parent"
                  fill="#F5F5F5"
                  stroke="#333333"
                  strokeWidth={2}
                  padding={16}
                  cornerRadius={8}
                  spacing={12}
              >
                <Text fontSize={27} fontWeight={700} width="fill-parent" horizontalAlignText="center">
                  Logos Moves
                </Text>
                <Text fontSize={22} fontWeight={700} width="fill-parent">
                  Anchor Move
                </Text>
                {currentCharacter.moves.logosMoves.anchorMove && renderMove(currentCharacter.moves.logosMoves.anchorMove, "Logos")}
                <Text fontSize={22} fontWeight={700} width="fill-parent">
                  Additional Moves
                </Text>
                {currentCharacter.moves.logosMoves.additionalMoves && currentCharacter.moves.logosMoves.additionalMoves.map((move, idx) => (
                  <AutoLayout key={idx} width="fill-parent">
                    {renderMove(move, "Logos")}
                  </AutoLayout>
                ))}
              </AutoLayout>
            </AutoLayout>
          )
        })()}
      </AutoLayout>

      {/* Basic Moves Section */}
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
              onClick={() => setBasicMovesExpanded(!basicMovesExpanded)}
          >
            <Text fontSize={25} fontWeight={700} fill="#FFFFFF">
              {basicMovesExpanded ? "▼" : "▶"}
            </Text>
          </AutoLayout>
          <Text fontSize={30} fontWeight={700} width="fill-parent" horizontalAlignText="center">
            Basic Moves
          </Text>
        </AutoLayout>

        {basicMovesExpanded && (
          <AutoLayout direction="vertical" spacing={12} width="fill-parent">
            {/* Attribute Moves - dynamically create rows of 3 */}
            {[0, 1].map(rowIdx => (
              <AutoLayout key={rowIdx} direction="horizontal" spacing={12} width="fill-parent">
                {Object.keys(movesData.AttributeMoves).slice(rowIdx * 3, (rowIdx + 1) * 3).map(attribute => (
                  <AutoLayout
                      key={attribute}
                      direction="vertical"
                      width="fill-parent"
                      fill="#F5F5F5"
                      stroke="#333333"
                      strokeWidth={2}
                      padding={16}
                      cornerRadius={8}
                      spacing={12}
                  >
                    <Text fontSize={27} fontWeight={700} width="fill-parent" horizontalAlignText="center">
                      {attribute} Moves
                    </Text>
                    {movesData.AttributeMoves[attribute].map((move, idx) => (
                      <AutoLayout key={idx} direction="vertical" spacing={6} width="fill-parent">
                        <AutoLayout direction="horizontal" spacing={8} width="fill-parent" verticalAlignItems="center">
                          <Text fontSize={22} fontWeight={700} width="fill-parent">
                            {move.name}
                          </Text>
                          <AutoLayout
                              fill="#333333"
                              padding={6}
                              cornerRadius={4}
                              onClick={() => {
                                setPendingRoll({ modifier: attributeValues[attribute], modifierName: "+" + attribute, move: move })
                              }}
                          >
                            <Frame width={18} height={18} fill="#FFFFFF" cornerRadius={3}>
                              <AutoLayout
                                  horizontalAlignItems="center"
                                  verticalAlignItems="center"
                                  width={18}
                                  height={18}
                                  padding={4}
                              >
                                <Grid sides={6} size={3} fill="#333333" spacing={2} />
                              </AutoLayout>
                            </Frame>
                          </AutoLayout>
                        </AutoLayout>
                        <Text fontSize={19} width="fill-parent">
                          {move.description}
                        </Text>
                        {move.outcomes && Object.entries(move.outcomes).map(([key, value]) => (
                          <Text key={key} fontSize={19} width="fill-parent">
                            • On {key}: {value}
                          </Text>
                        ))}
                        {move.hold && move.hold.length > 0 && (
                          <AutoLayout direction="vertical" spacing={3} width="fill-parent">
                            {move.hold.map((option, optIdx) => (
                              <Text key={optIdx} fontSize={19} width="fill-parent">
                                • {option}
                              </Text>
                            ))}
                          </AutoLayout>
                        )}
                      </AutoLayout>
                    ))}
                  </AutoLayout>
                ))}
              </AutoLayout>
            ))}

            {/* Third row: Global Moves, Mythos/Logos Moves, Clock Moves */}
            <AutoLayout direction="horizontal" spacing={12} width="fill-parent">
              {/* Global Moves */}
              <AutoLayout
                  direction="vertical"
                  width="fill-parent"
                  fill="#F5F5F5"
                  stroke="#333333"
                  strokeWidth={2}
                  padding={16}
                  cornerRadius={8}
                  spacing={12}
              >
                <Text fontSize={27} fontWeight={700} width="fill-parent" horizontalAlignText="center">
                  Global Moves
                </Text>
                {movesData.MultiAttributeMoves.find(section => section.Name === "Global Moves")?.Moves.map((move, idx) => {
                  const section = movesData.MultiAttributeMoves.find(s => s.Name === "Global Moves")
                  return (
                    <AutoLayout key={idx} direction="vertical" spacing={6} width="fill-parent">
                      <AutoLayout direction="horizontal" spacing={8} width="fill-parent" verticalAlignItems="center">
                        <Text fontSize={22} fontWeight={700} width="fill-parent">
                          {move.name}
                        </Text>
                        <AutoLayout
                            fill="#333333"
                            padding={6}
                            cornerRadius={4}
                            onClick={() => {
                              setPendingMultiAttributeMove({ move: move, attributes: section.Attributes })
                            }}
                        >
                          <Frame width={18} height={18} fill="#FFFFFF" cornerRadius={3}>
                            <AutoLayout
                                horizontalAlignItems="center"
                                verticalAlignItems="center"
                                width={18}
                                height={18}
                                padding={4}
                            >
                              <Grid sides={6} size={3} fill="#333333" spacing={2} />
                            </AutoLayout>
                          </Frame>
                        </AutoLayout>
                      </AutoLayout>
                      <Text fontSize={19} width="fill-parent">
                        {move.description}
                      </Text>
                      {move.outcomes && Object.entries(move.outcomes).map(([key, value]) => (
                        <Text key={key} fontSize={19} width="fill-parent">
                          • On {key}: {value}
                        </Text>
                      ))}
                      {move.hold && move.hold.length > 0 && (
                        <AutoLayout direction="vertical" spacing={3} width="fill-parent">
                          {move.hold.map((option, optIdx) => (
                            <Text key={optIdx} fontSize={19} width="fill-parent">
                              • {option}
                            </Text>
                          ))}
                        </AutoLayout>
                      )}
                    </AutoLayout>
                  )
                })}
              </AutoLayout>

              {/* Mythos/Logos Moves */}
              <AutoLayout
                  direction="vertical"
                  width="fill-parent"
                  fill="#F5F5F5"
                  stroke="#333333"
                  strokeWidth={2}
                  padding={16}
                  cornerRadius={8}
                  spacing={12}
              >
                <Text fontSize={27} fontWeight={700} width="fill-parent" horizontalAlignText="center">
                  Mythos/Logos Moves
                </Text>
                {movesData.MultiAttributeMoves.find(section => section.Name === "Mythos/Logos Moves")?.Moves.map((move, idx) => {
                  const section = movesData.MultiAttributeMoves.find(s => s.Name === "Mythos/Logos Moves")
                  return (
                    <AutoLayout key={idx} direction="vertical" spacing={6} width="fill-parent">
                      <AutoLayout direction="horizontal" spacing={8} width="fill-parent" verticalAlignItems="center">
                        <Text fontSize={22} fontWeight={700} width="fill-parent">
                          {move.name}
                        </Text>
                        <AutoLayout
                            fill="#333333"
                            padding={6}
                            cornerRadius={4}
                            onClick={() => {
                              setPendingMultiAttributeMove({ move: move, attributes: section.Attributes })
                            }}
                        >
                          <Frame width={18} height={18} fill="#FFFFFF" cornerRadius={3}>
                            <AutoLayout
                                horizontalAlignItems="center"
                                verticalAlignItems="center"
                                width={18}
                                height={18}
                                padding={4}
                            >
                              <Grid sides={6} size={3} fill="#333333" spacing={2} />
                            </AutoLayout>
                          </Frame>
                        </AutoLayout>
                      </AutoLayout>
                      <Text fontSize={19} width="fill-parent">
                        {move.description}
                      </Text>
                      {move.outcomes && Object.entries(move.outcomes).map(([key, value]) => (
                        <Text key={key} fontSize={19} width="fill-parent">
                          • On {key}: {value}
                        </Text>
                      ))}
                      {move.hold && move.hold.length > 0 && (
                        <AutoLayout direction="vertical" spacing={3} width="fill-parent">
                          {move.hold.map((option, optIdx) => (
                            <Text key={optIdx} fontSize={19} width="fill-parent">
                              • {option}
                            </Text>
                          ))}
                        </AutoLayout>
                      )}
                    </AutoLayout>
                  )
                })}
              </AutoLayout>

              {/* Clock Moves */}
              <AutoLayout
                  direction="vertical"
                  width="fill-parent"
                  fill="#F5F5F5"
                  stroke="#333333"
                  strokeWidth={2}
                  padding={16}
                  cornerRadius={8}
                  spacing={12}
              >
                <Text fontSize={27} fontWeight={700} width="fill-parent" horizontalAlignText="center">
                  Clock Moves
                </Text>
                {movesData.ClockMoves.map((move, idx) => (
                  <AutoLayout key={idx} direction="horizontal" spacing={8} width="fill-parent" verticalAlignItems="center">
                    <AutoLayout
                        fill="#333333"
                        padding={6}
                        cornerRadius={4}
                        onClick={() => {
                          handleClockMove(move.clock, move.action, move.name)
                        }}
                    >
                      <Text fontSize={18} fontWeight={700} fill="#FFFFFF">⏱</Text>
                    </AutoLayout>
                    <Text fontSize={22} fontWeight={700} width="fill-parent">
                      {move.name}
                    </Text>
                  </AutoLayout>
                ))}
              </AutoLayout>
            </AutoLayout>
          </AutoLayout>
        )}
      </AutoLayout>

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
              <Text fontSize={20} width={80}>Forward:</Text>
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
              <Text fontSize={20} width={80}>Ongoing:</Text>
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
                  roll(pendingRoll.modifier, pendingRoll.modifierName, pendingRoll.move, popupForward, popupOngoing, appliedHarm, appliedStress)
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
      </AutoLayout>
  )
}
widget.register(pbta_character)