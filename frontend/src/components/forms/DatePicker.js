// src/components/forms/DatePicker.js

import React from 'react';
import DatePicker from 'react-datepicker';
import { Form } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
import { registerLocale, setDefaultLocale } from 'react-datepicker';

registerLocale('es', es);
setDefaultLocale('es');

const CustomDatePicker = ({ label, value, onDateChange }) => {
  const handleChange = (date) => {
    onDateChange(date ? date.toISOString().split('T')[0] : null);
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={handleChange}
        dateFormat="dd/MM/yyyy"
        className="form-control"
        locale="es"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        placeholderText="Seleccione una fecha"
        isClearable
        showMonthDropdown
        dropdownMode="select"
      />
    </Form.Group>
  );
};

export default CustomDatePicker;