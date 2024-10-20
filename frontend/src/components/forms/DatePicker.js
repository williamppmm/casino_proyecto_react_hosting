// src/components/forms/DatePicker.js

import React from 'react';
import DatePicker from 'react-datepicker';
import { Form } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';
import es from 'date-fns/locale/es';
import { registerLocale, setDefaultLocale } from 'react-datepicker';

registerLocale('es', es);
setDefaultLocale('es');

const CustomDatePicker = ({ id, label, value, onDateChange }) => {
  const handleChange = (date) => {
    onDateChange(date ? date.toISOString().split('T')[0] : null);
  };

  return (
    <Form.Group className="md-3">
      <Form.Label htmlFor={id}>{label}</Form.Label>
      <DatePicker
        id={id}
        selected={value ? new Date(value) : null}
        onChange={handleChange}
        dateFormat="dd/MM/yyyy"
        className="form-control custom-datepicker"
        locale="es"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        placeholderText="dd/mm/aaaa"
        isClearable
        showMonthDropdown
        dropdownMode="select"
        maxDate={new Date()} // Añadido: Restringe la selección a la fecha actual o anterior
      />
    </Form.Group>
  );
};

export default CustomDatePicker;