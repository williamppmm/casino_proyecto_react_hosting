// src/components/common/WhatsAppButton.js

import React from 'react';
import './WhatsAppButton.css'; // Para agregar estilos personalizados

// Asegúrate de que el ícono esté en la ruta correcta
import WhatsAppIcon from '../../assets/icons/WhatsApp.svg';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/573152728882" 
      target="_blank"
      rel="noopener noreferrer"
      title="¿Necesitas ayuda? Chatea con nosotros en WhatsApp"
      className="whatsapp-button"
      aria-label="Chat with us on WhatsApp"
    >
      <img src={WhatsAppIcon} alt="WhatsApp Icon" className="whatsapp-icon" />
    </a>
  );
};

export default WhatsAppButton;