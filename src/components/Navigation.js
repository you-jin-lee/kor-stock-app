import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

function Navigation() {
  return (
    <div className="nav">
      <Link className="title_btn" to="/">
        Korea Stock News
      </Link>
      <Link className="nav_btn" to="/about">
        About
      </Link>
    </div>
  );
}

export default Navigation;
