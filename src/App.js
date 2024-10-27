import React, { useEffect, useState } from 'react';
import DiceRoll from './DiceRoll';
import RockPaperScissors from './RockPaperScissors';
import BettingPlatform from './BettingPlatform';
import ErrorBoundary from './ErrorBoundary';
import Web3 from 'web3';
import DiceBettingGameABI from './DiceBettingGameABI';
import RockPaperScissorsABI from './RockPaperScissorsABI';
import BettingPlatformABI from './BettingPlatformABI';
import './App.css';

function App() {
  const [view, setView] = useState('home');
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [diceContract, setDiceContract] = useState(null);
  const [rockPaperScissorsContract, setRockPaperScissorsContract] = useState(null);
  const [bettingPlatformContract, setBettingPlatformContract] = useState(null);
  const [houseBalance, setHouseBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const diceBettingContractAddress = '0xb9fca8ebf24571feffd031f26faf554e2377eb53';
  const rockPaperScissorsContractAddress = '0xd4bc5b60ece41848dd804df124bc0e3c04e919e4';
  const bettingPlatformContractAddress = '0x9ce3828d7827bfd28449ac7b72932b252a7f45ef'; 

  useEffect(() => {
    const loadWeb3AndContracts = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          const diceBettingGame = new web3Instance.eth.Contract(DiceBettingGameABI, diceBettingContractAddress);
          setDiceContract(diceBettingGame);

          const rockPaperScissorsGame = new web3Instance.eth.Contract(RockPaperScissorsABI, rockPaperScissorsContractAddress);
          setRockPaperScissorsContract(rockPaperScissorsGame);

          const bettingPlatformGame = new web3Instance.eth.Contract(BettingPlatformABI, bettingPlatformContractAddress);
          setBettingPlatformContract(bettingPlatformGame);

          const balance = await web3Instance.eth.getBalance(diceBettingGame.options.address);
          setHouseBalance(web3Instance.utils.fromWei(balance, 'ether'));
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
        }
      } else {
        alert("Please install MetaMask to use this application.");
      }
    };

    loadWeb3AndContracts();
  }, []);

  const renderView = () => {
    switch (view) {
      case 'diceRoll':
        return (
          <DiceRoll
            goBack={() => setView('home')}
            account={account}
            web3={web3}
            contract={diceContract}
            houseBalance={houseBalance}
            setHouseBalance={setHouseBalance}
            setTransactions={setTransactions}
            transactions={transactions}
          />
        );
      case 'rockPaperScissors':
        return (
          <RockPaperScissors
            account={account}
            web3={web3}
            contract={rockPaperScissorsContract}
            goBack={() => setView('home')}
          />
        );
      case 'bettingPlatform':
        return (
          <BettingPlatform
            account={account}
            web3={web3}
            contract={bettingPlatformContract}
            goBack={() => setView('home')}
          />
        );
      case 'home':
      default:
        return (
          <div className="main-content">
            <ErrorBoundary>
              <div className="game-card">
                <h2>Rock-Paper-Scissors</h2>
                <p>Play the classic game of Rock-Paper-Scissors with decentralized betting!</p>
                <button className="game-button" onClick={() => setView('rockPaperScissors')}>
                  Play Now
                </button>
              </div>

              <div className="game-card">
                <h2>Dice Betting Game</h2>
                <p>Try your luck by rolling the dice and win big!</p>
                <button className="game-button" onClick={() => setView('diceRoll')}>
                  Roll the Dice
                </button>
              </div>

              <div className="game-card">
                <h2>Betting Platform with Arbitrator</h2>
                <p>Join a decentralized betting platform with dispute resolution.</p>
                <button className="game-button" onClick={() => setView('bettingPlatform')}>
                  Join Platform
                </button>
              </div>
            </ErrorBoundary>
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
      <main className="App-main">{renderView()}</main>
    </div>
  );
}

export default App;
