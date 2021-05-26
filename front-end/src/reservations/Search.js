import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import { listReservations } from "../utils/api";

export default function Search() {
  // Initialize the form as empty and create state to hold form data and
  //      store the reservations that will return from search
  const initialFormState = { mobile_number: "" };
  const [formData, setFormData] = useState({ initialFormState });
  const history = useHistory();
  const [foundReservations, setFoundReservations] = useState([]);
  const [foundReservationsError, setFoundReservationsError] = useState(null);

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

  // Display the found reservations
  const displayFoundReservations = () => {
      if(foundReservations.length === 0) {
          return <h4>No reservations found</h4>
      }
    return foundReservations.map((reservation) => {
      return (
        <div>
          <li key={reservation.reservation_id}>
            <h4>{reservation.reservation_id}</h4>
            <p>{reservation.first_name}</p>
            <p>{reservation.last_name}</p>
          </li>
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
