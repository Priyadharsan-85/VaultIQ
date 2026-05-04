const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

db.serialize(() => {
  db.run(`ALTER TABLE Users ADD COLUMN plaidAccessToken VARCHAR(255);`, (err) => {
    if (err) console.log(err.message); // Might say duplicate column if it already exists
    else console.log('Added plaidAccessToken column');
  });
  db.run(`ALTER TABLE Users ADD COLUMN plaidItemId VARCHAR(255);`, (err) => {
    if (err) console.log(err.message);
    else console.log('Added plaidItemId column');
  });
});

db.close();
