const { widget } = figma
const { Rectangle, AutoLayout, Frame, Text, useSyncedState, usePropertyMenu, useEffect, Ellipse, Input } = widget

import movesData from './moves.json'

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

function lildice() {
  const [initialized, setInitialized] = useSyncedState("initialized", false)
  const [sides1, setSides1] = useSyncedState("side1", null)
  const [sides2, setSides2] = useSyncedState("side2", null)
  const [modifier, setModifier] = useSyncedState("modifier", 0)
  const [modifierName, setModifierName] = useSyncedState("modifierName", "")
  const [forward, setForward] = useSyncedState("forward", 0)
  const [ongoing, setOngoing] = useSyncedState("ongoing", 0)
  const [characterName, setCharacterName] = useSyncedState("characterName", "Character Name")
  const [selectedMove, setSelectedMove] = useSyncedState("selectedMove", null)
  const [moveHistory, setMoveHistory] = useSyncedState("moveHistory", [])
  const [historyPage, setHistoryPage] = useSyncedState("historyPage", 0)
  const [attributesLocked, setAttributesLocked] = useSyncedState("attributesLocked", false)
  const [pendingMultiAttributeMove, setPendingMultiAttributeMove] = useSyncedState("pendingMultiAttributeMove", null)

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

  // Harm and Stress tracking
  const harmLevels = [
    { name: "Healthy", symbol: "", modifier: "" },
    { name: "Marked", symbol: "", modifier: "" },
    { name: "Injured", symbol: "", modifier: "" },
    { name: "Wounded", symbol: "", modifier: "" },
    { name: "Gasping", symbol: "", modifier: "" },
    { name: "Out of It", symbol: "", modifier: "" },
    { name: "Dying", symbol: "", modifier: "" }
  ]
  const stressLevels = [
    { name: "Grounded", symbol: "", modifier: "" },
    { name: "Shaken", symbol: "", modifier: "" },
    { name: "Disturbed", symbol: "", modifier: "" },
    { name: "Unraveled", symbol: "", modifier: "" },
    { name: "Haunted", symbol: "", modifier: "" },
    { name: "Broken", symbol: "", modifier: "" },
    { name: "Shattered", symbol: "", modifier: "" }
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
  const [equipmentCoin, setEquipmentCoin] = useSyncedState("equipmentCoin", Array(7).fill(""))
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

  let roll = (mod, name, moveData = null) => {
    let number1 = Math.floor(Math.random() * 6) + 1
    let number2 = Math.floor(Math.random() * 6) + 1
    let total = number1 + number2 + mod + forward + ongoing

    // Build roll text
    let rollTextStr = `${total} = [(${number1} + ${number2})`
    if (name) {
      rollTextStr += modifierName && mod !== 0 ? (mod >= 0 ? ' +' + mod : ' -' + Math.abs(mod)) + ' (' + name + ')' : mod === 0 ? ' +' + mod + ' (' + name + ')' : ''
    }
    rollTextStr += ']'
    if (forward !== 0) {
      rollTextStr += (forward >= 0 ? ' +' + forward : ' -' + Math.abs(forward)) + ' (Forward)'
    }
    if (ongoing !== 0) {
      rollTextStr += (ongoing >= 0 ? ' +' + ongoing : ' -' + Math.abs(ongoing)) + ' (Ongoing)'
    }

    // Save snapshot of modifiers used in this roll
    setSides1(number1)
    setSides2(number2)
    setRolledModifier(mod)
    setModifierName(name)
    setRolledForward(forward)
    setRolledOngoing(ongoing)
    setRollText(rollTextStr)

    // Add to move history if a move was passed directly
    if (moveData) {
      const historyEntry = {
        move: moveData,
        total: total,
        dice: [number1, number2],
        modifier: mod,
        forward: forward,
        ongoing: ongoing,
        rollText: rollTextStr,
        timestamp: Date.now()
      }
      setMoveHistory([historyEntry, ...moveHistory])
    }

    // Reset forward after roll
    setForward(0)

    console.log(number1, number2, mod, forward, ongoing)
    figma.notify('You rolled a ' + number1 + ' and a ' + number2 + ' (total: ' + total + ')')
  }

  // Clock registry - maps clock names to their state, setter, and size
  const clocks = {
    'mythosFade': { state: mythosFade, setter: setMythosFade, size: 3 },
    'logosCrack': { state: logosCrack, setter: setLogosCrack, size: 3 },
    'mythosAttention': { state: mythosAttention, setter: setMythosAttention, size: 5 },
    'logosAttention': { state: logosAttention, setter: setLogosAttention, size: 5 }
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

  const handleClockMove = (clockName, action) => {
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
      }
    } else if (action === 'rollback') {
      // Find last checked box
      for (let i = currentState.length - 1; i >= 0; i--) {
        if (currentState[i] === true) {
          const newClock = [...currentState]
          newClock[i] = false
          clock.setter(newClock)
          break
        }
      }
    }
  }

  useEffect(() => {
    figma.widget.waitForTask(new Promise(async resolve => {
      if (!initialized) {
        roll()
        setInitialized(true)
      }

      resolve(true)
    }))
  })

  return (
      <AutoLayout direction="horizontal" spacing={0}>
      <AutoLayout direction="vertical" spacing={0} horizontalAlignItems="center" stroke="#333333" strokeWidth={2} cornerRadius={8} width={1200}>
        <AutoLayout padding={16} width="fill-parent" fill="#FFFFFF" spacing={16}>
          <AutoLayout
              fill={attributesLocked ? "#FF5555" : "#55FF55"}
              padding={12}
              cornerRadius={8}
              onClick={() => setAttributesLocked(!attributesLocked)}
          >
            <Text fontSize={32} fontWeight={700}>{attributesLocked ? "🔒" : "🔓"}</Text>
          </AutoLayout>
          <Text fontSize={40} fontWeight={700}>Character: </Text>
          <Input
              value={characterName}
              onTextEditEnd={(e) => setCharacterName(e.characters)}
              fontSize={40}
              fontWeight={700}
              placeholder="Character Name"
              width="fill-parent"
          />
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
                  roll(mythosValue, "+Mythos", mythosRoll)
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
                  roll(logosValue, "+Logos", logosRoll)
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
                      roll(attributeValues[attr], "+" + attr, attributeRoll)
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
                          roll(attributeValues[attr], "+" + attr, move)
                        }}
                        spacing={6}
                        width={350}
                    >
                      <Text fontSize={18} fontWeight={600}>{move.name}</Text>
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
                    <Text fontSize={18} fontWeight={600}>{move.name}</Text>
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
                      handleClockMove(clockMove.clock, clockMove.action)
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
        <AutoLayout spacing={12} verticalAlignItems="center" fill="#E8E8E8" padding={24} width="fill-parent" stroke="#333333" strokeWidth={2}>
          <AutoLayout
              fill="#4CAF50"
              padding={16}
              cornerRadius={8}
              onClick={() => {
                const basicRoll = {
                  name: "Roll",
                  description: "",
                  "13+": "Critical Success",
                  "10+": "Great Success",
                  "7-9": "Partial Success",
                  "6-": "Failure"
                }
                roll(0, "", basicRoll)
              }}
          >
            <Text fontSize={20} fontWeight={700} fill="#FFFFFF">Roll</Text>
          </AutoLayout>
          <AutoLayout
              fill="#FFFFFF"
              padding={12}
              cornerRadius={8}
              spacing={12}
              verticalAlignItems="center"
          >
            <AutoLayout direction="vertical" spacing={4}>
              <AutoLayout
                  fill="#E6E6E6"
                  padding={4}
                  cornerRadius={4}
                  width={24}
                  horizontalAlignItems="center"
                  onClick={() => setForward(Math.min(5, forward + 1))}
              >
                <Text fontSize={12} fontWeight={600}>+</Text>
              </AutoLayout>
              <AutoLayout
                  fill="#E6E6E6"
                  padding={4}
                  cornerRadius={4}
                  width={24}
                  horizontalAlignItems="center"
                  onClick={() => setForward(Math.max(-5, forward - 1))}
              >
                <Text fontSize={12} fontWeight={600}>-</Text>
              </AutoLayout>
            </AutoLayout>
            <Input
                value={(forward >= 0 ? '+' : '') + String(forward)}
                onTextEditEnd={(e) => {
                  let val = parseInt(e.characters)
                  if (!isNaN(val)) {
                    setForward(Math.max(-5, Math.min(5, val)))
                  }
                }}
                fontSize={24}
                width={60}
                horizontalAlignText="center"
            />
            <Text fontSize={24} fontWeight={600}>Forward</Text>
          </AutoLayout>
          <AutoLayout
              fill="#FFFFFF"
              padding={12}
              cornerRadius={8}
              spacing={12}
              verticalAlignItems="center"
          >
            <AutoLayout direction="vertical" spacing={4}>
              <AutoLayout
                  fill="#E6E6E6"
                  padding={4}
                  cornerRadius={4}
                  width={24}
                  horizontalAlignItems="center"
                  onClick={() => setOngoing(Math.min(5, ongoing + 1))}
              >
                <Text fontSize={12} fontWeight={600}>+</Text>
              </AutoLayout>
              <AutoLayout
                  fill="#E6E6E6"
                  padding={4}
                  cornerRadius={4}
                  width={24}
                  horizontalAlignItems="center"
                  onClick={() => setOngoing(Math.max(-5, ongoing - 1))}
              >
                <Text fontSize={12} fontWeight={600}>-</Text>
              </AutoLayout>
            </AutoLayout>
            <Input
                value={(ongoing >= 0 ? '+' : '') + String(ongoing)}
                onTextEditEnd={(e) => {
                  let val = parseInt(e.characters)
                  if (!isNaN(val)) {
                    setOngoing(Math.max(-5, Math.min(5, val)))
                  }
                }}
                fontSize={24}
                width={60}
                horizontalAlignText="center"
            />
            <Text fontSize={24} fontWeight={600}>Ongoing</Text>
          </AutoLayout>
        </AutoLayout>
        <AutoLayout
            fill="#E8E8E8"
            padding={16}
            width="fill-parent"
            spacing={8}
            height={115}
        >
          {sides1 && sides2 ?
            <>
              <Text fontSize={32} fontWeight={700}>
                Roll:
              </Text>
              <Text fontSize={32} fontWeight={700} width="fill-parent">
                {rollText}
              </Text>
            </>
            : null}
        </AutoLayout>
      </AutoLayout>
      <AutoLayout direction="vertical" spacing={16} padding={16} width={600} fill="#F5F5F5" stroke="#333333" strokeWidth={2} cornerRadius={8}>
        <Text fontSize={24} fontWeight={700}>Clocks</Text>
        <AutoLayout direction="horizontal" spacing={16} width="fill-parent">
          <AutoLayout direction="vertical" spacing={8} width="fill-parent">
            <Text fontSize={20} fontWeight={700}>Harm</Text>
            {harmLevels.map((level, idx) => (
              <AutoLayout key={idx} spacing={8} verticalAlignItems="center" width="fill-parent">
                <AutoLayout
                    width={20}
                    height={20}
                    fill={harmChecked[idx] ? "#333333" : "#FFFFFF"}
                    stroke="#333333"
                    strokeWidth={2}
                    cornerRadius={4}
                    horizontalAlignItems="center"
                    verticalAlignItems="center"
                    onClick={() => {
                      const newChecked = [...harmChecked]
                      newChecked[idx] = !newChecked[idx]
                      setHarmChecked(newChecked)
                    }}
                >
                  {harmChecked[idx] && <Text fontSize={12} fill="#FFFFFF">✓</Text>}
                </AutoLayout>
                <Input
                    value={harmSymbols[idx]}
                    onTextEditEnd={(e) => {
                      const newSymbols = [...harmSymbols]
                      newSymbols[idx] = e.characters
                      setHarmSymbols(newSymbols)
                    }}
                    fontSize={14}
                    placeholder="Sym"
                    width={40}
                />
                <Text fontSize={14} width={80}>{level.name}</Text>
                <Input
                    value={harmModifiers[idx]}
                    onTextEditEnd={(e) => {
                      const newModifiers = [...harmModifiers]
                      newModifiers[idx] = e.characters
                      setHarmModifiers(newModifiers)
                    }}
                    fontSize={14}
                    placeholder="Mod"
                    width={40}
                />
              </AutoLayout>
            ))}
          </AutoLayout>
          <AutoLayout direction="vertical" spacing={8} width="fill-parent">
            <Text fontSize={20} fontWeight={700}>Stress</Text>
            {stressLevels.map((level, idx) => (
              <AutoLayout key={idx} spacing={8} verticalAlignItems="center" width="fill-parent">
                <AutoLayout
                    width={20}
                    height={20}
                    fill={stressChecked[idx] ? "#333333" : "#FFFFFF"}
                    stroke="#333333"
                    strokeWidth={2}
                    cornerRadius={4}
                    horizontalAlignItems="center"
                    verticalAlignItems="center"
                    onClick={() => {
                      const newChecked = [...stressChecked]
                      newChecked[idx] = !newChecked[idx]
                      setStressChecked(newChecked)
                    }}
                >
                  {stressChecked[idx] && <Text fontSize={12} fill="#FFFFFF">✓</Text>}
                </AutoLayout>
                <Input
                    value={stressSymbols[idx]}
                    onTextEditEnd={(e) => {
                      const newSymbols = [...stressSymbols]
                      newSymbols[idx] = e.characters
                      setStressSymbols(newSymbols)
                    }}
                    fontSize={14}
                    placeholder="Sym"
                    width={40}
                />
                <Text fontSize={14} width={80}>{level.name}</Text>
                <Input
                    value={stressModifiers[idx]}
                    onTextEditEnd={(e) => {
                      const newModifiers = [...stressModifiers]
                      newModifiers[idx] = e.characters
                      setStressModifiers(newModifiers)
                    }}
                    fontSize={14}
                    placeholder="Mod"
                    width={40}
                />
              </AutoLayout>
            ))}
          </AutoLayout>
        </AutoLayout>
        <AutoLayout direction="vertical" spacing={8} width="fill-parent">
          <Text fontSize={24} fontWeight={700}>Contacts</Text>
          {/* Header Row */}
          <AutoLayout spacing={4} width="fill-parent">
            <Text fontSize={14} fontWeight={700} width={120}>Name</Text>
            <Text fontSize={14} fontWeight={700} width={60}>Type</Text>
            <Text fontSize={14} fontWeight={700} width={60}>Rating</Text>
            <Text fontSize={14} fontWeight={700} width={100}>Expertise</Text>
            <Text fontSize={14} fontWeight={700} width={100}>Relationship</Text>
            <Text fontSize={14} fontWeight={700} width={80}>Action</Text>
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
                  fontSize={14}
                  placeholder="Name"
                  width={120}
              />
              <AutoLayout
                  fill={attributesLocked ? "#FFCCCC" : "#E6E6E6"}
                  padding={6}
                  cornerRadius={4}
                  width={60}
                  horizontalAlignItems="center"
                  onClick={() => {
                    if (!attributesLocked) {
                      const newTypes = [...contactTypes]
                      newTypes[idx] = newTypes[idx] === "Mythos" ? "Logos" : "Mythos"
                      setContactTypes(newTypes)
                    }
                  }}
              >
                <Text fontSize={12}>{contactTypes[idx]}</Text>
              </AutoLayout>
              <AutoLayout spacing={4} verticalAlignItems="center">
                <AutoLayout direction="vertical" spacing={2}>
                  <AutoLayout
                      fill={attributesLocked ? "#FFCCCC" : "#CCFFCC"}
                      padding={2}
                      cornerRadius={2}
                      width={16}
                      horizontalAlignItems="center"
                      onClick={() => {
                        if (!attributesLocked) {
                          const newRatings = [...contactRatings]
                          newRatings[idx] = Math.min(1, newRatings[idx] + 1)
                          setContactRatings(newRatings)
                        }
                      }}
                  >
                    <Text fontSize={10} fontWeight={600} opacity={attributesLocked ? 0.5 : 1}>+</Text>
                  </AutoLayout>
                  <AutoLayout
                      fill={attributesLocked ? "#FFCCCC" : "#CCFFCC"}
                      padding={2}
                      cornerRadius={2}
                      width={16}
                      horizontalAlignItems="center"
                      onClick={() => {
                        if (!attributesLocked) {
                          const newRatings = [...contactRatings]
                          newRatings[idx] = Math.max(-1, newRatings[idx] - 1)
                          setContactRatings(newRatings)
                        }
                      }}
                  >
                    <Text fontSize={10} fontWeight={600} opacity={attributesLocked ? 0.5 : 1}>-</Text>
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
                    fontSize={14}
                    width={35}
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
                  fontSize={14}
                  placeholder="Expertise"
                  width={100}
              />
              <Input
                  value={contactRelationships[idx]}
                  onTextEditEnd={(e) => {
                    const newRelationships = [...contactRelationships]
                    newRelationships[idx] = e.characters
                    setContactRelationships(newRelationships)
                  }}
                  fontSize={14}
                  placeholder="Relationship"
                  width={100}
              />
              <AutoLayout
                  fill="#333333"
                  padding={6}
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
                    roll(contactRatings[idx], "+Rating", contactRoll)
                  }}
                  width={80}
                  horizontalAlignItems="center"
              >
                <Text fontSize={12} fontWeight={600} fill="#FFFFFF">Contact</Text>
              </AutoLayout>
            </AutoLayout>
          ))}
        </AutoLayout>
        <AutoLayout direction="vertical" spacing={8} width="fill-parent">
          <Text fontSize={24} fontWeight={700}>Equipment</Text>
          {/* Header Row */}
          <AutoLayout spacing={4} width="fill-parent">
            <Text fontSize={14} fontWeight={700} width={140}>Name</Text>
            <Text fontSize={14} fontWeight={700} width={70}>Type</Text>
            <Text fontSize={14} fontWeight={700} width={50}>Coin</Text>
            <Text fontSize={14} fontWeight={700} width={50}>Harm</Text>
            <Text fontSize={14} fontWeight={700} width={150}>Tags</Text>
          </AutoLayout>
          {/* Equipment Rows */}
          {equipmentTypes.map((equipType, idx) => (
            <AutoLayout key={idx} spacing={4} width="fill-parent" verticalAlignItems="center">
              {idx < 6 && <Text fontSize={16}>⭐</Text>}
              <Input
                  value={equipmentNames[idx]}
                  onTextEditEnd={(e) => {
                    const newNames = [...equipmentNames]
                    newNames[idx] = e.characters
                    setEquipmentNames(newNames)
                  }}
                  fontSize={14}
                  placeholder="Name"
                  width={idx < 6 ? 120 : 140}
              />
              <AutoLayout
                  fill={attributesLocked ? "#FFCCCC" : "#E6E6E6"}
                  padding={6}
                  cornerRadius={4}
                  width={70}
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
                <Text fontSize={12}>{equipType || "---"}</Text>
              </AutoLayout>
              <Input
                  value={equipmentCoin[idx]}
                  onTextEditEnd={(e) => {
                    const newCoin = [...equipmentCoin]
                    newCoin[idx] = e.characters
                    setEquipmentCoin(newCoin)
                  }}
                  fontSize={14}
                  placeholder="Coin"
                  width={50}
              />
              <AutoLayout spacing={4} verticalAlignItems="center">
                <AutoLayout direction="vertical" spacing={2}>
                  <AutoLayout
                      fill={attributesLocked ? "#FFCCCC" : "#CCFFCC"}
                      padding={2}
                      cornerRadius={2}
                      width={16}
                      horizontalAlignItems="center"
                      onClick={() => {
                        if (!attributesLocked) {
                          const newHarm = [...equipmentHarm]
                          newHarm[idx] = Math.min(4, newHarm[idx] + 1)
                          setEquipmentHarm(newHarm)
                        }
                      }}
                  >
                    <Text fontSize={10} fontWeight={600} opacity={attributesLocked ? 0.5 : 1}>+</Text>
                  </AutoLayout>
                  <AutoLayout
                      fill={attributesLocked ? "#FFCCCC" : "#CCFFCC"}
                      padding={2}
                      cornerRadius={2}
                      width={16}
                      horizontalAlignItems="center"
                      onClick={() => {
                        if (!attributesLocked) {
                          const newHarm = [...equipmentHarm]
                          newHarm[idx] = Math.max(0, newHarm[idx] - 1)
                          setEquipmentHarm(newHarm)
                        }
                      }}
                  >
                    <Text fontSize={10} fontWeight={600} opacity={attributesLocked ? 0.5 : 1}>-</Text>
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
                    fontSize={14}
                    width={25}
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
                  fontSize={14}
                  placeholder="Tags"
                  width={150}
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
                let outcomeText = ""
                let holdOptions = entry.move.hold || []
                if (entry.move["13+"] && entry.total >= 13) {
                  outcomeText = `13+: ${entry.move["13+"]}`
                } else if (entry.total >= 10) {
                  outcomeText = `10+: ${entry.move["10+"]}`
                } else if (entry.total >= 7) {
                  outcomeText = `7-9: ${entry.move["7-9"]}`
                } else if (entry.move["6-"]) {
                  outcomeText = `6-: ${entry.move["6-"]}`
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
                    <Text fontSize={20} fontWeight={600} width="fill-parent">Roll: {entry.rollText}</Text>
                    <Text fontSize={17.5} width="fill-parent">{entry.move.description}</Text>
                    <Text fontSize={17.5} fontWeight={600} width="fill-parent">{outcomeText}</Text>
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
              {pendingMultiAttributeMove.attributes.map(attr => (
                <AutoLayout
                    key={attr}
                    fill="#333333"
                    padding={12}
                    cornerRadius={4}
                    onClick={() => {
                      roll(attributeValues[attr], "+" + attr, pendingMultiAttributeMove.move)
                      setPendingMultiAttributeMove(null)
                    }}
                    width="fill-parent"
                    horizontalAlignItems="center"
                >
                  <Text fontSize={20} fontWeight={600} fill="#FFFFFF">+{attr} ({(attributeValues[attr] >= 0 ? '+' : '') + attributeValues[attr]})</Text>
                </AutoLayout>
              ))}
              {pendingMultiAttributeMove.attributes.includes("Mythos") && (
                <AutoLayout
                    fill="#333333"
                    padding={12}
                    cornerRadius={4}
                    onClick={() => {
                      roll(mythosValue, "+Mythos", pendingMultiAttributeMove.move)
                      setPendingMultiAttributeMove(null)
                    }}
                    width="fill-parent"
                    horizontalAlignItems="center"
                >
                  <Text fontSize={20} fontWeight={600} fill="#FFFFFF">+Mythos ({(mythosValue >= 0 ? '+' : '') + mythosValue})</Text>
                </AutoLayout>
              )}
              {pendingMultiAttributeMove.attributes.includes("Logos") && (
                <AutoLayout
                    fill="#333333"
                    padding={12}
                    cornerRadius={4}
                    onClick={() => {
                      roll(logosValue, "+Logos", pendingMultiAttributeMove.move)
                      setPendingMultiAttributeMove(null)
                    }}
                    width="fill-parent"
                    horizontalAlignItems="center"
                >
                  <Text fontSize={20} fontWeight={600} fill="#FFFFFF">+Logos ({(logosValue >= 0 ? '+' : '') + logosValue})</Text>
                </AutoLayout>
              )}
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
widget.register(lildice)