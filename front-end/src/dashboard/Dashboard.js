import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import { useHistory, Link } from "react-router-dom";
import { listTables, freeTable } from "../utils/apiCalls";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables()
    .then(setTables)
    .catch(setTablesError);
    return () => abortController.abort();
  }

  const showReservations = () => {
    return reservations.map((reservation) => {
      return (
        <div>
          <li key={reservation.reservation_id} className="">
            <h4>Reservation Id: {reservation.reservation_id}</h4>
            <p>Last Name: {reservation.last_name}</p>
            <p>First Name: {reservation.first_name}</p>
            <p>People: {reservation.people}</p>
          </li>
          <Link to={`/reservations/${reservation.reservation_id}/seat`}>
            <button type="button">Seat</button>
          </Link>
        </div>
      );
    });
  };
  // Handle when the finish button it clicked
  const handleClick = (table_id) => {
    const confirmation = window.confirm("Is this table ready to seat new guests? This cannot be undone.")
    if (confirmation) {
      // Delete the reservation ID to free up the table
      freeTable(table_id)
      .then(loadDashboard)
      .catch(setTablesError)
    }
  }

  const showTables = () => {
    return tables.map((table) => {
      return (
        <div>
          <li key={table.table_id} className="" >
            <h4>Table Name: {table.table_name}</h4>
            <p>Capacity: {table.capacity}</p>
            <p data-table-id-status={table.table_id}>Status: {table.reservation_id ? "Occupied" : "Free"}</p>
            {table.reservation_id && <button data-table-id-finish={table.table_id} onClick={()=>handleClick(table.table_id)} type="button">Finish</button>}
          </li>
        </div>
      );
    });
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for: {date}</h4>
        </div>
        <section>
          <ul className="">{showReservations()}</ul>
        </section>
      
      <div>
        <ul className="">
         {showTables()} 
        </ul> 
      </div>

      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      {/*JSON.stringify(reservations)*/}
      <button
        type="button"
        onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
      >
        Previous
      </button>
      <button
        type="button"
        onClick={() => history.push(`/dashboard?date=${today()}`)}
      >
        Today
      </button>
      <button
        type="button"
        onClick={() => history.push(`/dashboard?date=${next(date)}`)}
      >
        Next
      </button>
    </main>
  );
}

export default Dashboard;
