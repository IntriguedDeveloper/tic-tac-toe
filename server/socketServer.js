import { Server } from "socket.io";
import { searchForEmptyRooms, returnRandomTurn, checkWinner } from "./searchMethods.mjs";
import { httpServer, playerPool } from "./httpServer.js";

const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io", "http://127.0.0.1:5173"],
    credentials: true,
  },
});

let roomPool = [];
let roomPosMap = new Map();


io.on("connection", async (socket) => {
  console.log("Connection made")
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
    if (faceDetails.turn == "X") {
      if (roomPosMap.get(faceDetails.roomName) == undefined) {
        roomPosMap.set(faceDetails.roomName, {
          posX: [],
          posO: [],
        });
        roomPosMap.get(faceDetails.roomName).posX.push(faceDetails.pos);
      } else {
        roomPosMap.get(faceDetails.roomName).posX.push(faceDetails.pos);
      }
    } else if (faceDetails.turn == "O") {
      if (roomPosMap.get(faceDetails.roomName) == undefined) {
        roomPosMap.set(faceDetails.roomName, {
          posX: [],
          posO: [],
        });
        roomPosMap.get(faceDetails.roomName).posO.push(faceDetails.pos);
      } else {
        roomPosMap.get(faceDetails.roomName).posO.push(faceDetails.pos);
      }
    }
    if (checkWinner(roomPosMap.get(faceDetails.roomName).posX)) {
      let turn = "X";
      io.to(faceDetails.roomName).emit("winnerDeclared", turn);
    } else if (checkWinner(roomPosMap.get(faceDetails.roomName).posO)) {
      let turn = "O";
      io.to(faceDetails.roomName).emit("winnerDeclared", turn);
    }
    socket.to(faceDetails.roomName).emit("playerResponse", faceDetails);
  });
  socket.on("backToLobby", (winnerName, roomName) => {
    roomPosMap.set(roomName, {
      posX: [],
      posO: [],
    });
    socket.emit("backToLobbyClient");
  });
  socket.on("initRematch", (winnerName, roomName) => {
    roomPosMap.set(roomName, {
      posX: [],
      posO: [],
    });
    io.to(roomName).emit("initRematchClient");
  });
});
export default io;