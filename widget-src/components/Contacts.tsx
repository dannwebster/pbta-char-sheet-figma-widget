const { widget } = figma
const { AutoLayout, Text, Input } = widget

export function Contacts(props) {
  const {
    contactNames,
    setContactNames,
    contactTypes,
    setContactTypes,
    contactRatings,
    setContactRatings,
    contactExpertise,
    setContactExpertise,
    contactRelationships,
    setContactRelationships,
    contactDescriptions,
    setContactDescriptions,
    attributesLocked,
    movesData,
    setPendingRoll,
    setSelectedTooltipMove
  } = props

  return (
    <AutoLayout direction="vertical" spacing={8} width="fill-parent">
      <Text fontSize={36} fontWeight={700}>Contacts</Text>
      {/* Header Row */}
      <AutoLayout spacing={4} width="fill-parent">
        <Text fontSize={21} fontWeight={700} width={160}>Name</Text>
        <Text fontSize={21} fontWeight={700} width={120}>Type</Text>
        <Text fontSize={21} fontWeight={700} width={90}>Rating</Text>
        <Text fontSize={21} fontWeight={700} width={160}>Expertise</Text>
        <Text fontSize={21} fontWeight={700} width={320}>Relationship</Text>
        <Text fontSize={21} fontWeight={700} width={320}>Description</Text>
        <Text fontSize={21} fontWeight={700} width={150}>Action</Text>
      </AutoLayout>
      {/* Contact Rows */}
      {[0, 1, 2, 3, 4].map((idx) => (
        <AutoLayout key={idx} spacing={4} width="fill-parent" verticalAlignItems="center">
          {idx < 3 && <Text fontSize={24}>⭐</Text>}
          <Input
              value={contactNames[idx]}
              onTextEditEnd={(e) => {
                const newNames = [...contactNames]
                newNames[idx] = e.characters
                setContactNames(newNames)
              }}
              fontSize={21}
              placeholder="Name"
              width={idx < 3 ? 130 : 160}
          />
          <AutoLayout
              fill={attributesLocked ? "#FFCCCC" : "#E6E6E6"}
              padding={9}
              cornerRadius={4}
              width={120}
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
              width={160}
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
              width={320}
          />
          <Input
              value={contactDescriptions[idx]}
              onTextEditEnd={(e) => {
                const newDescriptions = [...contactDescriptions]
                newDescriptions[idx] = e.characters
                setContactDescriptions(newDescriptions)
              }}
              fontSize={21}
              placeholder="Description"
              width={320}
          />
          <AutoLayout
              fill="#333333"
              padding={9}
              cornerRadius={4}
              onClick={() => {
                const contactName = contactNames[idx] || "Unknown"
                const contactExp = contactExpertise[idx] || ""
                const subtitle = contactExp ? `${contactName}: ${contactExp}` : contactName
                const contactRoll = {
                  name: "Work Your Connections",
                  ...movesData.ContactMove
                }
                setPendingRoll({ modifier: contactRatings[idx], modifierName: "+Rating", move: contactRoll, subtitle: subtitle })
              }}
              onPointerEnter={() => setSelectedTooltipMove({
                name: "Contact: " + (contactNames[idx] || "Unknown"),
                ...movesData.ContactMove
              })}
              width={150}
              horizontalAlignItems="center"
          >
            <Text fontSize={18} fontWeight={600} fill="#FFFFFF">Contact</Text>
          </AutoLayout>
        </AutoLayout>
      ))}
    </AutoLayout>
  )
}
