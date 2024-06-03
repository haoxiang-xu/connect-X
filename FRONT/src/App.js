import React, { useEffect, useRef, useState, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ConnectXGameDataManager from "./DATA_MANAGERs/ConnectXGameDataManager";
import ConnectXSystemSettingMenu from "./COMPONENTs/ConnectXSettingMenu/ConnectXSettingMenu";

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
        overflow: "hidden",
      }}
    >
        <Router>
          <Routes>
            <Route path="/" element={<ConnectXGameDataManager />} />
            <Route
              path="/system-setting"
              element={<ConnectXSystemSettingMenu />}
            />
          </Routes>
        </Router>
    </div>
  );
};

export default App;
