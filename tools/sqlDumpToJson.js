// tools/sqlDumpToJson.js
// Usage: node tools/sqlDumpToJson.js path/to/dump.sql web/init_statements.json

const fs = require('fs');
const path = require('path');

if (process.argv.length < 4) {
  console.error('Usage: node tools/sqlDumpToJson.js dump.sql out.json');
  process.exit(2);
}

const dumpPath = process.argv[2];
const outPath = process.argv[3];

let sql = fs.readFileSync(dumpPath, 'utf8');

// Option: supprimer statements non souhaités (VACUUM, PRAGMA user_version, etc.)
sql = sql.replace(/PRAGMA user_version=[0-9]+;?/gi, '');
sql = sql.replace(/VACUUM;?/gi, '');

// Split naive sur ; — généralement OK pour dump sqlite
const parts = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0);

// Prefixer ; retirés — on veut chaque statement propre
const statements = parts.map(s => s + ';');

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(statements, null, 2), 'utf8');
console.log(`Wrote ${statements.length} statements to ${outPath}`);
