const knex = require("../db/connection");

function list(reservation_date) {
    return knex("reservations")
    .where({reservation_date})
    .select("*");
}

function create(reservation) {
    return knex("reservations")
    .insert(reservation)
    .returning("*")
}

function read(reservation_id) {
    return knex("reservations")
    .where({reservation_id})
    .select("*");
}

module.exports = {
    list,
    create,
    read
}