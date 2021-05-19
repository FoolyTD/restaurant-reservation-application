/**
 * List handler for reservation resources
 */
const service = require("./tables.service");

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
module.exports = {
  create: [tableValidation, create],
  list,
};
