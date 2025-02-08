import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PanelLogowania from "./pages/PanelLogowania";
import PanelGlowny from "./pages/PanelGlowny";
import "./global.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PanelLogowania />} />
        <Route path="/panel" element={<PanelGlowny />} />
      </Routes>
    </Router>
  );
};

export default App;
