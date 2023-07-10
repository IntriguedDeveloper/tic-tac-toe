import { useEffect, useState, createContext, useContext } from 'react';
import './OfflinePlayerPage.css';
import { Link } from 'react-router-dom';
import popSound from '../assets/QKTA234-pop.mp3';
const GameContext = createContext();
export default function OfflinePlayerPage() {

    const [isWinner, setWinner] = useState(false);
    const [turn, setTurn] = useState('X');
    const [data_X, setData_X] = useState([]);
    const [data_Y, setData_Y] = useState([]);
    const [reset, setReset] = useState(false);
    const [elements, setElements] = useState([]);
    useEffect(() => {
        if (checkWinner(data_X)) {
            setTurn("X has Won");
        }
        else if (checkWinner(data_Y)) {
            setTurn("O has Won");
        }
        else if (checkTie(data_X, data_Y)) {
            setTurn("Tie");
        }

    })
    return (
        <GameContext.Provider
            value={{
                turn,
                setTurn,
                data_X,
                setData_X,
                data_Y,
                setData_Y,
                isWinner,
                setWinner,
                reset,
                setReset
            }}>
            <div className='boardWrapper'>
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


                <nav className='bottomNav'>
                    <ul>
                        <li>Play Offline</li>
                        <li><Link to="/multiPlayerPage" style={{ textDecoration: "none", color: 'white' }}>Go Online</Link></li>
                    </ul>
                </nav>
            </div>
        </GameContext.Provider>
    );
}
function Square({ pos }) {
    const { turn, setTurn, data_X, setData_X, data_Y, setData_Y, isWinner, setWinner, reset, setReset } = useContext(
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

        if (!(data_Y.includes(pos) || data_X.includes(pos))) {
            playPopSound();
            if (turn === 'X') {
                setValue('X');
                setTurn('O');
                const newData = [...data_X];
                newData.push(pos);
                setData_X(newData);
                if (checkWinner(data_X)) {
                    setWinner(true);
                }
                else {
                    setWinner(false);
                }
            } else if (turn === "O") {
                setValue('O');
                setTurn('X');
                const newData = [...data_Y];
                newData.push(pos);
                setData_Y(newData);
            }

        }
        else {
            console.log("Square Occupied");
        }


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
    const { turn, setTurn, data_X, setData_X, data_Y, setData_Y, isWinner, setWinner, reset, setReset } = useContext(GameContext);
    function handleClick() {
        setData_X([]);
        setData_Y([]);
        setTurn("X");
        setReset(true);
    }

    return (
        <>
            <button className="resetButton" onClick={handleClick}>Reset</button>
        </>
    );
}

function checkWinner(playerArray) {
    const winningCombinations = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7]
    ];
    let styleArray = [];
    let win = winningCombinations.some(combination =>
        combination.every(element => playerArray.includes(element)));

    return win;
}
function checkTie(data_X, data_Y) {
    if (data_X.length + data_Y.length == 9) {
        return true;
    }
    return false;
}
