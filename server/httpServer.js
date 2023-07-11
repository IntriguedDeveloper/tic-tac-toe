import express from "express";
import { createServer } from "http";
import cors from "cors";
import { searchArray } from "./searchMethods.mjs";
import { fileURLToPath } from "url";
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../dist')));
export const httpServer = createServer(app);

export const playerPool = [];

app.get('/', (req,res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
})

app.post("/playerPoolEntry", (req, res) => {
  let response = {
    message: "Player Object received successfully",
    permission: true,
  };
  if (searchArray(playerPool, req.body.name).isPresent) {
    response.permission = false;
    response.message = "Player Name Already Taken";
  } else {
    playerPool.push(req.body.name);
  }

  console.log(playerPool);
  res.status(200).json(response);
});

export default app;
