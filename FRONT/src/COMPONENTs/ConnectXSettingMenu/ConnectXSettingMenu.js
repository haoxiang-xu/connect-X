import React, { useContext } from "react";

import { GLOABL_COLOR_MANAGER } from "../../CONSTs/GlobalColorManager";

import { GlobalContexts } from "../../CONTEXTs/GlobalContexts";

import ThemeSwitch from "../SETTING_MENU_SUBCOMPONENTs/ThemeSwitch/ThemeSwitch";
import HideOrShowUnlinkableCheckerSwitch from "../SETTING_MENU_SUBCOMPONENTs/HideOrShowUnlinkableCheckerSwitch/HideOrShowUnlinkableCheckerSwitch";
import BoardDimensionSettingToggle from "../SETTING_MENU_SUBCOMPONENTs/BoardDimensionSettingToggle/BoardDimensionSettingToggle";
import BoardInARowSettingSwitch from "../SETTING_MENU_SUBCOMPONENTs/BoardInARowSettingSwitch/BoardInARowSettingSwitch";
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
  "SAVK_MINMAX",
  "MONTE_CARLO",
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
      <BoardDimensionSettingToggle />
      <BoardInARowSettingSwitch />
      <HideOrShowUnlinkableCheckerSwitch />
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
