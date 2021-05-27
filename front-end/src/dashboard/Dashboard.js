import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import { useHistory, Link } from "react-router-dom";
import {
  listTables,
  freeTable,
  updateReservationStatus,
} from "../utils/apiCalls";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
  date,
  reservations,
  setReservations,
  reservationsError,
  setReservationsError,
}) {
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
    listTables().then(setTables).then(console.log("calling load Tables from Dashboard. Heres the list:", tables)).catch(setTablesError);
    return () => abortController.abort();
  }

  const showReservations = () => {
    return reservations.map((reservation) => {
      if (reservation.status !== "finished" && reservation.status !== "cancelled") {
        return (
          <div>
            <li key={reservation.reservation_id} className="">
              <h4>Reservation Id: {reservation.reservation_id}</h4>
              <p>Last Name: {reservation.last_name}</p>
              <p>First Name: {reservation.first_name}</p>
              <p>People: {reservation.people}</p>
              <p data-reservation-id-status={reservation.reservation_id}>
                Status: {reservation.status}
              </p>
            </li>
            {reservation.status === "booked" && (
              <Link to={`/reservations/${reservation.reservation_id}/seat`}>
                <button type="button">Seat</button>
              </Link>
            )}
            <Link to={`/reservations/${reservation.reservation_id}/edit`}>
                <button type="button">Edit</button>
            </Link>
            <button data-reservation-id-cancel={reservation.reservation_id} onClick={()=>handleCancel(reservation.reservation_id)} type="button">Cancel</button>
          </div>
        );
      } else {
        return null;
      }
    });
  };
  // Handle when the finish button it clicked
  const handleFinish = (table_id, reservation_id) => {
    const confirmation = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (confirmation) {
      // change the reservation status to finished
      updateReservationStatus(reservation_id, "finished")
        // Delete the reservation ID to free up the table
        .then(freeTable(table_id).catch(setTablesError))
        // refresh changes made to tables and reservations
        .then(loadDashboard)
        .catch(setReservationsError);
    }
  };

  // cancel button asks for confirmation before making api call to update reservation status to cancelled
  const handleCancel = (reservation_id) => {
    const confirmation = window.confirm("Do you want to cancel this reservation? This cannot be undone.")
    if (confirmation) {
      // updates reservation status to cancelled
      updateReservationStatus(reservation_id, "cancelled")
      // reload the dashboard
      .then(loadDashboard)
      .catch(setReservationsError)
    }
  }

  const showTables = () => {
    return tables.map((table) => {
      return (
        <div>
          <li key={table.table_id} className="">
            <h4>Table Name: {table.table_name}</h4>
            <p>Capacity: {table.capacity}</p>
            <p data-table-id-status={table.table_id}>
              Status: {table.reservation_id ? "Occupied" : "Free"}
            </p>
            {table.reservation_id && (
              <button
                data-table-id-finish={table.table_id}
                onClick={() =>
                  handleFinish(table.table_id, table.reservation_id)
                }
                type="button"
              >
                Finish
              </button>
            )}
          </li>
        </div>
      );
    });
  };

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
        <ul className="">{showTables()}</ul>
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
