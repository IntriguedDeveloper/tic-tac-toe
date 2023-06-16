import { useEffect, useState, createContext, useContext } from 'react';
import './app.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  
} from 'react-router-dom';
import OnlinePlayerPage from './OnlinePlayerPage';
import popSound from './assets/QKTA234-pop.mp3';
import OfflinePlayerPage from './OfflinePlayerPage';
export default function App() {
  

  return (
    <Router>
      <Routes>
        <Route path = "/multiPlayerPage/*" element= {<OnlinePlayerPage/>}></Route>
        <Route path="/" element={<OfflinePlayerPage/>}></Route>
      </Routes>
    </Router>
  )
}

