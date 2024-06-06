import React, { useEffect, useRef, useState, useContext } from "react";

import { GLOABL_COLOR_MANAGER } from "../../CONSTs/GlobalColorManager";

import { GlobalContexts } from "../../CONTEXTs/GlobalContexts";

import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";
import CustomizedSelect from "../../CUSTOMIZED_COMPONENTs/CustomizedSelect/CustomizedSelect";

import { RiSettingsLine, RiArrowDownWideFill } from "@remixicon/react";

const DARK_THEME = GLOABL_COLOR_MANAGER().DARK_THEME;
const LIGHT_THEME = GLOABL_COLOR_MANAGER().LIGHT_THEME;

/* SUB COMPONENTs ----------------------------------------------------------------- SUB COMPONENTs */
const AGENT_TYPES = [
  "HUMAN",
  "RANDOM",
  "GREEDY",
  "MINMAX",
  "MONTE_CARLO",
  "MINMAX_MONTE_CARLO",
];

/* { AGENT 1 SELECT } */
const Agent1Select = () => {
  const { agent1Type, setAgent1Type, underDarkTheme } =
    useContext(GlobalContexts);

  return (
    <div
      style={{
        position: "absolute",
        top: "0px",
        width: "100%",
      }}
    >
      <CustomizedSelect
        prefix={"PLAYER 1"}
        options={AGENT_TYPES}
        selectedOption={agent1Type}
        setSelectedOption={setAgent1Type}
        onHoverColor={
          underDarkTheme
            ? DARK_THEME.player_1_checker
            : LIGHT_THEME.player_1_checker
        }
      />
    </div>
  );
};
/* { AGENT 2 SELECT } */
const Agent2Select = () => {
  const { agent2Type, setAgent2Type, underDarkTheme } =
    useContext(GlobalContexts);

  return (
    <div
      style={{
        position: "absolute",
        top: "45px",
        width: "100%",
      }}
    >
      <CustomizedSelect
        prefix={"PLAYER 2"}
        options={AGENT_TYPES}
        selectedOption={agent2Type}
        setSelectedOption={setAgent2Type}
        onHoverColor={
          underDarkTheme
            ? DARK_THEME.player_2_checker
            : LIGHT_THEME.player_2_checker
        }
      />
    </div>
  );
};
/* { BOARD DIMENSION SETTING } */
const BoardDimensionSetting = () => {
  const { underDarkTheme } = useContext(GlobalContexts);
  const SETTING_PANEL_SIZE = 64;
  const [position, setPosition] = useState({
    x: SETTING_PANEL_SIZE / 2,
    y: SETTING_PANEL_SIZE / 2,
  });
  const [transition, setTransition] = useState("background-color 0.16s");

  const handleMouseMove = (event) => {
    setTransition("background-color 0.16s");
    setPosition({
      x: event.clientX - event.target.getBoundingClientRect().left,
      y: event.clientY - event.target.getBoundingClientRect().top,
    });
  };

  return (
    <div
      style={{ position: "absolute", top: "90px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setPosition({ x: SETTING_PANEL_SIZE / 2, y: SETTING_PANEL_SIZE / 2 });
        setTransition(
          "background-color 0.16s, " +
            "top 0.16s cubic-bezier(0.32, -0.16, 0.2, 1.64), " +
            "left 0.16s cubic-bezier(0.32, -0.16, 0.2, 1.64)"
        );
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "0px",
          height: `${SETTING_PANEL_SIZE}px`,
          width: `${SETTING_PANEL_SIZE}px`,
          backgroundColor: underDarkTheme
            ? DARK_THEME.hidden_forground
            : LIGHT_THEME.hidden_forground,
          transition: "0.16s",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `CALC(50% - ${position.y - SETTING_PANEL_SIZE / 2}px)`,
            left: `CALC(50% - ${position.x - SETTING_PANEL_SIZE / 2}px)`,
            transform: "translate(-50%, -50%)",
            height: "50px",
            width: "50px",
            borderRadius: "50px",
            backgroundColor: underDarkTheme
              ? DARK_THEME.background
              : LIGHT_THEME.background,
            transition: transition,
            pointerEvents: "none",
          }}
        ></div>
      </div>
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
      <BoardDimensionSetting />
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
        transition:
          "color 0.16s, top 0.72s cubic-bezier(0.64, -0.16, 0.2, 1.16)",
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
            ? DARK_THEME.hidden_forground
            : LIGHT_THEME.hidden_forground,
          transition:
            "color 0.16s, top 0.72s cubic-bezier(0.64, -0.16, 0.2, 1.16)",
        }}
        onClick={() => setOnPage("SETTING")}
      />
      <SettingMenuPanel />
      <RiArrowDownWideFill
        style={{
          position: "absolute",
          top: "CALC(0% + 32px)",
          left: "50%",
          transform: "translate(-50%, -50%)",
          height: "20px",
          width: "20px",
          color: underDarkTheme
            ? DARK_THEME.hidden_forground
            : LIGHT_THEME.hidden_forground,
          transition:
            "color 0.16s, top 0.72s cubic-bezier(0.64, -0.16, 0.2, 1.16)",
        }}
        onClick={() => setOnPage("GAME")}
      />
    </div>
  );
};

export default ConnectXSettingMenu;
