import { createContext, useState, useContext, useEffect } from "react";
import React from "react";
import "./OfflinePlayerPage";
import popSound from "./assets/QKTA234-pop.mp3";
import "./MultiPlayerBoard.css";
import "./OnlinePlayerPage";
import OnlinePlayerPage from "./OnlinePlayerPage";
import io from "socket.io-client";

const GameContext = createContext();

export default function MultiPlayerBoard({
  name,
  opponentName,
  selfTurn,
  opponentTurn,
  roomName,
  socket,
  opponentResponse
}) {
  const [reset, setReset] = useState(false);
  const [turn, setTurn] = useState(selfTurn);
  const [awaitPlayerResponse, setAwaitPlayerResponse] = useState(false);
  
  return (
    <GameContext.Provider
      value={{
        turn,
        setTurn,
        reset,
        setReset,
        socket,
        roomName,
        opponentResponse,
      }}
    >
      <div className="multiPlayerWindowWrapper">
        <div className="playerInfo">
          <a className="playerTurn">{opponentTurn} - </a>
          <a className="playerName">{opponentName}</a>
        </div>
        <div className="boardWrapperMultiPlayer">
          <div className="board">
            <div className="board-row">
              <Square pos={1} />
              <Square pos={2} />
              <Square pos={3} />
            </div>
            <div className="board-row">
              <Square pos={4} />
              <Square pos={5} />
              <Square pos={6} />
            </div>
            <div className="board-row">
              <Square pos={7} />
              <Square pos={8} />
              <Square pos={9} />
            </div>
          </div>
          <div className="turnIndicator">{turn}</div>
          <ResetButton />
        </div>
        <div className="playerInfo">
          <a className="playerTurn"> {selfTurn} - </a>
          <a className="playerName">{name}</a>
        </div>
      </div>
    </GameContext.Provider>
  );
}

function Square({ pos }) {
  const { reset, setReset, roomName, turn, socket, opponentResponse} = useContext(GameContext);
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (reset) {
      setValue(null);
    }
  }, [reset]);
  useEffect(() => {
    if(opponentResponse.pos == pos){
      setValue(opponentResponse.turn);
    }
  }, [opponentResponse])

  function handleClick() {
    setReset(false);
    setValue(turn);
    let faceDetails = {
      pos : pos,
      turn : turn,
      roomName : roomName,
    }
    socket.emit("posInput", (faceDetails));
  }

  function playPopSound() {
    const audio = new Audio();
    audio.src = popSound;
    audio.addEventListener("canplaythrough", () => {
      audio.play();
    });
  }

  return (
    <>
      <button className="square" onClick={handleClick}>
        {value}
      </button>
    </>
  );
}

function ResetButton() {
  const { turn, setTurn, reset, setReset } = useContext(GameContext);

  function handleClick() {
    setTurn("X");
    setReset(true);
  }

  return (
    <>
      <button className="resetButton" onClick={handleClick}>
        Reset
      </button>
    </>
  );
}
