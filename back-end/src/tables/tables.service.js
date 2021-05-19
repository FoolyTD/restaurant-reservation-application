const knex = require("../db/connection");

// list all tables
function list() {
    return knex("tables")
    .select("*");
}
// Insert a new table object into tables table
function create(table) {
    return knex("tables")
    .insert(table)
    .returning("*");
}

module.exports = {
    create,
    list,
}