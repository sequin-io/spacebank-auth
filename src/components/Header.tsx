import React from "react";
import "./Header.css";

import logo from "../assets/logo_white.svg";

export default function Header() {
  return (
    <div className="header">
      <div className="content">
        <img src={logo} alt="Spacebank Logo" className="logo" />
      </div>
    </div>
  );
}
