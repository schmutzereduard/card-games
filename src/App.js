import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import FiveCardDraw from './components/FiveCardDraw/FiveCardDraw';
import BlackJack from './components/BlackJack/BlackJack';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/five-card-draw" element={<FiveCardDraw />} />
          <Route path="/blackjack" element={<BlackJack />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
