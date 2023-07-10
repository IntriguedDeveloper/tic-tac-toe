import { useEffect, useState, createContext, useContext } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OnlinePlayerPage from "./components/OnlinePlayerPage";
import popSound from "./assets/QKTA234-pop.mp3";
import OfflinePlayerPage from "./components/OfflinePlayerPage";
import { socket } from "./socket.js";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/multiPlayerPage/*" element={<OnlinePlayerPage />}></Route>
        <Route path="/" element={<OfflinePlayerPage />}></Route>
      </Routes>
    </Router>
  );
}
