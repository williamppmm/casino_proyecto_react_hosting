// src/components/forms/Direccion.js

import React, { useState } from 'react';

const Direccion = ({ onDireccionCompleta }) => {
  const [tipoCalle, setTipoCalle] = useState('');
  const [numero1, setNumero1] = useState('');
  const [numero2, setNumero2] = useState('');
  const [numero3, setNumero3] = useState('');
  const [complemento, setComplemento] = useState('');

  const handleDireccionChange = () => {
    const direccionCompleta = `${tipoCalle} ${numero1} # ${numero2}-${numero3} ${complemento}`;
    // Asegúrate de que onDireccionCompleta exista antes de llamarla
    if (typeof onDireccionCompleta === 'function') {
      onDireccionCompleta(direccionCompleta);
    } else {
      console.error('onDireccionCompleta no es una función');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <div className="mb-4">
        <label htmlFor="tipoCalle" className="block mb-2">Tipo de vía:</label>
        <select
          id="tipoCalle"
          value={tipoCalle}
          onChange={(e) => { setTipoCalle(e.target.value); handleDireccionChange(); }}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Seleccionar</option>
          <option value="Calle">Calle</option>
          <option value="Carrera">Carrera</option>
          <option value="Avenida">Avenida</option>
          <option value="Diagonal">Diagonal</option>
          <option value="Transversal">Transversal</option>
        </select>
      </div>

      <div className="mb-4">
      <label htmlFor="numero1" className="block mb-2">&nbsp;</label>
        <input
          type="text"
          id="numero1"
          value={numero1}
          onChange={(e) => { setNumero1(e.target.value); handleDireccionChange(); }}
          className="w-full p-2 border rounded"
          required
          maxLength="6"
          placeholder="34A"
        />
      </div>

      <div className="mb-4">
      <label htmlFor="numero1" className="block mb-2">&nbsp;#&nbsp;</label>
        <input
          type="text"
          id="numero2"
          value={numero2}
          onChange={(e) => { setNumero2(e.target.value); handleDireccionChange(); }}
          className="w-full p-2 border rounded"
          required
          maxLength="6"
          placeholder="45C"
        />
      </div>

      <div className="mb-4">
      <label htmlFor="numero1" className="block mb-2">&nbsp;-&nbsp;</label>
        <input
          type="number"
          id="numero3"
          value={numero3}
          onChange={(e) => { setNumero3(e.target.value); handleDireccionChange(); }}
          className="w-full p-2 border rounded"
          required
          max="999"
          placeholder="187"
        />
      </div>

      <div className="mb-4">
      <label htmlFor="numero1" className="block mb-2">&nbsp;Barrio&nbsp;</label>
        <input
          type="text"
          id="complemento"
          value={complemento}
          onChange={(e) => { setComplemento(e.target.value); handleDireccionChange(); }}
          className="w-full p-2 border rounded"
          placeholder="San Vicente"
        />
      </div>
    </div>
  );
};

export default Direccion;