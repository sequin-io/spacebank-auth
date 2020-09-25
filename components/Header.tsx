import React from "react";

export default function Header() {
  return (
    <div className="header">
      <div className="brand">
        <img src="/comet.png" alt="Spacebank Logo" className="logo" />
        <div className="text">
          <div className="primary">SPACEBANK</div>
          <div className="secondary">Your finances. To the moon.™</div>
        </div>
      </div>
    </div>
  );
}
