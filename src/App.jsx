import { useEffect, useState } from 'react';
import './app.css'
export default function App() {
  const [isWinner, setWinner] = useState(false);
  const [turn, setTurn] = useState('X');
  const [data_X, setData_X] = useState([]);
  const [data_Y, setData_Y] = useState([]);
  const [pos, setPos] = useState(0);
  const[reset, setReset] = useState(false);
  useEffect(() => {
    if (checkWinner(data_X)) {
      setTurn("X has Won");
    }
    else if(checkWinner(data_Y)){
      setTurn("O has Won");
    }
    else if(checkTie(data_X, data_Y)){
      setTurn("Tie");
    }
    
  })
  
  return (
      <div className='boardWrapper'>
        <div className='board'>
          <div className="board-row">
            <Square  turn={turn} setTurn={setTurn} data_X={data_X} setData_X={setData_X} data_Y={data_Y} setData_Y={setData_Y} pos={1} isWinner={isWinner} setWinner={setWinner} reset = {reset} setReset = {setReset}/>
            <Square  turn={turn} setTurn={setTurn} data_X={data_X} setData_X={setData_X} data_Y={data_Y} setData_Y={setData_Y} pos={2} isWinner={isWinner} setWinner={setWinner} reset = {reset} setReset = {setReset}/>
            <Square  turn={turn} setTurn={setTurn} data_X={data_X} setData_X={setData_X} data_Y={data_Y} setData_Y={setData_Y} pos={3} isWinner={isWinner} setWinner={setWinner} reset = {reset} setReset = {setReset}/>
          </div>
          <div className="board-row">
            <Square turn={turn} setTurn={setTurn} data_X={data_X} setData_X={setData_X} data_Y={data_Y} setData_Y={setData_Y} pos={4} isWinner={isWinner} setWinner={setWinner} reset = {reset} setReset = {setReset}/>
            <Square turn={turn} setTurn={setTurn} data_X={data_X} setData_X={setData_X} data_Y={data_Y} setData_Y={setData_Y} pos={5} isWinner={isWinner} setWinner={setWinner} reset = {reset} setReset = {setReset}/>
            <Square turn={turn} setTurn={setTurn} data_X={data_X} setData_X={setData_X} data_Y={data_Y} setData_Y={setData_Y} pos={6} isWinner={isWinner} setWinner={setWinner} reset = {reset} setReset = {setReset}/>
          </div>
          <div className="board-row">
            <Square turn={turn} setTurn={setTurn} data_X={data_X} setData_X={setData_X} data_Y={data_Y} setData_Y={setData_Y} pos={7} isWinner={isWinner} setWinner={setWinner} reset = {reset} setReset = {setReset}/>
            <Square turn={turn} setTurn={setTurn} data_X={data_X} setData_X={setData_X} data_Y={data_Y} setData_Y={setData_Y} pos={8} isWinner={isWinner} setWinner={setWinner} reset = {reset} setReset = {setReset}/>
            <Square turn={turn} setTurn={setTurn} data_X={data_X} setData_X={setData_X} data_Y={data_Y} setData_Y={setData_Y} pos={9} isWinner={isWinner} setWinner={setWinner} reset = {reset} setReset = {setReset}/>
          </div>
        </div>
        <div className='turnIndicator'>{turn}</div>
        <ResetButton turn={turn} setTurn={setTurn} data_X={data_X} setData_X={setData_X} data_Y={data_Y} setData_Y={setData_Y} pos={9} isWinner={isWinner} setWinner={setWinner} reset = {reset} setReset = {setReset}/>
        <div className='aboutWrapper'><div className = "about">Made By Ankit Raj</div></div>
      </div>
    
  )
}
function Square({ turn, setTurn, data_X, setData_X, data_Y, setData_Y, isWinner, setWinner, pos, reset, setReset}){
  const [value, setValue] = useState(null);
  useEffect(()=>{
    if(reset){
      setValue(null);
    }
  },[reset])
  function handleClick() {
      setReset(false);
      if (!(data_Y.includes(pos) || data_X.includes(pos))) {
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
  return (
    <>
      <button className="square" onClick={handleClick}>
        {value}
      </button>
    </>
  );
}
function ResetButton({ turn, setTurn, data_X, setData_X, data_Y, setData_Y, isWinner, setWinner, reset, setReset }) {
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
  return winningCombinations.some(combination =>
    combination.every(element => playerArray.includes(element))
  );
}
function checkTie(data_X, data_Y) {
  if (data_X.length + data_Y.length  == 9) {
    return true;
  }
  return false;
}
