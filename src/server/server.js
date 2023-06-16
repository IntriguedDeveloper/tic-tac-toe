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
    }
    playerPool.push(req.body);
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
