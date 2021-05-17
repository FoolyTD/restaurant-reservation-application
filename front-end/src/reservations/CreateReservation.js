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

    if (reservationDate.getDay() === 2) {
      errors.push({ message: "We are closed on Tuesdays" });
    }
    if (reservationDate < today) {
      errors.push({ message: "Reservations cannot be made in the past" });
    }
    setErrors(errors);
    if (errors.length > 0) {
      return false;
    }
    return true;
  };

  const displayErrors = () => {
    return errors.map((error) => {
      return <ErrorAlert error={error} />
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
      <form>
        <label>
          First Name:
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
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
          />
        </label>
        <label>
          Party Size:
          <input
            type="number"
            name="people"
            value={formData.people}
            onChange={handleChange}
          />
        </label>
        <button type="submit" onClick={handleSubmit} name="submit">
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
