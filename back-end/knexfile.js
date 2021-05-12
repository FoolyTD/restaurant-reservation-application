/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

const {
  DATABASE_URL = "postgresql://postgres@localhost/postgres",
  //DATABASE_URL = "postgres://hmdtrapp:4PTqjk5_CYoFKLNZasoNSt6lGyfOoPys@queenie.db.elephantsql.com:5432/hmdtrapp",
  DATABASE_URL_DEVELOPMENT = "postgresql://postgres@localhost/postgres",
  //DATABASE_URL_DEVELOPMENT = "postgres://ikwbvlzz:aBnZ03oBucJcwkJrTpCPoiFoLW6TziDa@queenie.db.elephantsql.com:5432/ikwbvlzz",
  DATABASE_URL_TEST = "postgresql://postgres@localhost/postgres",
  //DATABASE_URL_TEST = "postgres://ogpcraop:5nhRHIzcfYWpddOGKK2zxyHzUHv1CQug@queenie.db.elephantsql.com:5432/ogpcraop",
  DATABASE_URL_PREVIEW = "postgresql://postgres@localhost/postgres",
  //DATABASE_URL_PREVIEW = "postgres://amkbpwqg:NrvFMTNrcr2Y7EKKoyMPxEz9rRix1Asb@queenie.db.elephantsql.com:5432/amkbpwqg",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
