const knex = require("../db/connection");

// retrieve reservations from reservations table
//  on a given date
function list(reservation_date) {
    return knex("reservations")
    .where({reservation_date})
    .select("*");
}

// lists all reservations in the reservations table
function listAll() {
    return knex("reservations")
    .select("*");
}

// insert a new reservation into reservations table
function create(reservation) {
    return knex("reservations")
    .insert(reservation)
    .returning("*")
}

// list one reservation given a reservation_id
function read(reservation_id) {
    return knex("reservations")
    .select("*")
    .where({reservation_id})
    .first();
}

// updates the status of a reservation (used for seating and finishing reservations)
function updateReservationStatus(reservation_id, updateStatus) {
    return knex("reservations")
    .update({ status: updateStatus }, "*")
    .where({ reservation_id })
}

module.exports = {
    list,
    create,
    read, 
    listAll,
    updateReservationStatus,
}