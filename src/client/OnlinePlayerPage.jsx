import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './OnlinePlayerPage.css';
import OfflinePlayerPage from './OfflinePlayerPage';
import { io } from 'socket.io-client';

export default function OnlinePlayerPage() {
    const socket = io("http://localhost:5000");


    const [name, setName] = useState("");
    const [isSubmitted, setSubmitted] = useState(false);
    const [placeholder, setPlaceholder] = useState('Search');
    const [queriedName, setQueriedName] = useState('');
    const [matchStatus, setMatchStatus] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        console.log("Query typed")
        socket.emit("playerSearchQuery");
    }, [queriedName]);
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
                                    <button className='matchMakingRandom'>Random</button>
                                    <a style={{ fontSize: "22px", fontFamily: "comic sans ms" }}>Or</a>

                                    <input type="text" className='roomCode' placeholder='Enter Room Code' onChange={setQueriedName}></input>
                                    <a style={{ fontSize: "22px", fontFamily: "comic sans ms" }}>Or</a>
                                    <button className='createRoom'>Create a room</button>

                                </div>
                            </>} />
                        </Routes>
                    </div>
                </div>
            </div>
        </>

    );
}
