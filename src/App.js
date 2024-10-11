import React, { useEffect, useState } from 'react';
import BetSelection from './BetSelection';
import TransactionHistory from './TransactionHistory';
import DiceRoll from './DiceRoll';
import ErrorBoundary from './ErrorBoundary';
import Web3 from 'web3';
import './App.css'; // Import styles

function App() {
  const [view, setView] = useState('home');
  const [transactions, setTransactions] = useState([]);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [houseBalance, setHouseBalance] = useState(0);
  const [odds, setOdds] = useState(1.9);

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
        }
      } else {
        alert("Please install MetaMask to use this application.");
      }
    };
    loadWeb3();

    // 使用模拟数据来测试前端界面
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

  useEffect(() => {
    // 计算赔率，基于庄家资金池动态调整
    if (houseBalance > 0) {
      const newOdds = 1.8 + (houseBalance / 10000);
      setOdds(newOdds);
    }
  }, [houseBalance]);

  const renderView = () => {
    switch (view) {
      case 'diceRoll':
        return (
          <DiceRoll 
            goBack={() => setView('home')} 
            account={account} 
            web3={web3} 
            odds={odds} 
            houseBalance={houseBalance} 
            setHouseBalance={setHouseBalance}
          />
        );
      case 'home':
      default:
        return (
          <div className="main-content">
            <BetSelection onSelectDiceRoll={() => setView('diceRoll')} odds={odds} houseBalance={houseBalance} />
            <TransactionHistory transactions={transactions} />
          </div>
        );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the Betting Platform</h1>
        {account && <p>Connected account: {account}</p>}
      </header>
      <main className="App-main">
        <ErrorBoundary>{renderView()}</ErrorBoundary>
      </main>
    </div>
  );
}

export default App;