import React from 'react';

import { FaPhoneAlt } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";

export default function Footer() {
  return (
    <footer>
      <div className="Footer-wrapper">
        <span className="Footer-text">Сontacts: </span>
        <a href="tel:+375291729834"><FaPhoneAlt /> <span>+111 11 111-11-11</span></a>
        <a href="https://t.me/yaleonovich"><FaTelegramPlane /> <span>@yaleonovich</span></a>
      </div>
    </footer>
  )
}