/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");

function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;

  if (data.first_name === undefined) {
    return next({
      status: 400,
      message: "invalid first_name",
    });
  }
  if (data.first_name === "") {
    return next({
      status: 400,
      message: "invalid first_name",
    });
  }
  if (data.last_name === undefined) {
    return next({
      status: 400,
      message: "invalid last_name",
    });
  }
  if (data.last_name === "") {
    return next({
      status: 400,
      message: "invalid last_name",
    });
  }
  if (data.mobile_number === undefined) {
    return next({
      status: 400,
      message: "invalid mobile_number",
    });
  }
  if (data.mobile_number === "") {
    return next({
      status: 400,
      message: "invalid mobile_number",
    });
  }
  if (data.reservation_date === undefined) {
    return next({
      status: 400,
      message: "invalid reservation_date",
    });
  }
  if (data.reservation_date === "") {
    return next({
      status: 400,
      message: "invalid reservation_date",
    });
  }

  if (data.reservation_time === undefined) {
    return next({
      status: 400,
      message: "invalid reservation_time",
    });
  }
  if (data.reservation_time === "") {
    return next({
      status: 400,
      message: "invalid reservation_time",
    });
  }
  if (data.people === undefined) {
    return next({
      status: 400,
      message: "invalid number of people",
    });
  }
  if (data.people === 0) {
    return next({
      status: 400,
      message: "invalid number of people",
    });
  }
  if (typeof(data.people) != "number") {
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
  res.locals.data = req.body.data;
  next();
}

function dateIsValid(req,res,next) {
  const { reservation_date } = req.body.data;
  const reservation = new Date(reservation_date);
  const today = new Date();
  console.log("getDay",reservation.getDay());

  if (reservation < today) {
    console.log("should catch past res error")
    return next({
      status: 400,
      message: "Reservation must be in the future"
    })
  }
  if (reservation.getDay() === 1) {
    console.log("should catch tuesday error")
    return next({
      status: 400,
      message: "we are closed on Tuesdays"
    })
  }
  next();
}

async function list(req, res) {
  const date = req.query.date;
  const rawData = await service.list(date);
  rawData.sort((a, b) => a.reservation_time.localeCompare(b.reservation_time));

  res.json({
    data: rawData,
  });
}
async function create(req, res, next) {
  const data = await service.create(res.locals.data);
  res.status(201).json({ data: data[0] });
}
module.exports = {
  list,
  create: [hasValidProperties, dateIsValid, create],
};
