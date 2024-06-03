import React, { useEffect, useRef, useState, useContext } from "react";

import { GlobalContexts } from "../CONTEXTs/GlobalContexts";

import ConnectXBoard from "../COMPONENTs/ConnectXBoard/ConnectXBoard";
import ConnectXSettingMenu from "../COMPONENTs/ConnectXSettingMenu/ConnectXSettingMenu";

const ConnectXGameDataManager = () => {
  const [onPage, setOnPage] = useState("GAME");

  const [underDarkTheme, setUnderDarkTheme] = useState(true);

  const [agent1Type, setAgent1Type] = useState("HUMAN");
  const [agent2Type, setAgent2Type] = useState("MONTE_CARLO");

  return (
    <GlobalContexts.Provider
      value={{
        onPage,
        setOnPage,
        underDarkTheme,
        setUnderDarkTheme,
        agent1Type,
        setAgent1Type,
        agent2Type,
        setAgent2Type,
      }}
    >
      <ConnectXBoard />
      <ConnectXSettingMenu />
    </GlobalContexts.Provider>
  );
};

export default ConnectXGameDataManager;
