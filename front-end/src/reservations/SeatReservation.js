import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { listReservation, listTables, seatReservation } from "../utils/apiCalls";
// THERE IS AN API CALL THAT WILL SEAT YOUR RESERVATION

export default function SeatReservation({tables, loadTables}) {
  //const [tables, setTables] = useState([]);
  //const [tablesError, setTablesError] = useState(null);
  const [table, setTable] = useState(null);
  const [tableId, setTableId] = useState(null);
  const [reservation, setReservation] = useState([]);
  const [reservationError, setReservationError] = useState(null);
  const { reservationId } = useParams();
  const history = useHistory();

  useEffect(loadData, [reservationId, tableId]);
  useEffect(loadTable, [tableId]);

  function loadData() {
    const abortController = new AbortController();
   // setTablesError(null);
    setReservationError(null);
   // listTables().then(setTables).catch(setTablesError);
    listReservation(reservationId).then(setReservation)
    .catch(setReservationError);
    return () => abortController.abort();
  }

  // Don't need API call to set table, just filter through tables and find mathing table_id 
  //  for the select option table id
  function loadTable() {
    const foundTable = tables.find((table)=>table.table_id === Number(tableId));
    setTable(foundTable);
  }

  const seatingValidation = () => {
    const errors = [];
    if(!table || table.length === 0) {
      return false;
    }
    if (table.reservation_id) {
      errors.push({message: "Table already occupied"});
    }
    if(table.capacity < reservation.people) {
      errors.push({message: "table not big enough"});
    }
    if (errors.length > 0) {
     // setTablesError(errors);
      return false;
    }
    return true;
  }

  const listTableOptions = () => {
    return tables.map((table) => {
      return (
        <option key={table.table_id} value={table.table_id} capacity={table.capacity}>
          {table.table_name} - {table.capacity}
        </option>
      );
    });
  };

  const handleChange = async ({target:{value}}) => {
    setTableId((currentValue)=> currentValue = value);
  }

  const handleSubmit = (event) => {
    const abortController = new AbortController();
    event.preventDefault();

    if(seatingValidation()) {
    seatReservation(reservationId, tableId)
   // .then(window.setTimeout(window.alert, 2*1000, 'That was really slow!'))
   .then(loadTables())
    .then(history.push(`/dashboard`))
    .catch(console.log(""))
    return () => abortController.abort();
    }  
  };

  return (
    <div>
      <h1>Seat Reservation {reservationId}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Table Number:
          <select onChange={handleChange} name="table_id" required>
            <option key={0} value={null}>--Select Table--</option>
            {listTableOptions()}
          </select>
        </label>
        <button type="submit" name="submit">
          Submit
        </button>
        <button type="button" onClick={()=>history.goBack()} name="cancel">
          Cancel
        </button>
      </form>
    </div>
  );
}
