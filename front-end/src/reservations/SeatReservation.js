import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  listReservation,
  seatReservation,
  updateReservationStatus,
  listTables
} from "../utils/apiCalls";
import ErrorAlert from "../layout/ErrorAlert";

export default function SeatReservation({
  tables,
  loadTables,
  tableId,
  setTableId,
}) {
  const [table, setTable] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [reservation, setReservation] = useState([]);
  const [reservationError, setReservationError] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);
  
  const { reservationId } = useParams();
  const history = useHistory();

  // Load the reservation data once the page mounts,
  //    this data will be used to validate seating capacity
  useEffect(loadReservationData, []);
  useEffect(()=> {
    const abortController = new AbortController();
    
    setTablesError(null);
    listTables(abortController.signal)
    .then(setAvailableTables)
    .catch(setTablesError);

    return ()=> abortController.abort;
  }, [])

  // Make an api call to database and set the reservation data to
  //    match using the reservationId from the route parameters
  //    (Remember this is running asyncronously) 
  function loadReservationData() {
    const abortController = new AbortController();
    setReservationError(null);
    listReservation(reservationId)
      .then(setReservation)
      .catch(setReservationError);
    return () => abortController.abort();
  }

  const listTableOptions = () => {
    return availableTables.map((table) => {
      return (
        <option
          key={table.table_id}
          value={table.table_id}
          capacity={table.capacity}
        >
          {table.table_name} - {table.capacity}
        </option>
      );
    });
  };

  const handleChange = async ({ target: { value } }) => {
    await setTableId((currentValue) => (currentValue = value));
  };

  const handleSubmit = (event) => {
    const abortController = new AbortController();
    event.preventDefault();
    // If the validations are correct, then seat the reservation and change the
    //    status so seated
      seatReservation(reservationId, tableId)
      .then(()=>history.push(`/dashboard`))
      .catch(setSubmissionError)
  };

  return (
    <div>
      <h1>Seat Reservation {reservationId}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Table Number:
          <select onChange={handleChange} name="table_id" required>
            <option key={0} value={null}>
              --Select Table--
            </option>
            {listTableOptions()}
          </select>
        </label>
        <button type="submit" name="submit">
          Submit
        </button>
        <button type="button" onClick={() => history.goBack()} name="cancel">
          Cancel
        </button>
      </form>
      <ErrorAlert error={submissionError} />
      <ErrorAlert error={submissionError} />
    </div>
  );
}
