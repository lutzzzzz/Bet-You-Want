import React, { useState, useEffect, useCallback } from 'react';
import TransactionHistory from './TransactionHistory';

const BettingPlatform = ({ account, web3, contract, goBack }) => {
  const [gameId, setGameId] = useState(null);
  const [wagerAmount, setWagerAmount] = useState('');
  const [houseFee, setHouseFee] = useState('');
  const [description, setDescription] = useState('');
  const [gameDetails, setGameDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // 创建游戏
  const createGame = async () => {
    if (!wagerAmount || parseFloat(wagerAmount) <= 0) {
      alert("Please enter a valid wager amount.");
      return;
    }
    if (!houseFee || parseInt(houseFee, 10) > 1000) {
      alert("House fee should be between 0 and 1000 basis points (10%).");
      return;
    }

    try {
      // 将 Wager Amount 转换为 Wei，结果为字符串
      const wagerValue = web3.utils.toWei(wagerAmount.toString(), 'ether'); // string
      // 将 House Fee 转换为字符串
      const houseFeeValue = parseInt(houseFee, 10).toString(); // string

      // 计算发送的 value，使用 BigInt 进行运算后转换为字符串
      const sendValue = (BigInt(wagerValue) * BigInt(2)).toString();

      // 调用合约方法，传递字符串类型的参数
      const result = await contract.methods.createGame(
        wagerValue, // string
        houseFeeValue, // string
        description
      ).send({
        from: account,
        value: sendValue, // string
        gas: 300000,
      });

      const newGameId = result.events.GameCreated.returnValues.gameId;
      setGameId(newGameId.toString());
      setTransactions((prev) => [
        ...prev,
        {
          date: new Date().toLocaleString(),
          action: "Created Game",
          amount: wagerAmount,
          description: `Created game with ID ${newGameId}`,
        },
      ]);
      console.log('Game created with ID:', newGameId);
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

// 加入游戏
const joinGame = async (position) => {
  const existingGameId = prompt("Enter the game ID to join:");
  if (!existingGameId) return;

  try {
      const gameInfo = await contract.methods.games(existingGameId).call();
      const wagerInEther = web3.utils.fromWei(gameInfo.wagerAmount, 'ether'); // string

      // 将 PlayerA 和 PlayerB 转换为数值 0 和 1
      const positionValue = position === "PlayerA" ? 0 : 1;

      await contract.methods.joinGame(existingGameId, positionValue).send({
          from: account,
          value: web3.utils.toWei(wagerInEther, 'ether'), // string
          gas: 300000,
      });

      setGameId(existingGameId);
      setTransactions((prev) => [
          ...prev,
          {
              date: new Date().toLocaleString(),
              action: `Joined Game as ${position}`,
              amount: wagerInEther,
              description: `Joined game with ID ${existingGameId} as ${position}`,
          },
      ]);
      console.log("Joined game successfully");
  } catch (error) {
      console.error("Error joining game:", error);
  }
};


  // 获取游戏详情
  const fetchGameDetails = useCallback(async (id) => {
    try {
      const gameData = await contract.methods.games(id).call();
      setGameDetails({
        house: gameData.house,
        playerA: gameData.playerA,
        playerB: gameData.playerB,
        wagerAmount: parseFloat(web3.utils.fromWei(gameData.wagerAmount, 'ether')), // number
        houseFee: parseInt(gameData.houseFee, 10), // number
        description: gameData.description,
        state: gameData.state,
        declaredOutcome: gameData.declaredOutcome,
        finalOutcome: gameData.finalOutcome,
        disputeEndTime: parseInt(gameData.disputeEndTime, 10), // number
        disputingPlayer: gameData.disputingPlayer
      });
    } catch (error) {
      console.error("Error fetching game details:", error);
    }
  }, [contract, web3.utils]);

  useEffect(() => {
    if (gameId) {
      fetchGameDetails(gameId);
    }
  }, [gameId, fetchGameDetails]);

  return (
    <div className="betting-platform">
      <h2>Betting Platform</h2>
      <div>
        <h3>Create Game</h3>
        <input
          type="number"
          placeholder="Wager Amount (ETH)"
          value={wagerAmount}
          onChange={(e) => setWagerAmount(e.target.value)}
        />
        <input
          type="number"
          placeholder="House Fee (in basis points)"
          value={houseFee}
          onChange={(e) => setHouseFee(e.target.value)}
        />
        <input
          type="text"
          placeholder="Game Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={createGame}>Create Game</button>
      </div>
      
      <div>
        <h3>Join Game</h3>
        <button onClick={() => joinGame("PlayerA")}>Join as Player A</button>
        <button onClick={() => joinGame("PlayerB")}>Join as Player B</button>
      </div>

      {gameId && gameDetails && (
        <div>
          <h3>Game Details for ID: {gameId}</h3>
          <p><strong>House:</strong> {gameDetails.house}</p>
          <p><strong>Player A:</strong> {gameDetails.playerA}</p>
          <p><strong>Player B:</strong> {gameDetails.playerB}</p>
          <p><strong>Wager Amount:</strong> {gameDetails.wagerAmount} ETH</p>
          <p><strong>House Fee:</strong> {gameDetails.houseFee / 100}%</p>
          <p><strong>Description:</strong> {gameDetails.description}</p>
          <p><strong>Game State:</strong> {gameDetails.state}</p>
          <p><strong>Declared Outcome:</strong> {gameDetails.declaredOutcome}</p>
          <p><strong>Final Outcome:</strong> {gameDetails.finalOutcome}</p>
          <p><strong>Dispute End Time:</strong> {new Date(gameDetails.disputeEndTime * 1000).toLocaleString()}</p>
          <p><strong>Disputing Player:</strong> {gameDetails.disputingPlayer}</p>
        </div>
      )}

      <button onClick={goBack}>Back to Home</button>

      {/* Transaction History */}
      <TransactionHistory transactions={transactions} />
    </div>
  );
};

export default BettingPlatform;
