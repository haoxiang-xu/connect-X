import React, { useEffect, useRef, useState, useContext } from "react";

import { GlobalContexts } from "../CONTEXTs/GlobalContexts";

import ConnectXBoard from "../COMPONENTs/ConnectXBoard/ConnectXBoard";
import ConnectXSettingMenu from "../COMPONENTs/ConnectXSettingMenu/ConnectXSettingMenu";

const ConnectXGameDataManager = () => {
  const [onPage, setOnPage] = useState("GAME");

  const [underDarkTheme, setUnderDarkTheme] = useState(true);

  const [agent1Type, setAgent1Type] = useState("MONTE_CARLO");
  const [agent2Type, setAgent2Type] = useState("MONTE_CARLO");

  const [boardRows, setBoardRows] = useState(6);
  const [boardColumns, setBoardColumns] = useState(7);
  const [inarow, setInarow] = useState(4);
  const [showUnlinkableCheckerSwitch, setShowUnlinkableCheckerSwitch] =
    useState(true);

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
        boardRows,
        setBoardRows,
        boardColumns,
        setBoardColumns,
        inarow,
        setInarow,
        showUnlinkableCheckerSwitch,
        setShowUnlinkableCheckerSwitch,
      }}
    >
      <ConnectXBoard />
      <ConnectXSettingMenu />
    </GlobalContexts.Provider>
  );
};

export default ConnectXGameDataManager;
