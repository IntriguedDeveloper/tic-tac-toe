import { createContext, useState, useContext, useEffect } from "react";
import React from "react";
import "./OfflinePlayerPage";
import popSound from "../assets/QKTA234-pop.mp3";
import "./MultiPlayerBoard.css";
import "./OnlinePlayerPage";
import { socket } from "../socket.js";
import { useNavigate, Routes, Route } from "react-router-dom";
import Modal from "./Modal";
const GameContext = createContext();

export default function MultiPlayerBoard({
  name,
  opponentName,
  selfTurn,
  opponentTurn,
  roomName,
  opponentResponse,
}) {
  const [reset, setReset] = useState(false);
  const [turn, setTurn] = useState(selfTurn);
  const [responseStatus, setResponseStatus] = useState(false);
  const [squareClickCounter, setSquareClickCounter] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [winTitle, setWinTitle] = useState("");
  const [winnerName, setWinnerName] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (opponentResponse.turn != turn) {
      setResponseStatus(true);
    }
  }, [opponentResponse]);
  useEffect(() => {
    //console.log("Use effect ran");
    function onWinner(turn) {
      console.log("The turn received is : " + turn);
      console.log("The self turn is : " + selfTurn);
      if (turn == selfTurn) {
        setWinTitle("You've Won");
        setWinnerName(name);
      } else {
        setWinTitle(`${opponentTurn} is the Winner.`);
        setWinnerName(opponentName);
      }
      setOpenModal(true);
    }
    function onRematch(){
      setReset(true);
      setOpenModal(false);
      setSquareClickCounter(0);

    }
    socket.on("winnerDeclared", onWinner);
    socket.on('initRematchClient', onRematch);
    return () => {
      socket.off("winnerDeclared", onWinner);
      socket.off('initRematchClient', onRematch);
    };
  }, [socket]);
  return (
    <GameContext.Provider
      value={{
        turn,
        setTurn,
        reset,
        setReset,
        roomName,
        opponentResponse,
        squareClickCounter,
        setSquareClickCounter,
        responseStatus,
        setResponseStatus,
        openModal,
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
        {openModal && (
          <div className="modalWrapper">
            <Modal
              winTitle={winTitle}
              winnerName={winnerName}
              roomName={roomName}
            />
          </div>
        )}
      </div>
    </GameContext.Provider>
  );
}

function Square({ pos }) {
  const {
    reset,
    setReset,
    roomName,
    turn,
    opponentResponse,
    squareClickCounter,
    setSquareClickCounter,
    responseStatus,
    setResponseStatus,
    openModal,
  } = useContext(GameContext);
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (reset || openModal) {
      setValue(null);
    }
  }, [reset, openModal]);
  useEffect(() => {
    setValue(null);
  }, []);
  useEffect(() => {
    if (opponentResponse.turn != turn) {
      if (opponentResponse.pos == pos) {
        setValue(opponentResponse.turn);
        setSquareClickCounter(squareClickCounter + 1);
      }
    }
  }, [opponentResponse]);
  async function handleClick() {
    setReset(false);
    //console.log("response status is :  " + responseStatus);
    let faceDetails = {
      pos: pos,
      turn: turn,
      roomName: roomName,
    };
    if (value == null) {
      //square is unoccupied
      if (squareClickCounter == 0 && turn == "O") {
        alert("Not your first chance");
      } else if (squareClickCounter == 0 && turn == "X") {
        playPopSound();
        setValue(turn);
        socket.emit("posInput", faceDetails);
        setSquareClickCounter(squareClickCounter + 1);
        setResponseStatus(false);
      } else {
        playPopSound();
        if (responseStatus == true) {
          socket.emit("posInput", faceDetails);
          setValue(turn);
          setResponseStatus(false);
        }
      }
    }
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
