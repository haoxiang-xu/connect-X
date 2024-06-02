import React, { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";

import { GlobalContexts } from "../../CONTEXTs/GlobalContexts";
import { ConnectXBoardContexts } from "../../CONTEXTs/ConnectXBoardContexts";
/* IMGs ---------------------------------------------------------------------------------------------- IMG */
import BOX_DARK from "./IMGs/board_box_dark_theme.svg";
import BOX_LIGHT from "./IMGs/board_box_light_theme.svg";

import player_1_finger_cursor_dark_theme from "./IMGs/player_1_finger_cursor_dark_theme.png";
import player_1_finger_snap_dark_theme from "./IMGs/player_1_finger_snap_dark_theme.png";
import player_1_finger_crown_dark_theme from "./IMGs/player_1_finger_crown_dark_theme.png";
import player_1_finger_death_dark_theme from "./IMGs/player_1_finger_death_dark_theme.png";

import player_2_finger_cursor_dark_theme from "./IMGs/player_2_finger_cursor_dark_theme.png";
import player_2_finger_snap_dark_theme from "./IMGs/player_2_finger_snap_dark_theme.png";
import player_2_finger_crown_dark_theme from "./IMGs/player_2_finger_crown_dark_theme.png";
import player_2_finger_death_dark_theme from "./IMGs/player_2_finger_death_dark_theme.png";
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
  PLAYER_1_PENDING: 3,
  PLAYER_2_PENDING: 4,
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
};
const CHECKER_COLORS = {
  PLAYER_1: "#8C8C8C",
  PLAYER_2: "#494949",
};
/* { ICONs } */
const PLAYER_CURSORs = {
  1: player_1_finger_cursor_dark_theme,
  2: player_2_finger_cursor_dark_theme,
  3: player_1_finger_snap_dark_theme,
  4: player_2_finger_snap_dark_theme,
  5: player_1_finger_crown_dark_theme,
  6: player_2_finger_crown_dark_theme,
  7: player_1_finger_death_dark_theme,
  8: player_2_finger_death_dark_theme,
};
/* CONST ------------------------------------------------------------------------------------------------- */

