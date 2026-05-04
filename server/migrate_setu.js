const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) console.error(err.message);
});

db.serialize(() => {
  db.run(`ALTER TABLE Users ADD COLUMN phone VARCHAR(255);`, () => {});
  db.run(`ALTER TABLE Users ADD COLUMN aaConsentId VARCHAR(255);`, () => {});
});
db.close();
