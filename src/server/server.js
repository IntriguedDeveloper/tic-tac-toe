const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

app.post('/onlinePlayerPage', (req, res) => {
    let response = {
        message : "hi"
    }
    
    res.status(200).json(response); // Send the response back to the client
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
let data_X = [];
let data_Y = [];

async function Game(player1, player2){

}