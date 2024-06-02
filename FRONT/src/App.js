import React, { useEffect, useRef, useState, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { GlobalContexts } from "./CONTEXTs/GlobalContexts";

import ConnectXGameDataManager from "./DATA_MANAGERs/ConnectXGameDataManager";

const App = () => {
  const [underDarkTheme, setUnderDarkTheme] = useState(true);

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
      <GlobalContexts.Provider value={{ underDarkTheme, setUnderDarkTheme }}>
        <Router>
          <Routes>
            <Route path="/" element={<ConnectXGameDataManager />} />
          </Routes>
        </Router>
      </GlobalContexts.Provider>
    </div>
  );
};

export default App;
