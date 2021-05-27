import { useHistory, Link } from "react-router-dom";
import React, { useState } from "react";
import { listReservations } from "../utils/api";
import { updateReservationStatus } from "../utils/apiCalls";

export default function Search() {
  // Initialize the form as empty and create state to hold form data and
  //      store the reservations that will return from search
  const initialFormState = { mobile_number: "" };
  const [formData, setFormData] = useState({ initialFormState });
  const history = useHistory();
  const [foundReservations, setFoundReservations] = useState([]);
  const [foundReservationsError, setFoundReservationsError] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  // When "Find" button is clicked, make API call to return reservations
  const handleSearch = (event) => {
    const abortController = new AbortController();
    event.preventDefault();

    listReservations(
      { mobile_number: formData.mobile_number },
      abortController.signal
    )
      .then(setFoundReservations)
      .catch(setFoundReservationsError);
  };

  // Update the form data when user types
  const handleChange = ({ target }) => {
    const value = target.value;
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  // cancel button asks for confirmation before making api call to update reservation status to cancelled
  const handleCancel = (reservation_id) => {
    const confirmation = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (confirmation) {
      const abortController = new AbortController();
      // updates reservation status to cancelled
      updateReservationStatus(reservation_id, "cancelled")
        // reload the dashboard
        .then(
          listReservations(
            { mobile_number: formData.mobile_number },
            abortController.signal
          )
            .then(setFoundReservations)
            .catch(setFoundReservationsError)
        )
        .catch(setUpdateError);
    }
  };

  // Display the found reservations
  const displayFoundReservations = () => {
    if (foundReservations.length === 0) {
      return <h4>No reservations found</h4>;
    }
    return foundReservations.map((reservation) => {
      if(reservation.status === "cancelled") {
        return null;
      }
      return (
        <div>
          <li key={reservation.reservation_id}>
            <h4>{reservation.reservation_id}</h4>
            <p>{reservation.first_name}</p>
            <p>{reservation.last_name}</p>
          </li>
          <Link to={`/reservations/${reservation.reservation_id}/seat`}>
            <button type="button">Seat</button>
          </Link>
          <Link to={`/reservations/${reservation.reservation_id}/edit`}>
            <button type="button">Edit</button>
          </Link>
          <button
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={() => handleCancel(reservation.reservation_id)}
            type="button"
          >
            Cancel
          </button>
        </div>
      );
    });
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <label>
          Enter Mobile Number:
          <input
            className=""
            type="text"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" name="submit">
          Find
        </button>
      </form>
      <section>
        <ul>{displayFoundReservations()}</ul>
      </section>
    </div>
  );
}
