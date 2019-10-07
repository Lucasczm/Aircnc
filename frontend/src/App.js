import React from "react";
import "./App.css";

import logo from "./assets/logo.svg";

import Routes from "./routes";

function App() {
  return (
    <div className="App">
      <div className="container">
        <img src={logo} alt="airCnC" />
        <div className="content">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default App;
