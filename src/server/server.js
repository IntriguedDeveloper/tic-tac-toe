const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server, {
    cors:{
        origin:"http://127.0.0.1:5173",
    }
});
const cors = require('cors');
app.use(cors());

let playerPool = [];

app.use(express.json());
app.post('/playerPoolEntry', (req, res) => {
    let response = {
        message : "Player Object received succesfully",
        permission : true,
    }
    if(searchArray(playerPool, req.body.name)){
        response.permission = false;
        response.message = "Player Name Already Taken";
    }
    else{
        playerPool.push(req.body.name);
    }
    
    console.log(playerPool);
    res.status(200).json(response); // Send the response back to the client
});


server.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
    io.on('connection', (socket) => {
        socket.send(JSON.stringify({
            message : "hello from server",
        }))
    })
});
function searchArray(array, element){
    for(let i = 0; i<=array.length; i++){
        let searchResults = {
            isPresent : false,
            index : null,
        };
        if(array[i] == element){
            searchResults = {
                isPresent : true,
                index : i,
            }
            break;
        }
        
    }
    return searchResults;
}
function matchMaking(playerPool, currentPlayerIndex){
    let matchedPlayerIndex;
    let length  = playerPool.length;
    for(let i = 0; i <= playerPool.length; i++ ){
        if(length >= 1){
            if((currentPlayerIndex + 1) <= playerPool.length-1){
                matchedPlayerIndex = currentPlayerIndex + 1;
            }
            else{
                matchedPlayerIndex = currentPlayerIndex - 1; 
            }
        }
    }
    return matchedPlayerIndex;
}