import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Home from "./routes/Home";
import About from "./routes/About.js";
import Navigation from "./components/Navigation.js";

function App() {
  return (
    <div className="container">
      <HashRouter>
        <Navigation />
        <Route path="/" exact={true} component={Home} />
        <Route path="/about" component={About} />
      </HashRouter>
    </div>
  );
}

export default App;
