import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './OnlinePlayerPage.css';
import OfflinePlayerPage from './OfflinePlayerPage';

export default function OnlinePlayerPage() {
    const [name, setName] = useState("");
    const [isSubmitted, setSubmitted] = useState(false);
    const [matchStatus, setMatchStatus] = useState(false);
    const navigate = useNavigate();
    const playerSubmit = () => {
        let playerInformation = {
            name: name,
            matchStatus: matchStatus,
        };

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(playerInformation),
        };

        fetch('http://localhost:5000/onlinePlayerPage', options)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                navigate('./playerMatchMaking');
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
                                    <input type="text" className='textInput' onChange={(event) => { setName(event.target.value) }} />
                                    <button className='submit' onClick={playerSubmit}>Play</button>
                                </>
                            } />
                            <Route path="/playerMatchMaking" element={<>
                                <div className='optionContainer'>
                                    <button className='matchMakingRandom'>Random</button>
                                    <a style = {{fontSize:"22px", fontFamily:"comic sans ms"}}>Or</a>
                                    <div className='matchMakingSearch'>
                                        <input type = "text" className='playerSearch' placeholder='Search for Players'></input>
                                        <ul className='playerList'>
                                            <li className = 'playerListItem'>Arnab</li>
                                            <li className = 'playerListItem'>Penguin</li>
                                            <li className = 'playerListItem'>Arnab</li>
                                            <li className = 'playerListItem'>Sharma</li>
                                            <li className = 'playerListItem'>Gobar</li>
                                            <li className = 'playerListItem'>Bruh</li>
                                            <li className = 'playerListItem'>Bruh</li>
                                            <li className = 'playerListItem'>Arnab</li>
                                            <li className = 'playerListItem'>Penguin</li>
                                            <li className = 'playerListItem'>Arnab</li>
                                            <li className = 'playerListItem'>Sharma</li>
                                            <li className = 'playerListItem'>Gobar</li>
                                            <li className = 'playerListItem'>Bruh</li>
                                            <li className = 'playerListItem'>Bruh</li>
                                        </ul>
                                    </div>
                                </div>
                            </>} />
                        </Routes>
                    </div>
                </div>
            </div>
        </>

    );
}
