'use strict'

const fs = require('fs')
const path = require('path')

const GAMES_DIR = path.join(__dirname, '../widget-src/games')
const THEMES_DIR = path.join(__dirname, 'themes')
const OUT_DIR = path.join(__dirname, '../dist/character-sheets')

// ── Utilities ────────────────────────────────────────────────────────────────

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function fmt(value) {
  if (value === undefined || value === null) return '0'
  return value > 0 ? `+${value}` : `${value}`
}

function esc(str) {
  if (str === null || str === undefined) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function loadTheme(gameId) {
  const base = fs.readFileSync(path.join(THEMES_DIR, 'base.css'), 'utf8')
  const themePath = path.join(THEMES_DIR, `${gameId}.css`)
  const theme = fs.existsSync(themePath) ? fs.readFileSync(themePath, 'utf8') : ''
  return base + (theme ? '\n/* Game Theme */\n' + theme : '')
}

// ── Renderers ────────────────────────────────────────────────────────────────

function renderAttributes(attributes, attributeMoves) {
  if (!attributes || attributes.length === 0) return ''
  return attributes.map(attr => {
    const moves = (attributeMoves || {})[attr.name] || []
    const moveNames = moves.map(m => `• ${esc(m.name)}`).join(' &nbsp;')
    return `
      <div class="attr-row">
        <div class="attr-circle">${esc(fmt(attr.value))}</div>
        <div class="attr-info">
          <div class="attr-name">${esc(attr.name)}</div>
          ${moveNames ? `<div class="attr-moves">${moveNames}</div>` : ''}
        </div>
      </div>`
  }).join('\n')
}

function renderOutcomes(outcomes) {
  if (!outcomes) return ''
  const rows = ['13+', '10+', '7-9', '6-']
    .filter(k => outcomes[k])
    .map(k => `
        <div class="outcome">
          <span class="outcome-key">${esc(k)}</span>
          <span>${esc(outcomes[k])}</span>
        </div>`)
    .join('')
  return rows ? `<div class="outcomes">${rows}\n      </div>` : ''
}

function renderArrays(arrays) {
  if (!arrays || arrays.length === 0) return ''
  return arrays.map(arr => `
      <div class="array-block">
        <div class="array-title">${esc(arr.title)}</div>
        <ul class="array-list">
          ${arr.values.map(v => `<li>${esc(v)}</li>`).join('\n          ')}
        </ul>
      </div>`).join('')
}

function renderFlaw(flaw) {
  if (!flaw) return ''
  return `
      <div class="move-flaw"><strong>${esc(flaw.name)}:</strong> ${esc(flaw.description)}</div>`
}

function renderMove(move, addRule) {
  const attrStr = move.attribute
    ? ` <span class="move-attr"> — roll +${esc(move.attribute)}</span>`
    : ''
  const pickedClass = move.picked ? ' move-picked' : ''
  const rule = addRule ? '\n      <hr class="rule">' : ''
  return `
      <div class="move${pickedClass}">
        <div class="move-header">
          <span class="move-name">${esc(move.name)}</span>${attrStr}
        </div>
        <div class="move-desc">${esc(move.description)}</div>
        ${renderFlaw(move.flaw)}
        ${renderOutcomes(move.outcomes)}
        ${renderArrays(move.arrays)}
      </div>${rule}`
}

function renderMoveGroups(characterMoveGroups) {
  if (!characterMoveGroups || characterMoveGroups.length === 0) return ''
  return characterMoveGroups.map(group => {
    const additional = group.additionalMoves || []
    const anchor = group.anchorMove
      ? renderMove(group.anchorMove, additional.length > 0)
      : ''
    const moves = additional.map((m, i) =>
      renderMove(m, i < additional.length - 1)
    ).join('')
    return `
    <div class="section">
      <div class="section-head">${esc(group.type || 'Moves')}</div>
      ${anchor}${moves}
    </div>`
  }).join('\n')
}

function renderConcepts(concepts) {
  if (!concepts || concepts.length === 0) return ''
  const items = concepts.map(c => `
      <div class="concept-block">
        <div class="concept-type">${esc(c.type)}</div>
        <div class="concept-name">${esc(c.name)}</div>
        <div class="concept-desc">${esc(c.concept)}</div>
        <div class="concept-tenet"><em>Tenet:</em> ${esc(c.tenet)}</div>
      </div>`).join('')
  return `
    <div class="section">
      <div class="section-head">Concept</div>
      ${items}
    </div>`
}

function renderContacts(contacts) {
  const active = (contacts || []).filter(c => c.name && c.name.trim())
  if (active.length === 0) return ''
  const rows = active.map(c => `
            <tr>
              <td class="item-name">${esc(c.name)}</td>
              <td>${esc(c.type || '')}</td>
              <td>${c.rating !== undefined ? esc(fmt(c.rating)) : ''}</td>
              <td>${esc(c.expertise || '')}</td>
              <td>${esc(c.relationship || '')}</td>
            </tr>`).join('')
  return `
    <div class="section">
      <div class="section-head">Contacts</div>
      <table class="gear">
        <thead>
          <tr>
            <th>Name</th><th>Type</th><th>Rating</th><th>Expertise</th><th>Relationship</th>
          </tr>
        </thead>
        <tbody>${rows}
        </tbody>
      </table>
    </div>`
}

function renderEquipment(equipment) {
  if (!equipment || equipment.length === 0) return ''
  const rows = equipment.map(item => {
    const harmDisplay = (item.harm !== null && item.harm !== undefined) ? esc(String(item.harm)) : '—'
    const coinDisplay = (item.coin !== undefined && item.coin > 0) ? esc(String(item.coin)) : ''
    const pickedClass = item.picked ? ' class="item-picked"' : ''
    return `
            <tr${pickedClass}>
              <td class="item-name">${esc(item.name)}</td>
              <td>${esc(item.type || '')}</td>
              <td>${harmDisplay}</td>
              <td>${esc(item.tags || '')}</td>
              <td>${coinDisplay}</td>
            </tr>`
  }).join('')
  return `
    <div class="section">
      <div class="section-head">Equipment</div>
      <table class="gear">
        <thead>
          <tr><th>Item</th><th>Type</th><th>Harm</th><th>Tags</th><th>Coin</th></tr>
        </thead>
        <tbody>${rows}
        </tbody>
      </table>
    </div>`
}

function renderTracks(clocks, clockMoves) {
  if (!clocks || clocks.length === 0) return ''
  return clocks.map(clock => {
    const entries = clock.entries || []
    const clockMove = (clockMoves || []).find(cm => cm.clock === clock.clockId)
    const note = clockMove ? clockMove.description : ''

    const boxes = entries.map(entry => {
      if (entry.icon !== undefined) {
        return `<span class="track-label">${esc(entry.name || entry.icon)}</span>`
      }
      const mod = entry.modifier && entry.modifier !== '' ? esc(entry.modifier) : ''
      return `<span class="box">${mod}</span>`
    }).join('')

    return `
    <div class="section">
      <div class="section-head">${esc(clock.title)}</div>
      ${note ? `<div class="track-note">${esc(note)}</div>` : ''}
      <div class="track-boxes">${boxes}</div>
    </div>`
  }).join('\n')
}

// ── HTML Builder ─────────────────────────────────────────────────────────────

function buildHtml(character, movesData, gameName, css) {
  const attributeMoves = movesData.AttributeMoves || {}
  const clocks = movesData.Clocks || []
  const clockMoves = movesData.ClockMoves || []

  const subtitle = character.subtitle || ''
  const title = subtitle
    ? `${esc(character.name)} — ${esc(subtitle)}`
    : esc(character.name)

  const leftCol = [
    `
    <div class="section">
      <div class="section-head">Character</div>
      <div class="hunter-name">${esc(character.name)}</div>
      ${character.look ? `<div class="hunter-look">${esc(character.look)}</div>` : ''}
    </div>`,
    character.attributes && character.attributes.length > 0
      ? `
    <div class="section">
      <div class="section-head">Attributes</div>
      ${renderAttributes(character.attributes, attributeMoves)}
    </div>`
      : '',
    renderTracks(clocks, clockMoves),
    renderContacts(character.contacts),
    renderEquipment(character.equipment),
  ].join('')

  const rightColContent =
    renderConcepts(character.concept) +
    renderMoveGroups(character.moves && character.moves.characterMoveGroups)

  const rightCol = rightColContent.trim()
    ? rightColContent
    : '\n    <div class="section"><p style="font-style:italic;color:#888;font-size:8.5pt;">No character moves defined.</p></div>'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
${css}
  </style>
</head>
<body>
<div class="page">

  <div class="page-header">
    <div class="header-title">${esc(subtitle || character.name)}</div>
    <div class="header-tagline">${esc(gameName)}${subtitle ? ` — ${esc(character.name)}` : ''}</div>
  </div>

  <div class="page-body">

    <div class="col col-left">
      ${leftCol}
    </div>

    <div class="col col-right">
      ${rightCol}
    </div>

  </div>

</div>
</body>
</html>
`
}

// ── Game Processor ────────────────────────────────────────────────────────────

function getGameName(gameId) {
  return gameId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function processGame(gameId) {
  const gameDir = path.join(GAMES_DIR, gameId)
  const movesPath = path.join(gameDir, 'moves.json')
  const charsDir = path.join(gameDir, 'characters')

  if (!fs.existsSync(movesPath)) return []
  if (!fs.existsSync(charsDir)) return []

  const movesData = JSON.parse(fs.readFileSync(movesPath, 'utf8'))
  const css = loadTheme(gameId)
  const gameName = getGameName(gameId)

  const outDir = path.join(OUT_DIR, gameId)
  fs.mkdirSync(outDir, { recursive: true })

  const charFiles = fs.readdirSync(charsDir).filter(f => f.endsWith('.json'))
  const written = []

  for (const charFile of charFiles) {
    const data = JSON.parse(
      fs.readFileSync(path.join(charsDir, charFile), 'utf8')
    )
    const characters = data.characters || []
    for (const character of characters) {
      if (!character.name) continue
      const slug = slugify(character.name)
      const outPath = path.join(outDir, `${slug}.html`)
      fs.writeFileSync(outPath, buildHtml(character, movesData, gameName, css), 'utf8')
      written.push(outPath)
      console.log(`  ✓ ${path.relative(process.cwd(), outPath)}`)
    }
  }

  return written
}

// ── Main ─────────────────────────────────────────────────────────────────────

const games = fs.readdirSync(GAMES_DIR).filter(entry =>
  fs.statSync(path.join(GAMES_DIR, entry)).isDirectory()
)

let total = 0
for (const gameId of games) {
  console.log(`\n${getGameName(gameId)}`)
  const written = processGame(gameId)
  total += written.length
}

console.log(`\nDone — ${total} character sheet${total !== 1 ? 's' : ''} written to dist/character-sheets/`)
