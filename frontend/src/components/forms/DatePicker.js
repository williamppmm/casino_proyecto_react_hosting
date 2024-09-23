// src/components/forms/DatePicker.js

import React from 'react'; 
import DateRangePicker from 'react-bootstrap-daterangepicker'; 
import 'bootstrap-daterangepicker/daterangepicker.css'; 
import moment from 'moment'; // Importa Moment.js para el manejo de fechas
import 'moment/locale/es'; // Importa el archivo de localización en español para Moment.js

// Configura Moment.js para que use el idioma español
moment.locale('es');

// Definición del componente funcional DatePicker, que recibe tres props: label (la etiqueta del campo), value (el valor de la fecha seleccionada) y onDateChange (la función que se llamará cuando el usuario seleccione una fecha)
const DatePicker = ({ label, value, onDateChange }) => {
  
  // Función que se ejecuta cuando el usuario selecciona una fecha y aplica el cambio en el calendario
  const handleApply = (event, picker) => {
    // Llama a la función onDateChange que se recibe como prop, pasando la fecha seleccionada en formato 'YYYY-MM-DD'
    onDateChange(picker.startDate.format('YYYY-MM-DD'));
  };

  return (
    <div className="mb-3">
      <label>{label}</label>
      
      {/* Componente DateRangePicker para seleccionar una fecha */}
      <DateRangePicker
        initialSettings={{
          singleDatePicker: true, // Configura el componente para seleccionar solo una fecha, no un rango
          showDropdowns: true, // Habilita la selección de mes y año mediante desplegables
          minYear: 1950, // Define el año mínimo seleccionable
          maxYear: parseInt(moment().format('YYYY'), 10), // Define el año máximo seleccionable como el año actual
          locale: {
            format: 'YYYY-MM-DD', // Formato de la fecha que se mostrará en el input
            applyLabel: 'Aplicar', // Texto del botón para aplicar la selección
            cancelLabel: 'Cancelar', // Texto del botón para cancelar la selección
            customRangeLabel: 'Rango personalizado', // Texto del botón para seleccionar un rango de fechas (aunque aquí solo selecciona una)
          }
        }}
        onApply={handleApply} // Define la función que se ejecuta cuando el usuario selecciona una fecha y aplica el cambio
      >
        {/* Campo de texto que mostrará la fecha seleccionada. El valor es el que se pasa como prop, y es de solo lectura porque la fecha solo puede cambiarse mediante el calendario */}
        <input type="text" className="form-control" value={value || ''} readOnly />
      </DateRangePicker>
    </div>
  );
};

export default DatePicker; 