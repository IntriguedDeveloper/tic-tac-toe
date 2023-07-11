import React from "react";
import "./Modal.css";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket.js";
export default function Modal({ winTitle, winnerName, roomName }) {
  const navigate = useNavigate();

  function initRematch() {
    socket.emit("initRematch", winnerName, roomName);
  }
  function backToLobby() {
    navigate(-1);
    socket.disconnect();
    socket.emit('backToLobby', winnerName, roomName);
  }
  return (
    <div className="modalContainer">
      <div className="title">{winTitle}</div>
      <div className="buttonContainer">
        <button className="rematch" onClick={initRematch}>Rematch</button>

        <button className="lobby" onClick={backToLobby}>
          Back to Lobby
        </button>
      </div>
    </div>
  );
}
