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
// Update an existing table when seated
function update(updatedTable) {
    return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*");
}

function read(table_id) {
    return knex("tables")
    .select("*")
    .where({table_id})
    .first()
}
module.exports = {
    create,
    list,
    update,
    read
}