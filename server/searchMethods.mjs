
export function searchArray(array, element) {
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
export function matchMaking(playerPool, currentPlayerIndex) {
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
export function returnRandomTurn(player1, player2) {
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
export function searchForEmptyRooms(roomPool) {
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
export function searchRoom(roomPool, roomName) {
  let roomPossession = false;
  for (let i = 0; i <= roomPool.length - 1; i++) {
    let mRoomName = roomPool[i];
    if (mRoomName == roomName) {
      roomPossession = true;
    }
  }
  return roomPossession;
}
export function checkWinner(playerArray) {
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
