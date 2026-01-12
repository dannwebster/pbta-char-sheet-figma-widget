const { widget } = figma
const { SVG } = widget

interface GameIconProps {
  svgContent: string
}

export function GameIcon(props: GameIconProps) {
  const { svgContent } = props

  if (!svgContent) {
    return null
  }
  return (
      <SVG
          src={svgContent}
          width={128}
          height={128}
      />
  )
}
