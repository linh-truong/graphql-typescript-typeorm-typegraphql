/* eslint-disable @typescript-eslint/no-var-requires */
const { SnakeNamingStrategy } = require("typeorm-naming-strategies");

module.exports = {
  type: "postgres",
  host: process.env.DB_HOST,
  extra: {
    socketPath: process.env.DB_HOST,
  },
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: ["dist/entities/**/*.js"],
  migrations: ["dist/migrations/**/*.js"],
  cli: {
    entitiesDir: "src/entities",
    migrationsDir: "src/migrations",
  },
  namingStrategy: new SnakeNamingStrategy(),
};
