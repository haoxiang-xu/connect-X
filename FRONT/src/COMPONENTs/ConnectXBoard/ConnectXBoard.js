import React, { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";

import { ConnectXBoardContexts } from "../../CONTEXTs/ConnectXBoardContexts";
/* IMGs ---------------------------------------------------------------------------------------------- IMG */
import BOX_DARK from "./IMGs/board_box_dark_theme.svg";

import player_1_finger_cursor_dark_theme from "./IMGs/player_1_finger_cursor_dark_theme.png";
import player_1_finger_snap_dark_theme from "./IMGs/player_1_finger_snap_dark_theme.png";
import player_2_finger_cursor_dark_theme from "./IMGs/player_2_finger_cursor_dark_theme.png";
import player_2_finger_snap_dark_theme from "./IMGs/player_2_finger_snap_dark_theme.png";
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
};
/* CONST ------------------------------------------------------------------------------------------------- */

/* FETCH =========================================================================================== FETCH */
const requestMovement = async (board, playerType) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/request_agent_movement",
      {
        board: board.map((row) =>
          row.map((cell) => (cell === 1 ? 1 : cell === 2 ? 2 : 0))
        ),
        player: playerType,
      }
    );
    return response.data.column;
  } catch (error) {
    console.error("Error fetching the move from the backend:", error);
    return null;
  }
};
const checkStateStatus = async (board, playerType, lastChecker) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/check_state_status",
      {
        board: board.map((row) =>
          row.map((cell) => (cell === 1 ? 1 : cell === 2 ? 2 : 0))
        ),
        player: playerType,
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
  return (
    <div>
      <img
        src={BOX_DARK}
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
  const { board } = useContext(ConnectXBoardContexts);
  return (
    <div
      style={{
        position: "absolute",
        border: BOARD_BORDER + "px solid #1E1E1E",
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
  const { board, boardDimensions, currentTurn, handleDropOnColumn } =
    useContext(ConnectXBoardContexts);

  const [pointingColumn, setPointingColumn] = useState(board[0].length - 1);
  const [isCursorDown, setIsCursorDown] = useState(false);
  const [top, setTop] = useState(null);
  const [transform, setTransform] = useState(null);

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
    if (playerType !== currentTurn) {
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
  }, [isCursorDown, boardDimensions, currentTurn]);

  return (
    <div>
      <img
        src={
          playerType === currentTurn
            ? PLAYER_CURSORs[playerType]
            : PLAYER_CURSORs[playerType + 2]
        }
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
    boardDimensions,
    currentTurn,
    handleDropOnColumn,
    checkColumnAvailability,
  } = useContext(ConnectXBoardContexts);

  const [pointingColumn, setPointingColumn] = useState(0);
  const [isCursorDown, setIsCursorDown] = useState(false);
  const [top, setTop] = useState(null);
  const [transform, setTransform] = useState(null);

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
            PLAYER_TYPES.PLAYER_2
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
    if (playerType !== currentTurn) {
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
  }, [isCursorDown, boardDimensions, currentTurn]);

  return (
    <div>
      <img
        src={
          playerType === currentTurn
            ? PLAYER_CURSORs[playerType]
            : PLAYER_CURSORs[playerType + 2]
        }
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
  const [boardDimensions, setBoardDimensions] = useState([0, 0]);
  const [currentTurn, setCurrentTurn] = useState(PLAYER_TYPES.PLAYER_1);
  const [lastChecker, setLastChecker] = useState(null);
  const [inarow, setInarow] = useState(0);

  /* { BOARD DIMENSIONS UPDATER } */
  useEffect(() => {
    setBoardDimensions([
      board[0].length * BOX_SIZE + BOARD_BORDER * 2,
      board.length * BOX_SIZE + BOARD_BORDER * 2,
    ]);
  }, [board]);
  /* { CHECK GAME STATUS } */

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
          boardDimensions,
          setBoardDimensions,
          currentTurn,
          setCurrentTurn,
          handleDropOnColumn,
          checkColumnAvailability,
        }}
      >
        <BoardColumns />
        <CheckersMap />
        <UncontrollableFingerCursor playerType={PLAYER_TYPES.PLAYER_2} />
        <ControllableFingerCursor playerType={PLAYER_TYPES.PLAYER_1} />
      </ConnectXBoardContexts.Provider>
    </div>
  );
};

export default ConnectXBoard;
