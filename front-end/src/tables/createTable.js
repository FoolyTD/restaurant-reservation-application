import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/apiCalls";

export default function CreateTable() {
  const [errors, setErrors] = useState(null);
  const initialForm = {
    table_name: "",
    capacity: "",
  };
  const [formData, setFormData] = useState({ ...initialForm });
  const history = useHistory();
  const handleChange = ({ target }) => {
    // Must convert the capacity from string to number to pass backend acceptance criteria
    const value = target.name === 'capacity' ? Number(target.value) : target.value;
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };
  const validateData = () => {
    const errors = [];
    if (formData.capacity < 1) {
      errors.push({ message: "Capacity must be 1 or greater" });
    }
    if (formData.table_name.length < 2) {
      errors.push({ message: "Table name must be greater than 1 character" });
    }
    setErrors(errors);
    if (errors.length > 0) {
      return false;
    }
    return true;
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateData()) {
      createTable(formData);
      history.push(`/dashboard`);
    }
  };

  const displayErrors = () => {
    return errors.map((error, index) => {
      return <ErrorAlert key={`error-${index}`} error={error} />;
    });
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Table Name:
          <input
            className=""
            type="text"
            name="table_name"
            value={formData.table_name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Capacity:
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
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
