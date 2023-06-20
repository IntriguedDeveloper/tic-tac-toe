import { createContext, useState, useContext, useEffect } from 'react';
import React from 'react';
import './OfflinePlayerPage';
import popSound from './assets/QKTA234-pop.mp3';
import './MultiPlayerBoard.css';
const GameContext = createContext();
export default function MultiPlayerBoard() {

    const [reset, setReset] = useState(false);
    const [turn, setTurn] = useState('X');
    const [elements, setElements] = useState([]);
    return (
        <GameContext.Provider value={{
            turn,
            setTurn,
            reset,
            setReset
        }}>
            <>
                <div className='multiPlayerWindowWrapper'>
                    <div className='playerInfo'>
                        <a className='playerTurn'> X - </a>
                        <a className='playerName'>Penguinium Oceanisas</a>

                    </div>
                    <div className='boardWrapperMultiPlayer'>

                        <div className='board'>
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
                        <div className='turnIndicator'>{turn}</div>
                        <ResetButton />



                    </div>
                    <div className='playerInfo'>
                        <a className='playerTurn'> O - </a>
                        <a className='playerName'>Arnab Sinha</a>

                    </div>

                </div>


            </>
        </GameContext.Provider>

    )
}
function Square({ pos }) {
    const { turn, setTurn, reset, setReset } = useContext(
        GameContext
    );
    const [value, setValue] = useState(null);
    useEffect(() => {
        if (reset) {
            setValue(null);
        }
    }, [reset])
    function handleClick() {
        setReset(false);

        //imply square occupied logic


    }
    function playPopSound() {
        const audio = new Audio();
        audio.src = popSound;
        audio.addEventListener('canplaythrough', () => {
            audio.play();
        })
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
            <button className="resetButton" onClick={handleClick}>Reset</button>
        </>
    );
}