import React, { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";

import { GlobalContexts } from "../../CONTEXTs/GlobalContexts";
import { ConnectXBoardContexts } from "../../CONTEXTs/ConnectXBoardContexts";

import { GLOABL_COLOR_MANAGER } from "../../CONSTs/GlobalColorManager";
/* IMGs ---------------------------------------------------------------------------------------------- IMG */
import BOX_DARK from "./IMGs/board_box_dark_theme.svg";
import BOX_LIGHT from "./IMGs/board_box_light_theme.svg";

import invisible from "./IMGs/invisible.png";

import player_1_finger_cursor_dark_theme from "./IMGs/player_1_finger_cursor_dark_theme.png";
import player_1_finger_snap_dark_theme from "./IMGs/player_1_finger_snap_dark_theme.png";
import player_1_finger_crown_dark_theme from "./IMGs/player_1_finger_crown_dark_theme.png";
import player_1_finger_death_dark_theme from "./IMGs/player_1_finger_death_dark_theme.png";
import player_1_finger_love_dark_theme from "./IMGs/player_1_finger_love_dark_theme.png";

import player_2_finger_cursor_dark_theme from "./IMGs/player_2_finger_cursor_dark_theme.png";
import player_2_finger_snap_dark_theme from "./IMGs/player_2_finger_snap_dark_theme.png";
import player_2_finger_crown_dark_theme from "./IMGs/player_2_finger_crown_dark_theme.png";
import player_2_finger_death_dark_theme from "./IMGs/player_2_finger_death_dark_theme.png";
import player_2_finger_love_dark_theme from "./IMGs/player_2_finger_love_dark_theme.png";

import player_1_finger_cursor_light_theme from "./IMGs/player_1_finger_cursor_light_theme.png";
import player_1_finger_snap_light_theme from "./IMGs/player_1_finger_snap_light_theme.png";
import player_1_finger_crown_light_theme from "./IMGs/player_1_finger_crown_light_theme.png";
import player_1_finger_death_light_theme from "./IMGs/player_1_finger_death_light_theme.png";
import player_1_finger_love_light_theme from "./IMGs/player_1_finger_love_light_theme.png";

import player_2_finger_cursor_light_theme from "./IMGs/player_2_finger_cursor_light_theme.png";
import player_2_finger_snap_light_theme from "./IMGs/player_2_finger_snap_light_theme.png";
import player_2_finger_crown_light_theme from "./IMGs/player_2_finger_crown_light_theme.png";
import player_2_finger_death_light_theme from "./IMGs/player_2_finger_death_light_theme.png";
import player_2_finger_love_light_theme from "./IMGs/player_2_finger_love_light_theme.png";

import players_draw_dark_theme from "./IMGs/players_draw_dark_theme.png";
import players_draw_light_theme from "./IMGs/players_draw_light_theme.png";

import { RiPlayLine, RiPauseLine, RiRefreshLine } from "@remixicon/react";
/* IMGs -------------------------------------------------------------------------------------------------- */
const EMPTY_BOARD = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];
/* CONSTs ----------------------------------------------------------------------------------------- CONSTs */
/* { SIZEs } */
const BOX_SIZE = 40;
const CHECKER_SIZE = 24;
const BOARD_BORDER = 12;
/* { TYPEs } */
const CHECKER_TYPES = {
  NONE: 0,
  PLAYER_1: 1,
  PLAYER_2: 2,
};
const PLAYER_TYPES = {
  PLAYER_1: 1,
  PLAYER_2: 2,
};
const GAME_STATUS = {
  DRAW: 0,
  PLAYER_1_WIN: 1,
  PLAYER_2_WIN: 2,
  IN_PROGRESS: 3,
  PAUSE: 4,
};
const DARK_THEME = GLOABL_COLOR_MANAGER().DARK_THEME;
const LIGHT_THEME = GLOABL_COLOR_MANAGER().LIGHT_THEME;
/* { ICONs } */
const PLAYER_CURSORs = {
  0: invisible,
  1: player_1_finger_cursor_dark_theme,
  2: player_2_finger_cursor_dark_theme,
  3: player_1_finger_snap_dark_theme,
  4: player_2_finger_snap_dark_theme,
  5: player_1_finger_crown_dark_theme,
  6: player_2_finger_crown_dark_theme,
  7: player_1_finger_death_dark_theme,
  8: player_2_finger_death_dark_theme,
  9: player_1_finger_love_dark_theme,
  10: player_2_finger_love_dark_theme,

  11: player_1_finger_cursor_light_theme,
  12: player_2_finger_cursor_light_theme,
  13: player_1_finger_snap_light_theme,
  14: player_2_finger_snap_light_theme,
  15: player_1_finger_crown_light_theme,
  16: player_2_finger_crown_light_theme,
  17: player_1_finger_death_light_theme,
  18: player_2_finger_death_light_theme,
  19: player_1_finger_love_light_theme,
  20: player_2_finger_love_light_theme,

  21: players_draw_dark_theme,
  22: players_draw_light_theme,
};
/* CONST ------------------------------------------------------------------------------------------------- */

