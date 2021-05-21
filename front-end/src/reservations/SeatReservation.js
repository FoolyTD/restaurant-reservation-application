import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { listReservation, listTables, seatReservation, listTable } from "../utils/apiCalls";
// THERE IS AN API CALL THAT WILL SEAT YOUR RESERVATION

export default function SeatReservation() {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [table, setTable] = useState([]);
  const [tableId, setTableId] = useState([]);
  const [tableError, setTableError] = useState(null);
  const [reservation, setReservation] = useState([]);
  const [reservationError, setReservationError] = useState(null);
  const { reservationId } = useParams();
  const history = useHistory();

  useEffect(loadData, []);
  //useEffect(loadTable, []);

  function loadData() {
    const abortController = new AbortController();
    setTablesError(null);
    setReservationError(null);
    listTables().then(setTables).catch(setTablesError);
    listReservation(reservationId).then(setReservation)
    .catch(setReservationError);
    return () => abortController.abort();
  }

  // Don't need API call to set table, just filter through tables and find mathing table_id 
  //  for the select option table id

  const seatingValidation = () => {
    const errors = [];
    const currentTable = table[0];
    console.log(currentTable);
    // if(reservation.people > currentTable.capacity) {
    //   errors.push({message: "Party size exceeds table capacity"})
    // }
    // if(errors.length > 0) {
    //   return false;
    // }
    return false;
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

  const handleChange = ({target:{value}}) => {
    setTableId(value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if(seatingValidation()) {
      seatReservation(reservationId, tableId)
    .then(history.push(`/dashboard`))
    .catch()
    }  
  };

  return (
    <div>
      {tablesError && tablesError.map((error) => <h1>{error}</h1>)}
      <h1>Seat Reservation {reservationId}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Table Number:
          <select onChange={handleChange} name="table_id">
            {/* <option key={0} value="">--Select Table--</option> */}
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
