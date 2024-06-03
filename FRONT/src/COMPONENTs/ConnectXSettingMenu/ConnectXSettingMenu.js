import React, { useEffect, useRef, useState, useContext } from "react";

import { GLOABL_COLOR_MANAGER } from "../../CONSTs/GlobalColorManager";

import { GlobalContexts } from "../../CONTEXTs/GlobalContexts";

import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";
import CustomizedSelect from "../../CUSTOMIZED_COMPONENTs/CustomizedSelect/CustomizedSelect";

import { RiSettingsLine, RiArrowDownWideFill } from "@remixicon/react";

const DARK_THEME = GLOABL_COLOR_MANAGER().DARK_THEME;
const LIGHT_THEME = GLOABL_COLOR_MANAGER().LIGHT_THEME;

/* SUB COMPONENTs ----------------------------------------------------------------- SUB COMPONENTs */
/* { AGENT 1 SELECT } */
const Agent1Select = () => {
  const { agent1Type, setAgent1Type } = useContext(GlobalContexts);

  return (
    <div
      style={{
        position: "absolute",
        top: "0px",
        width: "100%",
      }}
    >
      <CustomizedSelect
        prefix={"AGENT 1"}
        options={["HUMAN", "RANDOM", "GREEDY", "MINMAX", "MONTE CARLO SEARCH"]}
        selectedOption={agent1Type}
        setSelectedOption={setAgent1Type}
      />
    </div>
  );
};
/* { AGENT 2 SELECT } */
const Agent2Select = () => {
  const { agent2Type, setAgent2Type } = useContext(GlobalContexts);

  return (
    <div
      style={{
        position: "absolute",
        top: "45px",
        width: "100%",
      }}
    >
      <CustomizedSelect
        prefix={"AGENT 1"}
        options={["HUMAN", "RANDOM", "GREEDY", "MINMAX", "MONTE CARLO SEARCH"]}
        selectedOption={agent2Type}
        setSelectedOption={setAgent2Type}
      />
    </div>
  );
};
/* { PANEL } */
const SettingMenuPanel = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        height: "256px",
        width: "256px",
        transform: "translate(-50%, -50%)",
        overflow: "hidden",
        transition: "0.24s",
      }}
    >
      <ThemeSwitch />
      <Agent1Select />
      <Agent2Select />
    </div>
  );
};
/* SUB COMPONENTs -------------------------------------------------------------------------------- */

const ConnectXSettingMenu = () => {
  const { onPage, setOnPage, underDarkTheme } = useContext(GlobalContexts);

  return (
    <div
      style={{
        position: "absolute",
        top: onPage === "SETTING" ? "50%" : "150%",
        left: "50%",
        height: "100vh",
        width: "100vw",
        transform: "translate(-50%, -50%)",
        transition: "0.64s cubic-bezier(0.64, -0.16, 0.2, 1.28)",
      }}
    >
      <RiSettingsLine
        style={{
          position: "absolute",
          top: "CALC(0% - 32px)",
          left: "50%",
          transform: "translate(-50%, -50%)",
          height: "20px",
          width: "20px",
          color: underDarkTheme
            ? DARK_THEME.onhover_forground
            : LIGHT_THEME.onhover_forground,
          transition: "0.64s cubic-bezier(0.64, -0.16, 0.2, 1.28)",
        }}
        onClick={() => setOnPage("SETTING")}
      />
      <SettingMenuPanel />
      <RiArrowDownWideFill
        style={{
          position: "absolute",
          top: "CALC(100% - 32px)",
          left: "50%",
          transform: "translate(-50%, -50%)",
          height: "20px",
          width: "20px",
          color: underDarkTheme
            ? DARK_THEME.onhover_forground
            : LIGHT_THEME.onhover_forground,
          transition: "0.64s cubic-bezier(0.32, -0.16, 0.2, 1.28)",
        }}
        onClick={() => setOnPage("GAME")}
      />
    </div>
  );
};

export default ConnectXSettingMenu;
