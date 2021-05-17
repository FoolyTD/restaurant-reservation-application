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

module.exports = {
    list,
    create,
}