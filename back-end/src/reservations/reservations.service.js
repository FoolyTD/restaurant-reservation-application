const knex = require("../db/connection");

function list(reservation_date) {
    return knex("reservations")
    .where({reservation_date})
    .select("*");
}

function listAll() {
    return knex("reservations")
    .select("*");
}

function create(reservation) {
    return knex("reservations")
    .insert(reservation)
    .returning("*")
}

function read(reservation_id) {
    return knex("reservations")
    .select("*")
    .where({reservation_id})
    .first();
}

module.exports = {
    list,
    create,
    read, 
    listAll,
}