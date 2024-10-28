import React, { useState, useEffect, useCallback } from 'react';
import TransactionHistory from './TransactionHistory';

const BettingPlatform = ({ account, web3, contract, goBack }) => {
  const [gameId, setGameId] = useState(null);
  const [wagerAmount, setWagerAmount] = useState('');
  const [houseFee, setHouseFee] = useState('');
  const [description, setDescription] = useState('');
  const [gameDetails, setGameDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [role, setRole] = useState(null);
  const [arbitrationGameId, setArbitrationGameId] = useState(''); // 仲裁者输入的游戏ID
  const [isArbitratorJoined, setIsArbitratorJoined] = useState(false); // 标识仲裁者是否已加入
  const arbitratorAddress = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4';

  const stateMapping = {
    "0": "Created",
    "1": "Started",
    "2": "Ended",
    "3": "Disputed",
    "4": "Resolved",
    "5": "Finalized"
  };
  
  const outcomeMapping = {
    "0": "Undecided",
    "1": "Player A Wins",
    "2": "Player B Wins"
  };

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
      const wagerValue = web3.utils.toWei(wagerAmount.toString(), 'ether');
      const houseFeeValue = parseInt(houseFee, 10).toString();
      const sendValue = (BigInt(wagerValue) * BigInt(2)).toString();

      const result = await contract.methods.createGame(
        wagerValue,
        houseFeeValue,
        description
      ).send({
        from: account,
        value: sendValue,
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
      fetchGameDetails(newGameId);
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const joinGame = async (position) => {
    const existingGameId = prompt("Enter the game ID to join:");
    if (!existingGameId) return;

    try {
      const gameInfo = await contract.methods.games(existingGameId).call();
      const wagerInEther = web3.utils.fromWei(gameInfo.wagerAmount, 'ether');
      const positionValue = position === "PlayerA" ? 1 : 2;

      await contract.methods.joinGame(existingGameId, positionValue).send({
        from: account,
        value: web3.utils.toWei(wagerInEther, 'ether'),
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

      fetchGameDetails(existingGameId);
    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  const fetchGameDetails = useCallback(async (id) => {
    try {
      const gameData = await contract.methods.games(id).call();
      setGameDetails({
        house: gameData.house,
        playerA: gameData.playerA,
        playerB: gameData.playerB,
        wagerAmount: parseFloat(web3.utils.fromWei(gameData.wagerAmount, 'ether')),
        houseFee: parseInt(gameData.houseFee, 10),
        description: gameData.description,
        state: stateMapping[gameData.state.toString()],
        declaredOutcome: outcomeMapping[gameData.declaredOutcome.toString()],
        finalOutcome: outcomeMapping[gameData.finalOutcome.toString()],
        disputeEndTime: parseInt(gameData.disputeEndTime, 10),
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

  useEffect(() => {
    if (account === arbitratorAddress) {
      setRole('Arbitrator');
    } else if (gameDetails) {
      if (account === gameDetails.house) setRole('House');
      else if (account === gameDetails.playerA) setRole('PlayerA');
      else if (account === gameDetails.playerB) setRole('PlayerB');
      else setRole(null);
    }
  }, [account, gameDetails]);

  const declareOutcome = async (outcome) => {
    try {
      await contract.methods.declareOutcome(gameId, outcome).send({
        from: account,
        gas: 300000,
      });
      alert("Outcome declared successfully");
      fetchGameDetails(gameId);
    } catch (error) {
      console.error("Error declaring outcome:", error);
    }
  };

  const raiseDispute = async () => {
    try {
      const disputeAmount = web3.utils.toWei((gameDetails.wagerAmount / 2).toString(), 'ether');
      await contract.methods.raiseDispute(gameId).send({
        from: account,
        value: disputeAmount,
        gas: 300000,
      });
      alert("Dispute raised successfully");
      fetchGameDetails(gameId);
    } catch (error) {
      console.error("Error raising dispute:", error);
    }
  };

  const resolveDispute = async (finalOutcome) => {
    try {
      await contract.methods.resolveDispute(arbitrationGameId, finalOutcome).send({
        from: account,
        gas: 300000,
      });
      alert("Dispute resolved successfully");
      fetchGameDetails(arbitrationGameId);
    } catch (error) {
      console.error("Error resolving dispute:", error);
    }
  };

  const handleArbitrationGameIdSubmit = () => {
    fetchGameDetails(arbitrationGameId);
  };

  const joinAsArbitrator = () => {
    setIsArbitratorJoined(true); // 标识仲裁者已加入
  };

  return (
    <div className="betting-platform">
      <h2>Betting Platform</h2>
      <button onClick={() => fetchGameDetails(gameId)}>Refresh Game Details</button>

      {/* 创建游戏 */}
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

      {/* 加入游戏 */}
      <div>
        <h3>Join Game</h3>
        <button onClick={() => joinGame("PlayerA")}>Join as Player A</button>
        <button onClick={() => joinGame("PlayerB")}>Join as Player B</button>
      </div>

      {/* 游戏详情 */}
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

      {/* 不同角色的按钮 */}
      {role === 'House' && gameDetails?.state === 'Started' && (
        <div>
          <h3>Declare Outcome</h3>
          <button onClick={() => declareOutcome(1)}>Declare Player A Wins</button>
          <button onClick={() => declareOutcome(2)}>Declare Player B Wins</button>
        </div>
      )}

      {(role === 'PlayerA' || role === 'PlayerB') && gameDetails?.state === 'Ended' && (
        <div>
          <h3>Raise Dispute</h3>
          <button onClick={raiseDispute}>Raise Dispute</button>
        </div>
      )}

      {/* 仲裁者操作 */}
      {role === 'Arbitrator' && !isArbitratorJoined && (
        <div>
          <h3>Arbitrator Panel</h3>
          <button onClick={joinAsArbitrator}>Join as Arbitrator</button>
        </div>
      )}

      {role === 'Arbitrator' && isArbitratorJoined && (
        <div>
          <h3>Enter Game ID to Arbitrate</h3>
          <input
            type="text"
            placeholder="Enter Game ID to arbitrate"
            value={arbitrationGameId}
            onChange={(e) => setArbitrationGameId(e.target.value)}
          />
          <button onClick={handleArbitrationGameIdSubmit}>Fetch Game Details</button>

          {gameDetails?.state === 'Disputed' && (
            <div>
              <h3>Resolve Dispute</h3>
              <button onClick={() => resolveDispute(1)}>Resolve in favor of Player A</button>
              <button onClick={() => resolveDispute(2)}>Resolve in favor of Player B</button>
            </div>
          )}
        </div>
      )}

      <button onClick={goBack}>Back to Home</button>
      <TransactionHistory transactions={transactions} />
    </div>
  );
};

export default BettingPlatform;
