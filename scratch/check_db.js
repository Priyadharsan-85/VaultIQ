const sequelize = require('./server/models/index');
const associations = require('./server/models/associations');

async function check() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('Tables in database:', tables);
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

check();