/* FETCH =========================================================================================== FETCH */
const requestMovement = async (board, playerType, inarow) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/request_agent_movement",
      {
        board: board.map((row) =>
          row.map((cell) => (cell === 1 ? 1 : cell === 2 ? 2 : 0))
        ),
        player: playerType,
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
          BOARD_BORDER + "px solid " + (underDarkTheme ? "#1E1E1E" : "#D9D9D9"),
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
  const {
    board,
    boardDimensions,
    currentTurn,
    gameStatus,
    handleDropOnColumn,
  } = useContext(ConnectXBoardContexts);

  const [pointingColumn, setPointingColumn] = useState(board[0].length - 1);
  const [isCursorDown, setIsCursorDown] = useState(false);
  const [top, setTop] = useState(null);
  const [transform, setTransform] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);

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
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  /* { DROP COLUMN WHEN CURSOR DOWN } */
  useEffect(() => {
    if (isCursorDown && playerType === currentTurn) {
      handleDropOnColumn(pointingColumn, CHECKER_TYPES.PLAYER_1);
    }
    setTimeout(() => {
      setIsCursorDown(false);
    }, 64);
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
      if (playerType === currentTurn) {
        setTransform(` translate(-35%, -100%) scaleX(1)`);
      } else {
        setTransform(` translate(-35%, -100%) scaleX(-1)`);
      }
    } else {
      if (playerType === currentTurn) {
        setTransform(` translate(-60%, -100%) scaleX(-1)`);
      } else {
        setTransform(` translate(-60%, -100%) scaleX(1)`);
      }
    }
    /* { IMG } */
    if (gameStatus !== GAME_STATUS.IN_PROGRESS) {
      if (playerType === gameStatus) {
        setImgSrc(PLAYER_CURSORs[playerType + 4]);
      } else if (3 - playerType === gameStatus) {
        setImgSrc(PLAYER_CURSORs[playerType + 6]);
      }
    } else if (playerType === currentTurn) {
      setImgSrc(PLAYER_CURSORs[playerType]);
    } else {
      setImgSrc(PLAYER_CURSORs[playerType + 2]);
    }
  }, [isCursorDown, boardDimensions, currentTurn]);

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
        }}
      />
    </div>
  );
};
const UncontrollableFingerCursor = ({ playerType }) => {
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
  const [top, setTop] = useState(null);
  const [transform, setTransform] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    if (playerType === currentTurn) {
      const interval = setInterval(() => {
        setPointingColumn((prev) =>
          prev + 1 > board[0].length - 1 ? 0 : prev + 1
        );
      }, 256);
      const requestAgentMovement = async () => {
        let agentPointingColumn = -1;
        while (!checkColumnAvailability(agentPointingColumn)) {
          agentPointingColumn = await requestMovement(
            board,
            PLAYER_TYPES.PLAYER_2,
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
  }, [currentTurn]);
  useEffect(() => {
    if (isCursorDown) {
      handleDropOnColumn(pointingColumn, playerType);
      setTimeout(() => {
        setIsCursorDown(false);
      }, 128);
    }
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
      if (playerType === currentTurn) {
        setTransform(` translate(-35%, -100%) scaleX(1)`);
      } else {
        setTransform(` translate(-35%, -100%) scaleX(-1)`);
      }
    } else {
      if (playerType === currentTurn) {
        setTransform(` translate(-60%, -100%) scaleX(-1)`);
      } else {
        setTransform(` translate(-60%, -100%) scaleX(1)`);
      }
    }
    /* { IMG } */
    if (gameStatus !== GAME_STATUS.IN_PROGRESS) {
      if (playerType === gameStatus) {
        setImgSrc(PLAYER_CURSORs[playerType + 4]);
      } else if (3 - playerType === gameStatus) {
        setImgSrc(PLAYER_CURSORs[playerType + 6]);
      }
    } else if (playerType === currentTurn) {
      setImgSrc(PLAYER_CURSORs[playerType]);
    } else {
      setImgSrc(PLAYER_CURSORs[playerType + 2]);
    }
  }, [isCursorDown, boardDimensions, currentTurn]);

  return (
    <div>
      <img
        src={imgSrc}
        style={{
          position: "absolute",
          transition: "left 0.12s ease, top 0.08s ease",
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
        }}
      />
    </div>
  );
};
/* { CHECKER SUB COMPONENTs } */
const Checker = ({ checkerType, X, Y }) => {
  const [checkerColor, setCheckerColor] = useState(CHECKER_COLORS.PLAYER_1);
  useEffect(() => {
    switch (checkerType) {
      case CHECKER_TYPES.PLAYER_1:
        setCheckerColor(CHECKER_COLORS.PLAYER_1);
        break;
      case CHECKER_TYPES.PLAYER_2:
        setCheckerColor(CHECKER_COLORS.PLAYER_2);
        break;
      default:
        break;
    }
  }, [checkerType]);

  return (
    <div
      style={{
        position: "absolute",
        top: X,
        left: Y,
        height: CHECKER_SIZE,
        width: CHECKER_SIZE,
        transform: "translate(-48%, -48%)",
        backgroundColor: checkerColor,
        borderRadius: "50%",
        userSelect: "none",
        pointerEvents: "none",
      }}
    ></div>
  );
};
const CheckersMap = () => {
  const { board, boardDimensions } = useContext(ConnectXBoardContexts);
  return (
    <div>
      {board.map((row, rowIndex) =>
        row.map((box, boxIndex) =>
          box !== CHECKER_TYPES.NONE ? (
            <Checker
              key={rowIndex + boxIndex}
              checkerType={box}
              X={`CALC(50% - ${
                boardDimensions[1] / 2 -
                (BOARD_BORDER + (1 / 2) * BOX_SIZE) -
                rowIndex * BOX_SIZE
              }px)`}
              Y={`CALC(50% - ${
                boardDimensions[0] / 2 -
                (BOARD_BORDER + (1 / 2) * BOX_SIZE) -
                boxIndex * BOX_SIZE
              }px)`}
            />
          ) : null
        )
      )}
    </div>
  );
};
/* SUB COMPONENTS ---------------------------------------------------------------------------------------- */

const ConnectXBoard = () => {
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [inarow, setInarow] = useState(4);
  const [lastChecker, setLastChecker] = useState(null);
  const [boardDimensions, setBoardDimensions] = useState([0, 0]);
  const [currentTurn, setCurrentTurn] = useState(PLAYER_TYPES.PLAYER_1);
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.IN_PROGRESS);

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
        setBoard(newBoard);
        setCurrentTurn((prev) =>
          prev === PLAYER_TYPES.PLAYER_1
            ? PLAYER_TYPES.PLAYER_2
            : PLAYER_TYPES.PLAYER_1
        );
        setLastChecker({ row, column: columnIndex });
        break;
      }
    }
  };

  return (
    <div>
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
        }}
      >
        <BoardColumns />
        <CheckersMap />
        <UncontrollableFingerCursor playerType={PLAYER_TYPES.PLAYER_2} />
        <UncontrollableFingerCursor playerType={PLAYER_TYPES.PLAYER_1} />
        {/* <ControllableFingerCursor playerType={PLAYER_TYPES.PLAYER_1} /> */}
      </ConnectXBoardContexts.Provider>
    </div>
  );
};

export default ConnectXBoard;