/* FETCH =========================================================================================== FETCH */
const requestMovement = async (board, playerType, agentType, inarow) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/request_agent_movement",
      {
        board: board.map((row) =>
          row.map((cell) => (cell === 1 ? 1 : cell === 2 ? 2 : 0))
        ),
        player: playerType,
        agent: String(agentType),

        inarow: inarow,
      }
    );
    return response.data.column;
  } catch (error) {
    console.error("Error fetching the move from the backend:", error);
    return null;
  }
};
const checkStateStatus = async (board, playerType, inarow, lastChecker) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/check_state_status",
      {
        board: board.map((row) =>
          row.map((cell) => (cell === 1 ? 1 : cell === 2 ? 2 : 0))
        ),
        player: playerType,
        inarow: inarow,
        lastChecker: lastChecker,
      }
    );
    return response.data.status;
  } catch (error) {
    console.error("Error fetching the move from the backend:", error);
    return null;
  }
};
const requestTheWinningConnection = async (
  board,
  playerType,
  inarow,
  lastChecker
) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/request_the_winning_connection",
      {
        board: board.map((row) =>
          row.map((cell) => (cell === 1 ? 1 : cell === 2 ? 2 : 0))
        ),
        player: playerType,
        inarow: inarow,
        lastChecker: lastChecker,
      }
    );
    return response.data.inarowCheckerPositions;
  } catch (error) {
    console.error("Error fetching the move from the backend:", error);
    return null;
  }
};
/* FETCH ================================================================================================= */

