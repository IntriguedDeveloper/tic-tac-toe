import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./OnlinePlayerPage.css";
import io from "socket.io-client";
import MultiPlayerBoard from "./MultiplayerBoard";

export default function OnlinePlayerPage() {
  const socket = io("http://localhost:5000");

  const [name, setName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [selfTurn, setSelfTurn] = useState(null);
  const [opponentTurn, setOpponentTurn] = useState(null);
  const navigate = useNavigate();
  const [nav, doNav] = useState(false);
  const [roomName, setRoomName] = useState();
  const [randomClickCount, setRandomClickCount] = useState(0);
  const [opponentResponse, setOpponentResponse] = useState({});
  useEffect(() => {
    async function onRoomJoined(lobbyArray, emptyRoomName){
      console.log(lobbyArray);
      const [player1, player2] = lobbyArray;
      setRoomName(emptyRoomName);
      console.log("In online player page : " + roomName);
      if (player1.name === name) {
        setOpponentName(player2.name);
        setSelfTurn(player1.turn);
        setOpponentTurn(player2.turn);
      } else {
        setOpponentName(player1.name);
        setSelfTurn(player2.turn);
        setOpponentTurn(player1.turn);
      }
      
      await doNav(true);

      return(() => {
        console.log("Return function ran");
        socket.off('joinedRoom', onRoomJoined);
        
      })
    }
    function onInsufficientPlayers(message){
      console.log("Insufficient Players");
      alert("Insufficient Player Online");
      return(() => {
        console.log("Return function ran");
  
        socket.off('insufficientPlayers', onInsufficientPlayers);
      })
    }
    function onPlayerResponse(res){
      console.log(res);
      setOpponentResponse(res);
    }
    socket.on("joinedRoom", onRoomJoined);  
    socket.on("insufficientPlayers", onInsufficientPlayers);
    socket.on("playerResponse", onPlayerResponse);
    
  }, [socket]);
  useEffect(() => {
    if (nav) {
      doNav(false);
      navigate("./multiPlayerBoard");
      
    }
  }, [nav, doNav]);

  //*Initiate Random MatchMaking on onClick Event
  const initiateRandomMatchMaking = async () => {
    setRandomClickCount(randomClickCount + 1);
    socket.emit("emit", name);
  };

  //*Join Room with Room Code
  const joinRoom = () => {};

  const createRoom = () => {};

  //*Send playerName to server
  //*Navigate to playerMatchMaking page on Server Permission
  const playerSubmit = () => {
    console.log(name);
    if (name.length <= 20) {
      let playerInformation = {
        name: name,
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerInformation),
      };
      console.log(JSON.parse(options.body));
      fetch("http://localhost:5000/playerPoolEntry", options)
        .then((response) => response.json())
        .then((data) => {
          if (data.permission == true) {
            navigate("./playerMatchMaking");
          } else {
            alert("Player Name already taken");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log("Maximum name length exceeded");
      alert("Max Name length exceeded");
    }
  };

  return (
    <>
      <div className="wrapper">
        <div className="content">
          <h1
            style={{
              color: "white",
              textAlign: "center",
              fontFamily: "Comic Sans MS",
            }}
          >
            TicTacToe
          </h1>
          <div className="matchMaking">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <div className="playerNameValue">
                      <input
                        type="text"
                        className="textInput"
                        onChange={(event) => {
                          setName(event.target.value);
                        }}
                        placeholder="Enter your Name"
                      />
                      <button className="submit" onClick={playerSubmit}>
                        Play
                      </button>
                    </div>
                  </>
                }
              />
              <Route
                path="/playerMatchMaking"
                element={
                  <>
                    <div className="optionContainer">
                      <button
                        className="matchMakingRandom"
                        onClick={initiateRandomMatchMaking}
                      >
                        Random
                      </button>

                      <a
                        style={{
                          fontSize: "22px",
                          fontFamily: "comic sans ms",
                        }}
                      >
                        Or
                      </a>

                      <input
                        type="text"
                        className="roomCode"
                        placeholder="Enter Room Code"
                      ></input>
                      <button className="submitCode" onClick={joinRoom}>
                        Go
                      </button>

                      <a
                        style={{
                          fontSize: "22px",
                          fontFamily: "comic sans ms",
                        }}
                      >
                        Or
                      </a>

                      <button className="createRoom" onClick={createRoom}>
                        Create a room
                      </button>
                    </div>
                  </>
                }
              />
              <Route
                path="/multiPlayerBoard"
                element={
                  <MultiPlayerBoard
                    name={name}
                    opponentName={opponentName}
                    selfTurn={selfTurn}
                    opponentTurn={opponentTurn}
                    socket={socket}
                    roomName={roomName}
                    opponentResponse = {opponentResponse}
                  />
                }
              ></Route>
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}
