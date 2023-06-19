import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './OnlinePlayerPage.css';
import { io } from 'socket.io-client';
import MultiPlayerBoard from './MultiplayerBoard';


export default function OnlinePlayerPage() {
    const socket = io("http://localhost:5000");


    const [name, setName] = useState("");
    const [isSubmitted, setSubmitted] = useState(false);
    const [placeholder, setPlaceholder] = useState('Search');
    const [roomCode, setRoomCode] = useState(null);
    const [matchStatus, setMatchStatus] = useState(false);
    const navigate = useNavigate();
    
    //*Initiate Random MatchMaking on onClick Event
    const initiateRandomMatchMaking = () => {
        fetch('http://localhost:5000/onlinePlayerPage/randomMatchMaking', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Initiate Random Matchmaking",
            name: name,
          }),
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
          })
          .catch(error => {
            console.error(error);
          });
      };
      

    //*Join Room with Room Code
    const joinRoom = () => {

    }

    const createRoom = () => {

    }

    //*Send playerName to server
    //*Navigate to playerMatchMaking page on Server Permission
    const playerSubmit = () => {
        let playerInformation = {
            "name": name,
            "matchStatus": matchStatus,
        };

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(playerInformation),
        };
        console.log(JSON.parse(options.body));
        fetch('http://localhost:5000/playerPoolEntry', options)
            .then(response => response.json()
            )
            .then(data => {
                if (data.permission == true) {
                    navigate('./playerMatchMaking');

                }

                else {
                    alert("Player Name already taken");
                }

            })
            .catch(error => {
                console.error(error);
            });


    };



    return (

        <>

            <div className='wrapper'>
                <div className='content'>
                    <h1 style={{ color: 'white', textAlign: 'center', fontFamily: 'Comic Sans MS' }}>TicTacToe</h1>
                    <div className='matchMaking'>
                        <Routes>
                            <Route path="/" element={
                                <>
                                    <input type="text" className='textInput' onChange={(event) => { setName(event.target.value) }} placeholder={placeholder} />
                                    <button className='submit' onClick={playerSubmit}>Play</button>
                                </>
                            } />
                            <Route path="/playerMatchMaking" element={<>
                                <div className='optionContainer'>
                                    <button className='matchMakingRandom' onClick={initiateRandomMatchMaking}>Random</button>

                                    <a style={{ fontSize: "22px", fontFamily: "comic sans ms" }}>Or</a>

                                    <input type="text" className='roomCode' placeholder='Enter Room Code' onChange={setRoomCode} ></input>
                                    <button className='submitCode' onClick={joinRoom}>Go</button>

                                    <a style={{ fontSize: "22px", fontFamily: "comic sans ms" }}>Or</a>

                                    <button className='createRoom' onClick={createRoom}>Create a room</button>

                                </div>
                            </>} />
                            <Route path="/multiPlayerBoard" element = {
                                <MultiPlayerBoard/>
                            }></Route>
                        </Routes>
                    </div>
                </div>
            </div>
        </>

    );
}

