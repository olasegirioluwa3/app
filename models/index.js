import fs from "fs";
import path from "path";
import { exec } from "child_process";
import process from "process";
import { fileURLToPath } from "url";
import Sequelize from "sequelize";

// Convert the URL of the current module to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const configPath = path.join(__dirname, "..", "config", "config.json");
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  const connectionString = process.env[config.use_env_variable];
  if (connectionString) {
    sequelize = new Sequelize(connectionString);
  } else {
    console.error(`Environment variable ${config.use_env_variable} not set`);
    process.exit(1);
  }
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Function to export the database to a SQL file
function exportDatabase() {
  const timestamp = new Date().getTime();
  const exportFileName = path.join(__dirname, `backup_${timestamp}.sql`);

  const exportCommand = `mysqldump -u${config.username} -p${config.password} -h${config.host} ${config.database} > "${exportFileName}"`;

  const childProcess = exec(exportCommand, { cwd: __dirname, shell: true }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error exporting database: ${error.message}`);
      console.error(stderr);
    } else {
      console.log(`Database exported to ${exportFileName}`);
    }
  });

  // Redirect child process output to the console
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);
}

// Export the database before syncing
// exportDatabase();

const modelFiles = fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  });

for (const file of modelFiles) {
  const model = (await import(path.join(__dirname, file))).default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// Sync the database with force: true to drop and recreate tables
// sequelize
//   .sync({ force: true })
//   .then(() => {
//     console.log("All tables have been dropped and re-synced.");
//   })
//   .catch((err) => {
//     console.error("Error dropping and re-syncing tables:", err);
//   });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
