const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const path = require("path");
const { instrument } = require("@socket.io/admin-ui");
app.use(express.json());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io", "http://127.0.0.1:5173"],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
  mode: "development",
});
app.use(cors());
httpServer.listen(5000, () => {
  console.log("Listening to http://localhost:5000");
});

let playerPool = [];
let roomPool = [];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});
app.post("/playerPoolEntry", (req, res) => {
  let response = {
    message: "Player Object received succesfully",
    permission: true,
  };
  if (searchArray(playerPool, req.body.name).isPresent) {
    response.permission = false;
    response.message = "Player Name Already Taken";
  } else {
    playerPool.push(req.body.name);
  }

  console.log(playerPool);
  res.status(200).json(response); // Send the response back to the client
});

io.on("connection", (socket) => {
  let gamePos = [];
  let gamePosO = [];
  let gamePosX = [];
  let winnerName, winnerTurn;
  socket.on("emit", async (name) => {
    let emptyRoomData = searchForEmptyRooms(roomPool);
    if (emptyRoomData.foundEmptyRoom) {
      // create room with player name
      let emptyRoomName = roomPool[emptyRoomData.emptyRoomIndex][0];
      await socket.join(emptyRoomName);
      roomPool[emptyRoomData.emptyRoomIndex].push(name);
      let opponentName = roomPool[emptyRoomData.emptyRoomIndex].filter(
        (player) => player !== name
      )[0];
      let lobbyArray = returnRandomTurn(
        { name: name, turn: null },
        { name: opponentName, turn: null }
      );
      io.to(emptyRoomName).emit("joinedRoom", lobbyArray, emptyRoomName);
    } else {
      socket.join(name);
      socket.emit("insufficientPlayers");
      roomPool.push([name]);
    }
  });
  socket.on("posInput", (faceDetails) => {
    console.log(
      "Pos input received from : " + faceDetails.turn + faceDetails.pos
    );
    console.log("The room name is : " + faceDetails.roomName);
    if(faceDetails.turn == 'X'){
      gamePosX.push(faceDetails.pos);
    }
    else if(faceDetails.turn == 'O'){
      gamePosO.push(faceDetails.pos);

    }
    if(checkWinner(gamePosX)){
      console.log("Player with turn X has won!");
    }
    else if(checkWinner(gamePosO)){
      console.log("Player with turn O has won!");
    }
    socket.to(faceDetails.roomName).emit("playerResponse", faceDetails);
  });
});

function searchArray(array, element) {
  let searchResults = {
    isPresent: false,
    index: null,
  };
  for (let i = 0; i <= array.length - 1; i++) {
    if (array[i] == element) {
      searchResults = {
        isPresent: true,
        index: i,
      };
      break;
    }
  }
  return searchResults;
}
function matchMaking(playerPool, currentPlayerIndex) {
  let matchedPlayerIndex;
  let length = playerPool.length;
  for (let i = 0; i <= playerPool.length - 1; i++) {
    if (length >= 1) {
      if (currentPlayerIndex + 1 <= playerPool.length - 1) {
        matchedPlayerIndex = currentPlayerIndex + 1;
      } else {
        matchedPlayerIndex = currentPlayerIndex - 1;
      }
    }
  }
  return matchedPlayerIndex;
}
function returnRandomTurn(player1, player2) {
  const turns = ["O", "X"];
  const randomTurnIndex = Math.floor(Math.random() * turns.length);
  const randomTurn = turns[randomTurnIndex];
  player1.turn = randomTurn;
  if (randomTurnIndex === 0) {
    player2.turn = turns[1];
  } else {
    player2.turn = turns[0];
  }
  return [player1, player2];
}
function searchForEmptyRooms(roomPool) {
  //returns index of empty room (if any) or else returns message to create room
  let foundEmptyRoom = false;
  let emptyRoomIndex = null;

  for (let i = 0; i < roomPool.length; i++) {
    let roomPlayers = roomPool[i];
    if (roomPlayers.length < 2) {
      foundEmptyRoom = true;
      emptyRoomIndex = i;
      break;
    }
  }
  let data = {
    foundEmptyRoom: foundEmptyRoom,
    emptyRoomIndex: emptyRoomIndex,
  };
  return data;
}
function searchRoom(roomPool, roomName) {
  let roomPossession = false;
  for (let i = 0; i <= roomPool.length - 1; i++) {
    let mRoomName = roomPool[i];
    if (mRoomName == roomName) {
      roomPossession = true;
    }
  }
  return roomPossession;
}
function checkWinner(playerArray) {
  function searchArray(array, element) {
    let result;
    for (let i = 0; i <= array.length - 1; i++) {
      if (array[i] == element) {
        result = true;
        break;
      }
    }
    return result;
  }
  const winningCombinations = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];
  for (let i = 0; i < winningCombinations.length; i++) {
    let posCollection = winningCombinations[i];
    let arraySearchIncrementCounter = 0;
    for (let j = 0; j < posCollection.length; j++) {
      if (searchArray(playerArray, posCollection[j])) {
        arraySearchIncrementCounter += 1;
      }
    }
    if (arraySearchIncrementCounter == 3) {
      return true;
    }
  }
  return false;
}
