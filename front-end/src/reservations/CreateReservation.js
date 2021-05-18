import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

export default function CreateReservation() {
  const [errors, setErrors] = useState(null);
  const initialForm = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };
  const [formData, setFormData] = useState({ ...initialForm });
  const history = useHistory();

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const dateValidation = () => {
    const errors = [];
    const today = new Date();
    const reservationDate = new Date(formData.reservation_date);
    const reservationTime = formData.reservation_time;

    if (reservationDate.getDay() === 1) {
      errors.push({ message: "We are closed on Tuesdays" });
    }
    if (reservationDate < today) {
      errors.push({ message: "Reservations cannot be made in the past" });
    }
    if (reservationTime.localeCompare("10:30") === -1) {
      errors.push({ message: "We are closed before 10:30AM"});      
    } else if(reservationTime.localeCompare("21:30") === 1) {
      errors.push({ message: "We are closed after 9:30PM" });
    } else if(reservationTime.localeCompare("21:00") === 1 ) {
      errors.push({ message: "You must book at least 30 minutes before store closes" });
    }
    setErrors(errors);
    if (errors.length > 0) {
      return false;
    }
    return true;
  };

  const displayErrors = () => {
    return errors.map((error) => {
      return <ErrorAlert error={error} />;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (dateValidation()) {
      history.push(`/dashboard?date=${formData.reservation_date}`);
    }
    
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
          className=""
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            required
            onChange={handleChange}
          />
        </label>
        <label>
          Mobile Number:
          <input
          required
            type="tel"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
          />
        </label>
        <label>
          Date of Reservation:
          <input
            type="date"
            name="reservation_date"
            value={formData.reservation_date}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Time of Reservation:
          <input
            type="time"
            name="reservation_time"
            value={formData.reservation_time}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Party Size:
          <input
            type="number"
            name="people"
            value={formData.people}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" name="submit">
          Submit
        </button>
        <button type="button" onClick={() => history.goBack()} name="cancel">
          Cancel
        </button>
      </form>
      {errors && displayErrors()}
    </div>
  );
}
