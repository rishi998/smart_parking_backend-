import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '4321',
    database: process.env.DB_NAME || 'Parker_pro',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql', // or your dialect
    migrationStorage: 'json',
    migrationStoragePath: path.join(__dirname, 'sequelize-meta.json'),
    seederStorage: 'json',
    seederStoragePath: path.join(__dirname, 'sequelize-seed.json')
  },
  test: { /* similar structure */ },
  production: { /* similar structure */ }
}