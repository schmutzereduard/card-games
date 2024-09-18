import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Poker from './components/Poker/Poker';  // Example for a card game
import BlackJack from './components/BlackJack/BlackJack';  // Another game example

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poker" element={<Poker />} />
          <Route path="/blackjack" element={<BlackJack />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
