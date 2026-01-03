/**
 * Generate Moves Markdown
 *
 * This script converts moves.json into a well-formatted markdown document (MOVES.md)
 * that can be used as a reference guide for all game moves.
 *
 * Usage: node generate-moves-markdown.js
 */

const fs = require('fs');
const path = require('path');

// Read moves.json
const movesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'widget-src', 'games', 'heroes-of-the-mist', 'moves.json'), 'utf8'));

let markdown = '# PbtA Moves Reference\n\n';

// Helper function to format a move
function formatMove(move) {
  let output = `### ${move.name}\n\n`;

  if (move.description) {
    output += `${move.description}\n\n`;
  }

  // Format outcomes
  if (move.outcomes) {
    const outcomeOrder = ['13+', '10+', '7-9', '6-'];
    outcomeOrder.forEach(key => {
      if (move.outcomes[key]) {
        output += `- **${key}:** ${move.outcomes[key]}\n`;
      }
    });
    output += '\n';
  }

  // Format hold options
  if (move.hold && move.hold.length > 0) {
    output += '_Options:_\n\n';
    move.hold.forEach(option => {
      output += `- ${option}\n`;
    });
    output += '\n';
  }

  return output;
}

// Attribute Moves
markdown += '## Attribute Moves\n\n';
Object.entries(movesData.AttributeMoves).forEach(([attribute, moves]) => {
  markdown += `### ${attribute}\n\n`;
  moves.forEach(move => {
    markdown += formatMove(move);
  });
});

// Multi-Attribute Moves
markdown += '## Multi-Attribute Moves\n\n';
movesData.MultiAttributeMoves.forEach(section => {
  markdown += `#### ${section.Name}\n\n`;
  if (section.Attributes) {
    markdown += `*Attributes: ${section.Attributes.join(', ')}*\n\n`;
  }
  section.Moves.forEach(move => {
    markdown += formatMove(move);
  });
});

// Contact Move
markdown += '## Contact Moves\n\n';
markdown += formatMove(movesData.ContactMove);

// Clock Moves
markdown += '## Clock Moves\n\n';
movesData.ClockMoves.forEach(move => {
  markdown += `### ${move.name}\n\n`;
  if (move.description) {
    markdown += `${move.description}\n\n`;
  }
  if (move.advance && move.advance.length > 0) {
    markdown += '\n**Advance:**\n\n';
    move.advance.forEach(action => {
      markdown += `- **${action.name}**`;
      if (action.description) {
        markdown += `: ${action.description}`;
      }
      markdown += '\n';
    });
  }
  if (move.rollback && move.rollback.length > 0) {
    markdown += '\n**Rollback:**\n\n';
    move.rollback.forEach(action => {
      markdown += `- **${action.name}**`;
      if (action.description) {
        markdown += `: ${action.description}`;
      }
      markdown += '\n';
    });
  }
  markdown += '\n';
});

// Write to file in dist folder
const outputPath = path.join(__dirname, 'dist', 'MOVES.md');
fs.writeFileSync(outputPath, markdown, 'utf8');

console.log(`Moves reference generated at: ${outputPath}`);
