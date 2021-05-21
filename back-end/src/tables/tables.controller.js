/**
 * List handler for reservation resources
 */
const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
// Reservation has been seated
// Check if table exists
// Check if table is available (does not have restaurant_id)
// Has capacity for the reservation (table.capacity >== reservation.people)
// Consider putting the res.locals to pass data through middleware
// if reservation status is booked

async function tableCanBeUpdated(req, res, next) {
  const reservations = await reservationsService.listAll();
  
  const { data } = req.body;

  if (data === undefined) {
    return next({
      status: 400,
      message: `Request is missing data property in the body`
    })
  }
  
  const { reservation_id } = req.body.data;

  const foundReservation = reservations.filter((reservation)=> reservation.reservation_id == reservation_id);
  
  const table = await service.read(req.params.table_id);

  if (table === undefined) {
    return next({
      status: 404,
      message: `Table ${req.params.table_id} cannot be found`
    })
  }

  

  if (data.reservation_id === undefined) {
    return next({
      status: 400,
      message: `reservation_id is missing`
    })
  }

  if (foundReservation.length === 0) {
    return next({
      status: 404,
      message: `reservation ${reservation_id} does not exist` 
    })
  }

  if (foundReservation[0].people > table.capacity) {
    return next({
      status: 400,
      message: `people exceeds capacity`
    })
  }

  if (table.reservation_id) {
    return next({
      status: 400,
      message: `table is already occupied`
    })
  }
  res.locals.table = table;
  res.locals.reservation = foundReservation[0];
  next()
}

// This function contains the api validation for our tables
function tableValidation(req, res, next) {
  // Pull the request body data
  const { data } = req.body;
  
  /* 
  POST /tables
        √ returns 400 if data is missing (467 ms)
        √ returns 400 if table_name is missing (435 ms)
        √ returns 400 if table_name is empty (434 ms)
        √ returns 400 if table_name is one character (540 ms)
        √ returns 400 if capacity is missing (426 ms)
        √ returns 400 if capacity is zero (436 ms)
        √ returns 400 if capacity is not a number (434 ms)
        √ returns 201 if table is created (538 ms)
  */

  if (data === undefined) {
    return next({
      status: 400,
      message: "request is missing data"
    })
  }
  if (data.table_name === undefined || data.table_name.trim() === "" || data.table_name.length < 2) {
    return next({
      status: 400,
      message: "table_name is missing"
    })
  }
  if (data.capacity === undefined) {
    return next({
      status: 400,
      message: "capacity is missing"
    })
  }
  if (data.capacity === 0) {
    return next({
      status: 400,
      message: "capacity cannot be 0"
    })
  }
  if (typeof(data.capacity) != "number") {
    return next({
      status: 400,
      message: "capacity is missing"
    })
  }
  next();
}

async function list(req, res, next) {
  const tablesList = await service.list();
  tablesList.sort((a,b) => a.table_name.localeCompare(b.table_name));
  
  res.json({data: tablesList});
}

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data: data[0] });
}

async function update(req, res, next) {
    const updatedTable = {
      ...req.body.data,
      table_id: req.params.table_id,
    };
    const data = await service.update(updatedTable);
    res.json({ data });
}

async function read(req,res,next) {
  const data = await service.read(req.params.table_id);

  if (data === undefined) {
    return next({
      status: 404,
      message: `${req.params.table_id} does not exist`
    })
  }
  res.json({data})
}

module.exports = {
  create: [tableValidation, create],
  list,
  update: [tableCanBeUpdated, update], 
  tableCanBeUpdated,
  read,
};
