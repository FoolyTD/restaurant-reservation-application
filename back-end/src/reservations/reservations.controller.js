/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");

//////////////////////////////////////////////////
/////          MIDDLEWARE PIPELINE          /////
////////////////////////////////////////////////

// checking is a reservation exists and placing it in the res.locals object
async function reservationExists(req,res,next) {
  const { reservation_Id } = req.params;
  const reservation = await service.read(reservation_Id);

  if(reservation === undefined) {
    return next({
      status: 404,
      message: `reservation with an id of ${reservation_Id} does not exist` 
    });
  }
  res.locals.reservation = reservation;
  next()
}

// validating the fields on an incoming request to create a reservation
function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  // setting the incoming reservation's status to booked
  if (data.status === undefined) {
    data.status = "booked";
  }
  if (data.first_name === undefined || data.first_name === "") {
    return next({
      status: 400,
      message: "invalid first_name",
    });
  }
  if (data.last_name === undefined || data.last_name === "") {
    return next({
      status: 400,
      message: "invalid last_name",
    });
  }
  if (data.mobile_number === undefined || data.mobile_number === "") {
    return next({
      status: 400,
      message: "invalid mobile_number",
    });
  }
  if (data.reservation_date === undefined || data.reservation_date === "") {
    return next({
      status: 400,
      message: "invalid reservation_date",
    });
  }
  if (data.reservation_time === undefined || data.reservation_time === "") {
    return next({
      status: 400,
      message: "invalid reservation_time",
    });
  }
  if (data.people === undefined || data.people === 0 || typeof(data.people) != "number") {
    return next({
      status: 400,
      message: "invalid number of people",
    });
  }
  if (data.reservation_time.length !== 5) {
    return next({
      status: 400,
      message: "invalid reservation_time",
    });
  }
  if (data.reservation_date.slice(4,5) != "-") {
    return next({
      status: 400,
      message: "invalid reservation_date",
    });
  }
  if (data.status !== "booked") {
    return next({
      status: 400,
      message: `invalid reservation status: ${data.status} reservations can only be made with the status of booked`,
    });
  }

  res.locals.reservation = data;
  next();
}

// validating the date
function dateIsValid(req,res,next) {
  const { reservation_date } = req.body.data;
  const reservation = new Date(reservation_date);
  const today = new Date();

  if (reservation < today) {
    return next({
      status: 400,
      message: "Reservation must be in the future"
    })
  }
  if (reservation.getDay() === 1) {
    return next({
      status: 400,
      message: "we are closed on Tuesdays"
    })
  }
  next();
}

// validating reservation time
function timeIsValid(req, res, next) {
  const { reservation_time } =  req.body.data;
  
  if (reservation_time.localeCompare("10:30") === -1) {
    next({
      status: 400,
      message: "Store closed before 10:30AM"
    });      
  } else if(reservation_time.localeCompare("21:30") === 1) {
    next({
      status: 400,
      message: "Store closed after 09:30PM"
    });
  } else if(reservation_time.localeCompare("21:00") === 1 ) {
    next({
      status: 400,
      message: "You must book at least 30 minutes before store closes"
    });
  }
  next();
}

/////////////////////////////////////////////////////////////////////////////
/////                         CRUD OPERATIONS                         //////
///////////////////////////////////////////////////////////////////////////

async function list(req, res) {
  const date = req.query.date;
  const rawData = await service.list(date);
  // remove reservations with a status of finished
  const data = rawData.filter((reservation)=>reservation.status !== "finished");
  
  data.sort((a, b) => a.reservation_time.localeCompare(b.reservation_time));

  res.json({
    data: data,
  });
}

async function create(req, res, next) {
  const data = await service.create(res.locals.reservation);
  res.status(201).json({ data: data[0] });
}

async function listAll(req,res,next) {
  const data = await service.listAll();
  res.json({data});
}

async function read(req,res,next) {
  res.json({ data: res.locals.reservation });
}

async function updateReservationStatus(req,res,next) {
  const { status } = req.body.data;
  const reservation = res.locals.reservation;

  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: "cannot update a finished reservation"
    })
  }
  if (status === "finished" || status === "seated" || status === "booked") {
    const data = await service.updateReservationStatus(reservation.reservation_id, status);
    return res.json({data: data[0]});
  }
  return next({
    status: 400,
    message: `reservation status "${status}" is prohibited on this reservation`
  })
}
module.exports = {
  list,
  create: [hasValidProperties, dateIsValid, timeIsValid, create],
  read: [reservationExists, read],
  listAll,
  reservationExists,
  updateReservationStatus: [reservationExists, updateReservationStatus]
};
