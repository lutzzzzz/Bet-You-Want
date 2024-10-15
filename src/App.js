import React, { useEffect, useState } from 'react';
import BetSelection from './BetSelection';
import TransactionHistory from './TransactionHistory';
import DiceRoll from './DiceRoll';
import ErrorBoundary from './ErrorBoundary';
import Web3 from 'web3';
import DiceBettingGameABI from './DiceBettingGameABI';
import './App.css';

function App() {
  const [view, setView] = useState('home');
  const [transactions, setTransactions] = useState([]);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [houseBalance, setHouseBalance] = useState(0);
  const [odds, setOdds] = useState(1.9);
  const [contract, setContract] = useState(null);
  const contractAddress = '0x97A425616BBA077548868F99A3546F7Ea90c78A0';

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        try {
          console.log("Requesting MetaMask connection...");
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          console.log("MetaMask connected successfully.");
          
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
          console.log("Account connected:", accounts[0]);
    
          if (contractAddress) {
            const diceBettingGame = new web3Instance.eth.Contract(DiceBettingGameABI, contractAddress);
            setContract(diceBettingGame);
            getHouseBalance(web3Instance, contractAddress); // 获取合约余额
          }
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
        }
      } else {
        alert("Please install MetaMask to use this application.");
      }
    };
  
    loadWeb3();  // 调用 loadWeb3 函数加载 web3 实例
  
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
  }, [contractAddress]);
  
  useEffect(() => {
    // 计算赔率，基于庄家资金池动态调整
    if (houseBalance > 0) {
      const newOdds = 1.8 + (houseBalance / 10000);
      setOdds(newOdds);
    }
  }, [houseBalance]);

  const getHouseBalance = async (web3Instance, address) => {
    if (address && web3Instance) {
      try {
        const balanceWei = await web3Instance.eth.getBalance(address);
        const balanceEther = web3Instance.utils.fromWei(balanceWei, 'ether');
        setHouseBalance(balanceEther);
        console.log("House balance fetched successfully:", balanceEther);
      } catch (error) {
        console.error("Error fetching house balance:", error);
      }
    }
  };

  const renderView = () => {
    switch (view) {
      case 'diceRoll':
        return (
          <DiceRoll 
            goBack={() => setView('home')} 
            account={account} 
            web3={web3} 
            contract={contract}
            odds={odds} 
            houseBalance={houseBalance} 
            setHouseBalance={setHouseBalance}
            setTransactions={setTransactions}
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
        <p>House Balance: {houseBalance} ETH</p> {/* 显示庄家余额 */}
      </header>
      <main className="App-main">
        <ErrorBoundary>{renderView()}</ErrorBoundary>
      </main>
    </div>
  );
}

export default App;