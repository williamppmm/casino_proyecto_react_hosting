// src/components/common/ReCaptcha.js

import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const ReCaptcha = ({ onChange }) => {
  const handleChange = (value) => {
    console.log('Captcha value:', value);
    onChange(value); // Pasar el valor del captcha al componente padre
  };

  return (
    <ReCAPTCHA
      sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} // Usar la clave pública desde .env
      onChange={handleChange}
    />
  );
};

export default ReCaptcha;