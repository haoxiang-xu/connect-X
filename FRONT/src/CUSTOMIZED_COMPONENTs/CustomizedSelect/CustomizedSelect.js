import React, { useEffect, useState, useRef } from "react";
import { GlobalContexts } from "../../CONTEXTs/GlobalContexts";
import { GLOABL_COLOR_MANAGER } from "../../CONSTs/GlobalColorManager";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "@remixicon/react";

/* CONSTs --------------------------------------------------------------------------------------- CONSTs */
const SELECT_DIMENSIONS = { height: 34 };
/* { COLORs } */
const DARK_THEME = GLOABL_COLOR_MANAGER().DARK_THEME;
const LIGHT_THEME = GLOABL_COLOR_MANAGER().LIGHT_THEME;
/* { ICONs } */
/* CONSTs ---------------------------------------------------------------------------------------------- */

/* SUB COMPONENTs ----------------------------------------------------------------------- SUB COMPONENTs */
/* { PREFIX } */
const SelectPrefix = ({ prefix, color }) => {
  const { underDarkTheme } = React.useContext(GlobalContexts);
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      ></link>
      <span
        style={{
          position: "absolute",
          top: "0px",
          left: "6px",
          height: "100%",
          maxWidth: "50%",
          display: "flex",
          alignItems: "center",
          fontSize: "18px",
          fontFamily: "Jost",
          fontWeight: "400",
          color: color,
          transition: "0.16s",
          userSelect: "none",
          pointerEvents: "none",
          backgroundColor: underDarkTheme
            ? DARK_THEME.background
            : LIGHT_THEME.background,
        }}
      >
        {prefix + ": "}
      </span>
    </>
  );
};
/* { EXPAND AND UNEXPAND ICON } */
const ExpandIcon = ({ isExpanded, color }) => {
  return isExpanded ? (
    <RiArrowDropUpLine
      style={{
        position: "absolute",
        top: "0px",
        right: "2px",
        height: "100%",
        display: "flex",
        alignItems: "center",
        fontSize: "18px",
        color: color,
        transition: "0.16s",
      }}
    />
  ) : (
    <RiArrowDropDownLine
      style={{
        position: "absolute",
        top: "0px",
        right: "2px",
        height: "100%",
        display: "flex",
        alignItems: "center",
        fontSize: "18px",
        color: color,
        transition: "0.16s",
      }}
    />
  );
};
/* { OPTION LIST } */
const OptionList = ({
  color,
  border,
  isExpanded,
  options,
  selectedOption,
  setSelectedOption,
}) => {
  const { underDarkTheme } = React.useContext(GlobalContexts);

  const [selectedOptionTextColor, setSelectedOptionTextColor] = useState(null);
  const [selectedOptionZIndex, setSelectedOptionZIndex] = useState(null);
  const [selectedOptionHeight, setSelectedOptionHeight] = useState(null);

  const optionOnClick = (e, option) => {
    e.stopPropagation();
    setSelectedOption(option);
  };
  useEffect(() => {
    setSelectedOptionTextColor(
      underDarkTheme ? DARK_THEME.background : LIGHT_THEME.background
    );
  }, [underDarkTheme]);
  useEffect(() => {
    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = `
      ::-webkit-scrollbar {
        width: 6px;
      }
      ::-webkit-scrollbar-track {
      }
      ::-webkit-scrollbar-thumb {
        background: ${
          underDarkTheme
            ? DARK_THEME.hidden_forground
            : LIGHT_THEME.hidden_forground
        };
      }
      ::-webkit-scrollbar-thumb:hover {
        background: ${color};
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [underDarkTheme, color]);
  useEffect(() => {
    if (isExpanded) {
      setSelectedOptionZIndex("1");
      setSelectedOptionHeight(SELECT_DIMENSIONS.height * options.length + "px");
    } else {
      setTimeout(() => {
        setSelectedOptionZIndex(null);
      }, 160);
      setSelectedOptionHeight("0px");
    }
  }, [isExpanded]);

  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        right: "-3px",
        height: selectedOptionHeight,
        maxHeight: SELECT_DIMENSIONS.height * 4 + "px",
        width: "CALC(100%)",
        borderRight: border,
        borderLeft: border,
        borderBottom: border,
        backgroundColor: underDarkTheme
          ? DARK_THEME.background
          : LIGHT_THEME.background,
        transition: "0.16s",
        overflowX: "hidden",
        overflowY: options.length > 4 ? "scroll" : "hidden",
        zIndex: selectedOptionZIndex,
      }}
    >
      {options.map((option, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: SELECT_DIMENSIONS.height * index + "px",
            left: "0px",
            height: SELECT_DIMENSIONS.height + "px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            fontFamily: "Jost",
            fontWeight: "400",
            color: underDarkTheme
              ? DARK_THEME.hidden_forground
              : LIGHT_THEME.hidden_forground,
            backgroundColor: selectedOption === option ? color : "transparent",
            transition: "0.16s",
            userSelect: "none",
            cursor: "pointer",
          }}
          onClick={(e) => optionOnClick(e, option)}
        >
          <span
            style={{
              position: "absolute",
              top: "0px",
              left: "0px",
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color:
                selectedOption === option ? selectedOptionTextColor : color,
            }}
          >
            {option}
          </span>
        </div>
      ))}
    </div>
  );
};
/* { OPTION } */

/* SUB COMPONENTs -------------------------------------------------------------------------------------- */

const CustomizedSelect = ({
  prefix,
  options,
  selectedOption,
  setSelectedOption,
  onHoverColor,
}) => {
  const { underDarkTheme } = React.useContext(GlobalContexts);
  const SelectRef = useRef(null);

  const [isOnHover, setIsOnHover] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [border, setBoard] = useState(null);
  const [color, setColor] = useState(null);

  useEffect(() => {
    /* { SWITCH BORDER } */
    if (underDarkTheme) {
      if (isOnHover) {
        if (onHoverColor) {
          setBoard("3px solid " + onHoverColor);
          setColor(onHoverColor);
        } else {
          setBoard("3px solid " + DARK_THEME.onhover_forground);
          setColor(DARK_THEME.onhover_forground);
        }
      } else {
        setBoard("3px solid " + DARK_THEME.hidden_forground);
        setColor(DARK_THEME.hidden_forground);
      }
    } else {
      if (isOnHover) {
        if (onHoverColor) {
          setBoard("3px solid " + onHoverColor);
          setColor(onHoverColor);
        } else {
          setBoard("3px solid " + LIGHT_THEME.onhover_forground);
          setColor(LIGHT_THEME.onhover_forground);
        }
      } else {
        setBoard("3px solid " + LIGHT_THEME.hidden_forground);
        setColor(LIGHT_THEME.hidden_forground);
      }
    }
  }, [isOnHover, underDarkTheme]);
  /* { UNEXPAND WHEN IS NOT ON HOVER } */
  useEffect(() => {
    if (!isOnHover) {
      setIsExpanded(false);
    }
  }, [isOnHover]);

  return (
    <div
      ref={SelectRef}
      style={{
        position: "absolute",
        top: "0px",
        left: "0px",
        height: SELECT_DIMENSIONS.height + "px",
        width: "100%",
        boxSizing: "border-box",
        borderTop: border,
        borderRight: border,
        borderLeft: border,
        transition: "0.16s",
      }}
      onMouseEnter={() => setIsOnHover(true)}
      onMouseLeave={() => setIsOnHover(false)}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <OptionList
        color={color}
        border={border}
        isExpanded={isExpanded}
        options={options}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <span
        style={{
          position: "absolute",
          top: "0px",
          right: "28px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          fontSize: "18px",
          fontFamily: "Jost",
          fontWeight: "400",
          color: color,
          transition: "0.16s",
          userSelect: "none",
        }}
      >
        {selectedOption}
      </span>
      <ExpandIcon isExpanded={isExpanded} color={color} />
      <SelectPrefix prefix={prefix} color={color} />
    </div>
  );
};

export default CustomizedSelect;