/* SUB COMPONENTS ------------------------------------------------------------------------- SUB COMPONENTS */
/* { BORAD SUB COMPONETs } */
const BoardBox = ({ X, Y }) => {
  const { underDarkTheme } = useContext(GlobalContexts);

  return (
    <div>
      <img
        src={underDarkTheme ? BOX_DARK : BOX_LIGHT}
        style={{
          position: "absolute",
          top: Y - 1,
          left: X,
          height: BOX_SIZE + 1,
          width: BOX_SIZE + 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
const BoardCells = ({ row, Y }) => {
  return (
    <div style={{ position: "absolute" }}>
      {row.map((box, index) => (
        <BoardBox key={index} X={index * BOX_SIZE} Y={Y} />
      ))}
    </div>
  );
};
const BoardColumns = () => {
  const { underDarkTheme } = useContext(GlobalContexts);
  const { board } = useContext(ConnectXBoardContexts);
  return (
    <div
      style={{
        position: "absolute",
        border:
          BOARD_BORDER +
          "px solid " +
          (underDarkTheme
            ? DARK_THEME.deep_hidden_forground
            : LIGHT_THEME.deep_hidden_forground),
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        height: BOX_SIZE * board.length - 2,
        width: BOX_SIZE * board[0].length,
      }}
    >
      {board.map((row, index) => (
        <BoardCells key={index} row={row} Y={index * BOX_SIZE} />
      ))}
    </div>
  );
};
/* { CUROSR FINGER } */
const ControllableFingerCursor = ({ playerType }) => {
  const { underDarkTheme } = useContext(GlobalContexts);
  const {
    board,
    boardDimensions,
    currentTurn,
    gameStatus,
    handleDropOnColumn,
  } = useContext(ConnectXBoardContexts);

  const [pointingColumn, setPointingColumn] = useState(board[0].length - 1);
  const [isCursorDown, setIsCursorDown] = useState(false);
  const [top, setTop] = useState(`CALC(50% - ${boardDimensions[1] / 2 + 4}px)`);
  const [transform, setTransform] = useState(
    playerType === PLAYER_TYPES.PLAYER_1
      ? " translate(-35%, -100%)"
      : " translate(-60%, -100%)"
  );
  const [imgSrc, setImgSrc] = useState(
    playerType === PLAYER_TYPES.PLAYER_1
      ? PLAYER_CURSORs[underDarkTheme ? 9 : 19]
      : PLAYER_CURSORs[underDarkTheme ? 10 : 20]
  );

  /* { KEY DOWN LISTENER } */
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        /* { DOWN } */
        case "s":
          setIsCursorDown(true);
          break;
        case "S":
          setIsCursorDown(true);
          break;
        case "ArrowDown":
          setIsCursorDown(true);
          break;
        case "Enter":
          setIsCursorDown(true);
          break;
        case " ":
          setIsCursorDown(true);
          break;
        /* { LEFT } */
        case "a":
          setPointingColumn((prev) => (prev - 1 < 0 ? 0 : prev - 1));
          break;
        case "A":
          setPointingColumn((prev) => (prev - 1 < 0 ? 0 : prev - 1));
          break;
        case "ArrowLeft":
          setPointingColumn((prev) => (prev - 1 < 0 ? 0 : prev - 1));
          break;
        /* { RIGHT } */
        case "d":
          setPointingColumn((prev) =>
            prev + 1 > board[0].length - 1 ? board[0].length - 1 : prev + 1
          );
          break;
        case "D":
          setPointingColumn((prev) =>
            prev + 1 > board[0].length - 1 ? board[0].length - 1 : prev + 1
          );
          break;
        case "ArrowRight":
          setPointingColumn((prev) =>
            prev + 1 > board[0].length - 1 ? board[0].length - 1 : prev + 1
          );
          break;
        default:
          break;
      }
    };
    if (playerType === currentTurn) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentTurn]);
  /* { DROP COLUMN WHEN CURSOR DOWN } */
  useEffect(() => {
    if (isCursorDown && playerType === currentTurn) {
      handleDropOnColumn(pointingColumn, playerType);
    }
    setTimeout(() => {
      setIsCursorDown(false);
    }, 256);
  }, [isCursorDown]);
  /* { STYLING } */
  useEffect(() => {
    /* { TOP } */
    if (playerType === gameStatus) {
      setTimeout(() => {
        setTop(`CALC(50% - ${boardDimensions[1] / 2 + BOX_SIZE * 2.4}px)`);
      }, 128);
    } else if (playerType !== currentTurn) {
      setTimeout(() => {
        setTop(`CALC(50% - ${boardDimensions[1] / 2 + BOX_SIZE * 1.2}px)`);
      }, 128);
    } else if (isCursorDown) {
      setTop(`CALC(50% - ${boardDimensions[1] / 2 - 10}px)`);
    } else {
      setTop(`CALC(50% - ${boardDimensions[1] / 2 + 4}px)`);
    }
    /* { TRANSFORM } */
    if (playerType === PLAYER_TYPES.PLAYER_1) {
      setTransform(` translate(-35%, -100%)`);
    } else {
      setTransform(` translate(-60%, -100%)`);
    }
    /* { IMG } */
    if (gameStatus !== GAME_STATUS.IN_PROGRESS) {
      if (playerType === gameStatus) {
        setImgSrc(
          PLAYER_CURSORs[underDarkTheme ? playerType + 4 : playerType + 14]
        );
      } else if (3 - playerType === gameStatus) {
        setTimeout(() => {
          setImgSrc(
            PLAYER_CURSORs[underDarkTheme ? playerType + 6 : playerType + 16]
          );
        }, 320);
      } else if (gameStatus === GAME_STATUS.DRAW) {
        if (playerType === PLAYER_TYPES.PLAYER_1) {
          setImgSrc(PLAYER_CURSORs[underDarkTheme ? 21 : 22]);
        } else {
          setImgSrc(PLAYER_CURSORs[0]);
        }
      }
    } else if (playerType === currentTurn) {
      setImgSrc(PLAYER_CURSORs[underDarkTheme ? playerType : playerType + 10]);
    } else {
      setImgSrc(
        PLAYER_CURSORs[underDarkTheme ? playerType + 2 : playerType + 12]
      );
    }
  }, [
    isCursorDown,
    boardDimensions,
    currentTurn,
    pointingColumn,
    underDarkTheme,
  ]);

  return (
    <div>
      <img
        src={imgSrc}
        style={{
          position: "absolute",
          transition: "left 0.12s ease, top 0.08s ease, opacity 0.16s ease",
          transform: transform,
          top: top,
          left: `CALC(50% - ${
            boardDimensions[0] / 2 -
            (BOARD_BORDER + (1 / 2) * BOX_SIZE) -
            pointingColumn * BOX_SIZE
          }px)`,
          height: BOX_SIZE,
          width: BOX_SIZE,
          userSelect: "none",
          pointerEvents: "none",
          border: "0px solid #FF0000",
          outline: "none",
        }}
      />
    </div>
  );
};
const UncontrollableFingerCursor = ({ playerType }) => {
  const { underDarkTheme, agent1Type, agent2Type } = useContext(GlobalContexts);
  const {
    board,
    inarow,
    boardDimensions,
    currentTurn,
    gameStatus,
    handleDropOnColumn,
    checkColumnAvailability,
  } = useContext(ConnectXBoardContexts);

  const [pointingColumn, setPointingColumn] = useState(0);
  const [isCursorDown, setIsCursorDown] = useState(false);
  const [top, setTop] = useState(`CALC(50% - ${boardDimensions[1] / 2 + 4}px)`);
  const [left, setLeft] = useState(
    `CALC(50% - ${
      boardDimensions[0] / 2 -
      (BOARD_BORDER + (1 / 2) * BOX_SIZE) -
      pointingColumn * BOX_SIZE
    }px)`
  );
  const [transform, setTransform] = useState(
    playerType === PLAYER_TYPES.PLAYER_1
      ? ` translate(-35%, -100%)`
      : ` translate(-60%, -100%)`
  );
  const [imgSrc, setImgSrc] = useState(
    playerType === PLAYER_TYPES.PLAYER_1
      ? PLAYER_CURSORs[underDarkTheme ? 9 : 19]
      : PLAYER_CURSORs[underDarkTheme ? 10 : 20]
  );

  /* { REQUEST MOVEMENT WHEN SELF TURN } */
  useEffect(() => {
    if (playerType === currentTurn && gameStatus === GAME_STATUS.IN_PROGRESS) {
      const interval = setInterval(() => {
        setPointingColumn((prev) =>
          prev + 1 > board[0].length - 1 ? 0 : prev + 1
        );
      }, 256);
      const requestAgentMovement = async () => {
        let agentPointingColumn = -1;
        const agentType =
          playerType === PLAYER_TYPES.PLAYER_1 ? agent1Type : agent2Type;

        while (!checkColumnAvailability(agentPointingColumn)) {
          agentPointingColumn = await requestMovement(
            board,
            playerType,
            agentType,
            inarow
          );
        }
        setPointingColumn(agentPointingColumn);
        setIsCursorDown(true);
      };
      const timeout = setTimeout(() => {
        requestAgentMovement();
      }, 2048);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [currentTurn, gameStatus, agent1Type, agent2Type]);
  /* { DROP COLUMN WHEN CURSOR DOWN } */
  useEffect(() => {
    if (isCursorDown && gameStatus === GAME_STATUS.IN_PROGRESS) {
      handleDropOnColumn(pointingColumn, playerType);
      setTimeout(() => {
        setIsCursorDown(false);
      }, 256);
    }
    setTimeout(() => {
      setIsCursorDown(false);
    }, 256);
  }, [isCursorDown]);
  /* { STYLING } */
  useEffect(() => {
    /* { TOP } */
    if (playerType === gameStatus) {
      setTimeout(() => {
        setTop(`CALC(50% - ${boardDimensions[1] / 2 + BOX_SIZE * 2.4}px)`);
      }, 128);
    } else if (playerType !== currentTurn) {
      setTimeout(() => {
        setTop(`CALC(50% - ${boardDimensions[1] / 2 + BOX_SIZE * 1.2}px)`);
      }, 128);
    } else if (isCursorDown) {
      setTop(`CALC(50% - ${boardDimensions[1] / 2 - 10}px)`);
    } else {
      setTop(`CALC(50% - ${boardDimensions[1] / 2 + 4}px)`);
    }
    /* { LEFT } */
    if (gameStatus === GAME_STATUS.IN_PROGRESS) {
      setLeft(
        `CALC(50% - ${
          boardDimensions[0] / 2 -
          (BOARD_BORDER + (1 / 2) * BOX_SIZE) -
          pointingColumn * BOX_SIZE
        }px)`
      );
    }
    /* { TRANSFORM } */
    if (playerType === PLAYER_TYPES.PLAYER_1) {
      setTransform(` translate(-35%, -100%)`);
    } else {
      setTransform(` translate(-60%, -100%)`);
    }
    /* { IMG } */
    if (gameStatus !== GAME_STATUS.IN_PROGRESS) {
      if (playerType === gameStatus) {
        setImgSrc(
          PLAYER_CURSORs[underDarkTheme ? playerType + 4 : playerType + 14]
        );
      } else if (3 - playerType === gameStatus) {
        setTimeout(() => {
          setImgSrc(
            PLAYER_CURSORs[underDarkTheme ? playerType + 6 : playerType + 16]
          );
        }, 320);
      } else if (gameStatus === GAME_STATUS.DRAW) {
        if (playerType === PLAYER_TYPES.PLAYER_1) {
          setImgSrc(PLAYER_CURSORs[underDarkTheme ? 21 : 22]);
        } else {
          setImgSrc(PLAYER_CURSORs[0]);
        }
      } else {
        setImgSrc(
          playerType === PLAYER_TYPES.PLAYER_1
            ? PLAYER_CURSORs[underDarkTheme ? 9 : 19]
            : PLAYER_CURSORs[underDarkTheme ? 10 : 20]
        );
      }
    } else if (playerType === currentTurn) {
      setImgSrc(PLAYER_CURSORs[underDarkTheme ? playerType : playerType + 10]);
    } else {
      setImgSrc(
        PLAYER_CURSORs[underDarkTheme ? playerType + 2 : playerType + 12]
      );
    }
  }, [
    isCursorDown,
    boardDimensions,
    currentTurn,
    pointingColumn,
    underDarkTheme,
  ]);

  return (
    <div>
      <img
        src={imgSrc}
        style={{
          position: "absolute",
          transition:
            "left 0.12s ease, top 0.32s cubic-bezier(0.72, -0.16, 0.2, 1.16)",
          transform: transform,
          top: top,
          left: left,
          height: BOX_SIZE,
          width: BOX_SIZE,
          userSelect: "none",
          pointerEvents: "none",
          outline: "none",
        }}
      />
    </div>
  );
};
/* { CHECKER SUB COMPONENTs } */
const Checker = ({ checkerType, X, Y, row, col }) => {
  const { underDarkTheme } = useContext(GlobalContexts);
  const { boardDimensions, lastChecker, winningConnection } = useContext(
    ConnectXBoardContexts
  );
  const [checkerTop, setCheckerTop] = useState(
    `CALC(50% - ${boardDimensions[1] / 2}px)`
  );
  const [checkerColor, setCheckerColor] = useState(
    underDarkTheme ? DARK_THEME.player_1_checker : LIGHT_THEME.player_1_checker
  );
  const [checkerBorder, setCheckerBorder] = useState(null);
  useEffect(() => {
    switch (checkerType) {
      case CHECKER_TYPES.PLAYER_1:
        setCheckerColor(
          underDarkTheme
            ? DARK_THEME.player_1_checker
            : LIGHT_THEME.player_1_checker
        );
        break;
      case CHECKER_TYPES.PLAYER_2:
        setCheckerColor(
          underDarkTheme
            ? DARK_THEME.player_2_checker
            : LIGHT_THEME.player_2_checker
        );
        break;
      default:
        break;
    }
  }, [checkerType, underDarkTheme]);
  useEffect(() => {
    setTimeout(() => {
      setCheckerTop(X);
    }, 64);
  }, [X]);
  useEffect(() => {
    const checkPositionInWinningConnection = (row, col, winningConnection) => {
      for (const [rowIndex, colIndex] of winningConnection) {
        if (row === rowIndex && col === colIndex) {
          return true;
        }
      }
      return false;
    };
    if (lastChecker !== null) {
      if (lastChecker.row === row && lastChecker.column === col) {
        setCheckerBorder(
          `3px solid ${
            underDarkTheme
              ? DARK_THEME.highlight_forground
              : LIGHT_THEME.highlight_forground
          }`
        );
      } else if (
        checkPositionInWinningConnection(row, col, winningConnection)
      ) {
        setCheckerBorder(
          `3px solid ${
            underDarkTheme
              ? DARK_THEME.highlight_forground
              : LIGHT_THEME.highlight_forground
          }`
        );
      } else {
        setCheckerBorder(null);
      }
    }
  }, [lastChecker, underDarkTheme, winningConnection]);

  return (
    <div
      style={{
        position: "absolute",
        top: checkerTop,
        left: Y,
        height: CHECKER_SIZE,
        width: CHECKER_SIZE,
        transform: "translate(-48%, -48%)",
        backgroundColor: checkerColor,
        borderRadius: "50%",
        border: checkerBorder,
        userSelect: "none",
        pointerEvents: "none",
        transition: "top 0.64s cubic-bezier(0.96, -0.16, 0.2, 1.16)",
      }}
    ></div>
  );
};
const CheckersMap = () => {
  const { board, boardDimensions } = useContext(ConnectXBoardContexts);
  return (
    <div>
      {board.map((row, rowIndex) =>
        row.map((box, colIndex) =>
          box !== CHECKER_TYPES.NONE ? (
            <Checker
              key={rowIndex + colIndex}
              checkerType={box}
              X={`CALC(50% - ${
                boardDimensions[1] / 2 -
                (BOARD_BORDER + (1 / 2) * BOX_SIZE) -
                rowIndex * BOX_SIZE
              }px)`}
              Y={`CALC(50% - ${
                boardDimensions[0] / 2 -
                (BOARD_BORDER + (1 / 2) * BOX_SIZE) -
                colIndex * BOX_SIZE
              }px)`}
              row={rowIndex}
              col={colIndex}
            />
          ) : null
        )
      )}
    </div>
  );
};
/* { PLAY AND PAUSE BUTTON } */
const PlayAndPauseButton = () => {
  const { underDarkTheme } = useContext(GlobalContexts);
  const { boardDimensions, gameStatus, setGameStatus, clearBoard } = useContext(
    ConnectXBoardContexts
  );
  const handlePlayAndPause = () => {
    if (gameStatus === GAME_STATUS.IN_PROGRESS) {
      setGameStatus(GAME_STATUS.PAUSE);
    } else if (gameStatus === GAME_STATUS.PAUSE) {
      setGameStatus(GAME_STATUS.IN_PROGRESS);
    } else {
      clearBoard();
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: `CALC(50% + ${boardDimensions[1] / 2 + 24}px)`,
        left: "50%",
        transform: "translate(-50%, 0%)",
      }}
    >
      {gameStatus !== GAME_STATUS.IN_PROGRESS ? (
        <RiPlayLine
          style={{
            color: underDarkTheme
              ? DARK_THEME.hidden_forground
              : LIGHT_THEME.hidden_forground,
          }}
          onClick={handlePlayAndPause}
        />
      ) : (
        <RiPauseLine
          style={{
            color: underDarkTheme
              ? DARK_THEME.hidden_forground
              : LIGHT_THEME.hidden_forground,
          }}
          onClick={handlePlayAndPause}
        />
      )}
    </div>
  );
};
/* { REFRESH BUTTON } */
const RefreshButton = () => {
  const { underDarkTheme } = useContext(GlobalContexts);
  const { boardDimensions, clearBoard } = useContext(ConnectXBoardContexts);

  return (
    <div
      style={{
        position: "absolute",
        top: `CALC(50% + ${boardDimensions[1] / 2 + 24}px)`,
        left: "50%",
        transform: "translate(-50%, 0%)",
      }}
    >
      <RiRefreshLine
        style={{
          color: underDarkTheme
            ? DARK_THEME.hidden_forground
            : LIGHT_THEME.hidden_forground,
        }}
        onClick={clearBoard}
      />
    </div>
  );
};

/* SUB COMPONENTS ---------------------------------------------------------------------------------------- */

const ConnectXBoard = () => {
  const { onPage, agent1Type, agent2Type } = useContext(GlobalContexts);

  const [board, setBoard] = useState(EMPTY_BOARD);
  const [inarow, setInarow] = useState(4);
  const [lastChecker, setLastChecker] = useState(null);
  const [boardDimensions, setBoardDimensions] = useState([0, 0]);
  const [currentTurn, setCurrentTurn] = useState(PLAYER_TYPES.PLAYER_1);
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.PAUSE);
  const [winningConnection, setWinningConnection] = useState([]);

  /* { BOARD DIMENSIONS UPDATER } */
  useEffect(() => {
    setBoardDimensions([
      board[0].length * BOX_SIZE + BOARD_BORDER * 2,
      board.length * BOX_SIZE + BOARD_BORDER * 2,
    ]);
  }, [board]);
  /* { CHECK GAME STATUS } */
  useEffect(() => {
    if (lastChecker === null) return;
    const checkGameStatus = async () => {
      const status = await checkStateStatus(
        board,
        currentTurn,
        inarow,
        lastChecker
      );
      switch (status) {
        case GAME_STATUS.DRAW:
          setGameStatus(GAME_STATUS.DRAW);
          setCurrentTurn(0);
          break;
        case GAME_STATUS.PLAYER_1_WIN:
          setGameStatus(GAME_STATUS.PLAYER_1_WIN);
          setCurrentTurn(0);
          break;
        case GAME_STATUS.PLAYER_2_WIN:
          setGameStatus(GAME_STATUS.PLAYER_2_WIN);
          setCurrentTurn(0);
          break;
        case GAME_STATUS.IN_PROGRESS:
          break;
        default:
          break;
      }
    };
    checkGameStatus();
  }, [currentTurn]);
  useEffect(() => {
    if (
      gameStatus === GAME_STATUS.PLAYER_1_WIN ||
      gameStatus === GAME_STATUS.PLAYER_2_WIN
    ) {
      const fetchWinningConnection = async () => {
        const inarowCheckerPositions = await requestTheWinningConnection(
          board,
          gameStatus,
          inarow,
          lastChecker
        );
        setWinningConnection(inarowCheckerPositions);
      };
      fetchWinningConnection();
    }
  }, [gameStatus]);
  /* { RESUME GAME WHEN HUMAN PLAYER } */
  useEffect(() => {
    if (
      (agent1Type === "HUMAN" || agent2Type === "HUMAN") &&
      gameStatus === GAME_STATUS.PAUSE
    ) {
      setGameStatus(GAME_STATUS.IN_PROGRESS);
    }
  }, [agent1Type, agent2Type]);
  /* { DROP CHECKERs } */
  const checkColumnAvailability = (columnIndex) => {
    return board[0][columnIndex] === 0;
  };
  const handleDropOnColumn = (columnIndex, checkerType) => {
    for (let row = board.length - 1; row >= 0; row--) {
      if (board[row][columnIndex] === 0) {
        const newBoard = board.map((currentRow, index) => {
          if (index === row) {
            const newRow = [...currentRow];
            newRow[columnIndex] = checkerType;
            return newRow;
          }
          return currentRow;
        });
        if (gameStatus === GAME_STATUS.IN_PROGRESS) {
          setBoard(newBoard);
          setCurrentTurn(3 - currentTurn);
          setLastChecker({ row, column: columnIndex });
        }
        break;
      }
    }
  };
  /* { INITIALIZE BOARD } */
  const initializeBoard = (cols, rows, inarow, human_inolved) => {
    setGameStatus(GAME_STATUS.PAUSE);
    let new_board = new Array(rows);
    for (let i = 0; i < rows; i++) {
      let empty_column = new Array(cols);
      for (let j = 0; j < cols; j++) {
        empty_column[j] = 0;
      }
      new_board[i] = empty_column;
    }
    setBoard(new_board);
    setInarow(inarow);
    setWinningConnection([]);
    setCurrentTurn(PLAYER_TYPES.PLAYER_1);
    if (human_inolved) {
      setGameStatus(GAME_STATUS.IN_PROGRESS);
    }
  };
  /* { CLEAR BOARD } */
  const clearBoard = () => {
    let empty_board = new Array(board.length);
    for (let i = 0; i < board.length; i++) {
      let empty_column = new Array(board[0].length);
      for (let j = 0; j < board[0].length; j++) {
        empty_column[j] = 0;
      }
      empty_board[i] = empty_column;
    }
    setBoard(empty_board);
    setWinningConnection([]);
    setCurrentTurn(PLAYER_TYPES.PLAYER_1);
    setGameStatus(GAME_STATUS.IN_PROGRESS);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: onPage === "GAME" ? "50%" : "-50%",
        left: "50%",
        height: "100vh",
        width: "100vw",
        transform: "translate(-50%, -50%)",
        overflow: "hidden",
        transition: "top 0.72s cubic-bezier(0.64, -0.16, 0.2, 1.16)",
      }}
    >
      <ConnectXBoardContexts.Provider
        value={{
          board,
          setBoard,
          inarow,
          setInarow,
          lastChecker,
          setLastChecker,
          boardDimensions,
          setBoardDimensions,
          currentTurn,
          gameStatus,
          setGameStatus,
          setCurrentTurn,
          handleDropOnColumn,
          checkColumnAvailability,
          clearBoard,
          winningConnection,
          setWinningConnection,
        }}
      >
        <CheckersMap />
        <BoardColumns />
        {agent2Type !== "HUMAN" ? (
          <UncontrollableFingerCursor playerType={PLAYER_TYPES.PLAYER_2} />
        ) : (
          <ControllableFingerCursor playerType={PLAYER_TYPES.PLAYER_2} />
        )}
        {agent1Type !== "HUMAN" ? (
          <UncontrollableFingerCursor playerType={PLAYER_TYPES.PLAYER_1} />
        ) : (
          <ControllableFingerCursor playerType={PLAYER_TYPES.PLAYER_1} />
        )}
        {agent1Type === "HUMAN" || agent2Type === "HUMAN" ? (
          <RefreshButton />
        ) : (
          <PlayAndPauseButton />
        )}
      </ConnectXBoardContexts.Provider>
    </div>
  );
};

export default ConnectXBoard;
