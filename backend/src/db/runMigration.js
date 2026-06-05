const fs = require('fs');
const path = require('path');
const pool = require('./index');

async function runMigration() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'migrate.sql'), 'utf8');
    await pool.query(sql);
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigration();