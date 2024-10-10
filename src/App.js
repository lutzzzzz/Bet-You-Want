import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BetSelection from './BetSelection';
import TransactionHistory from './TransactionHistory';
import ErrorBoundary from './ErrorBoundary';
import './App.css'; // Import styles

function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const mockTransactions = [
      {
        date: '2024-10-10 14:00',
        game: 'Dice Roll',
        amount: '0.1',
        result: 'Win',
      },
      {
        date: '2024-10-09 16:30',
        game: 'Sports Match',
        amount: '0.5',
        result: 'Lose',
      },
      {
        date: '2024-10-08 11:15',
        game: 'Unregulated Bet',
        amount: '0.2',
        result: 'Win',
      },
    ];
    setTransactions(mockTransactions);
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to the Betting Platform</h1>
        </header>
        <main className="App-main">
          <ErrorBoundary>
            <div className="main-content">
              <BetSelection />
              <TransactionHistory transactions={transactions} />
            </div>
          </ErrorBoundary>
        </main>
      </div>
    </Router>
  );
}

export default App;
