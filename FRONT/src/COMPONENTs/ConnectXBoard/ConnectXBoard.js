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
import player_1_finger_love_dark_theme from "./IMGs/player_1_finger_love_dark_theme.png";

import player_2_finger_cursor_dark_theme from "./IMGs/player_2_finger_cursor_dark_theme.png";
import player_2_finger_snap_dark_theme from "./IMGs/player_2_finger_snap_dark_theme.png";
import player_2_finger_crown_dark_theme from "./IMGs/player_2_finger_crown_dark_theme.png";
import player_2_finger_death_dark_theme from "./IMGs/player_2_finger_death_dark_theme.png";
import player_2_finger_love_dark_theme from "./IMGs/player_2_finger_love_dark_theme.png";

import { RiPlayLine, RiPauseLine } from "@remixicon/react";
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
  PAUSE: 4,
};
const CHECKER_COLORS = {
  PLAYER_1: "#8C8C8C",
  PLAYER_2: "#494949",
};
const AGENT_TYPES = ["HUMAN", "RANDOM", "GREEDY", "MINMAX", "MONTE_CARLO"];
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
  9: player_1_finger_love_dark_theme,
  10: player_2_finger_love_dark_theme,
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
        agent: agentType,
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
  const [top, setTop] = useState(`CALC(50% - ${boardDimensions[1] / 2 + 4}px)`);
  const [transform, setTransform] = useState(
    playerType === PLAYER_TYPES.PLAYER_1
      ? " translate(-35%, -100%)"
      : " translate(-60%, -100%)"
  );
  const [imgSrc, setImgSrc] = useState(
    playerType === PLAYER_TYPES.PLAYER_1
      ? PLAYER_CURSORs[9]
      : PLAYER_CURSORs[10]
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
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  /* { DROP COLUMN WHEN CURSOR DOWN } */
  useEffect(() => {
    if (isCursorDown && playerType === currentTurn) {
      handleDropOnColumn(pointingColumn, playerType);
    }
    setTimeout(() => {
      setIsCursorDown(false);
    }, 128);
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
        setImgSrc(PLAYER_CURSORs[playerType + 4]);
      } else if (3 - playerType === gameStatus) {
        setImgSrc(PLAYER_CURSORs[playerType + 6]);
      }
    } else if (playerType === currentTurn) {
      setImgSrc(PLAYER_CURSORs[playerType]);
    } else {
      setImgSrc(PLAYER_CURSORs[playerType + 2]);
    }
  }, [isCursorDown, boardDimensions, currentTurn, pointingColumn]);

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
  const { agent1Type, agent2Type } = useContext(GlobalContexts);
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
      ? PLAYER_CURSORs[9]
      : PLAYER_CURSORs[10]
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
  }, [currentTurn, gameStatus]);
  /* { DROP COLUMN WHEN CURSOR DOWN } */
  useEffect(() => {
    if (isCursorDown && gameStatus === GAME_STATUS.IN_PROGRESS) {
      handleDropOnColumn(pointingColumn, playerType);
      setTimeout(() => {
        setIsCursorDown(false);
      }, 128);
    }
    setIsCursorDown(false);
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
        setImgSrc(PLAYER_CURSORs[playerType + 4]);
      } else if (3 - playerType === gameStatus) {
        setImgSrc(PLAYER_CURSORs[playerType + 6]);
      }
    } else if (playerType === currentTurn) {
      setImgSrc(PLAYER_CURSORs[playerType]);
    } else {
      setImgSrc(PLAYER_CURSORs[playerType + 2]);
    }
  }, [isCursorDown, boardDimensions, currentTurn, pointingColumn]);

  return (
    <div>
      <img
        src={imgSrc}
        style={{
          position: "absolute",
          transition: "left 0.12s ease, top 0.08s ease",
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
/* { PLAY AND PAUSE BUTTON } */
const PlayAndPauseButton = () => {
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
        <RiPlayLine style={{ color: "#494949" }} onClick={handlePlayAndPause} />
      ) : (
        <RiPauseLine
          style={{ color: "#494949" }}
          onClick={handlePlayAndPause}
        />
      )}
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
        if (gameStatus === GAME_STATUS.IN_PROGRESS) {
          setBoard(newBoard);
          setCurrentTurn(3 - currentTurn);
          setLastChecker({ row, column: columnIndex });
        }
        break;
      }
    }
  };
  /* { CLEAR BOARD } */
  const clearBoard = () => {
    setBoard(EMPTY_BOARD);
    setCurrentTurn(PLAYER_TYPES.PLAYER_1);
    setGameStatus(GAME_STATUS.IN_PROGRESS);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: onPage === "GAME" ? "50%" : "-150%",
        left: "50%",
        height: "100vh",
        width: "100vw",
        transform: "translate(-50%, -50%)",
        overflow: "hidden",
        transition: "0.64s cubic-bezier(0.64, -0.16, 0.2, 1.28)",
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
        }}
      >
        <BoardColumns />
        <CheckersMap />
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
        <PlayAndPauseButton />
      </ConnectXBoardContexts.Provider>
    </div>
  );
};

export default ConnectXBoard;
