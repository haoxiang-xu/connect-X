import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ConnectXBoard from "./COMPONENTs/ConnectXBoard/ConnectXBoard";

const App = () => {
  return (
    <div
      className="App"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        height: "100vh",
        width: "100vw",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#181818",
        overflow: "hidden",
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<ConnectXBoard />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
