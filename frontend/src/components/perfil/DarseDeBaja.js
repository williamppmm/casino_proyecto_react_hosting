// src/components/perfil/DarseDeBaja.js

import React from 'react';
import { Button } from "@/components/ui/button"

const DarseDeBaja = () => {
  const handleDarseDeBaja = () => {
    // Lógica para darse de baja del sistema
    console.log('Darse de baja');
  };

  return (
    <div className="space-y-4">
      <p>¿Estás seguro de que quieres darte de baja del sistema?</p>
      <Button onClick={handleDarseDeBaja} variant="destructive">Confirmar Baja</Button>
    </div>
  );
};

export default DarseDeBaja;