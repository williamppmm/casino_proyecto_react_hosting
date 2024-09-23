// src/components/forms/ReCaptcha.js 

import React from 'react';
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = "6Ld6HUwqAAAAACu5ilbGZR7Ei_aWQxNIp1QStRoo"; // clave proporcionada por reCAPTCHA Google

const ReCaptcha = ({ onChange }) => {
  return (
    <div className="my-4">
      <ReCAPTCHA
        sitekey={RECAPTCHA_SITE_KEY}
        onChange={onChange} // onChange llama al setCaptchaValue
      />
    </div>
  );
};

export default ReCaptcha;