import React, { useState, useEffect } from 'react';
import TransactionHistory from './TransactionHistory'; 
const RockPaperScissors = ({ account, web3, contract, goBack }) => {
  const [gameId, setGameId] = useState(null);
  const [move, setMove] = useState(null);
  const [nonce, setNonce] = useState(null);
  const [wager, setWager] = useState('');
  const [player1Wager, setPlayer1Wager] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const createGame = async () => {
    if (!wager || parseFloat(wager) <= 0) {
      alert("Please enter a valid wager amount.");
      return;
    }
  
    try {
      // 将 opponent 地址设置为 address(0)，允许任何人加入游戏
      const result = await contract.methods.createGame('0x0000000000000000000000000000000000000000').send({
        from: account,
        value: web3.utils.toWei(wager, 'ether'),
        gas: 300000,
      });
  
      const newGameId = result.events.GameCreated.returnValues.gameId;
      setGameId(newGameId.toString());
  
      // 更新交易记录
      setTransactions((prev) => [
        ...prev,
        {
          date: new Date().toLocaleString(),
          action: 'Created Game',
          amount: wager,
          description: `Game created with ID: ${newGameId}`,
        },
      ]);
      console.log('Game created with ID:', newGameId);
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };
  

  const joinGame = async () => {
    const existingGameId = prompt("Enter the game ID to join:");

    try {
      const gameInfo = await contract.methods.games(existingGameId).call();
      const player1WagerInEther = web3.utils.fromWei(gameInfo.wager, 'ether');
      setPlayer1Wager(player1WagerInEther);

      const confirmation = window.confirm(`Player1 has wagered ${player1WagerInEther} ETH. Click OK to match this amount and join the game.`);
      if (confirmation) {
        await contract.methods.joinGame(existingGameId).send({
          from: account,
          value: web3.utils.toWei(player1WagerInEther, 'ether'),
          gas: 300000,
        });
        setGameId(existingGameId);

        setTransactions((prev) => [
          ...prev,
          {
            date: new Date().toLocaleString(),
            action: 'Joined Game',
            amount: player1WagerInEther,
            description: `Joined game with ID: ${existingGameId}`,
          },
        ]);
        console.log("Joined game successfully");
      } else {
        alert("You canceled joining the game.");
      }
    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  const commitMove = async (selectedMove) => {
    if (!gameId) {
      alert("You must create or join a game first!");
      return;
    }

    try {
      const generatedNonce = Math.random().toString(36).substring(2);
      const commitment = await contract.methods.computeCommitment(selectedMove, generatedNonce).call();

      await contract.methods.commitMove(gameId, commitment).send({
        from: account,
        gas: 300000,
      });

      setMove(selectedMove);
      setNonce(generatedNonce);

      setTransactions((prev) => [
        ...prev,
        {
          date: new Date().toLocaleString(),
          action: 'Committed Move',
          amount: wager,
          description: `Committed move in game ID: ${gameId}`,
        },
      ]);
      console.log('Move committed with hash:', commitment);
      alert('Move committed! Remember to reveal later.');
    } catch (error) {
      console.error("Error committing move:", error);
    }
  };

  const revealMove = async () => {
    if (!gameId || !move || !nonce) {
      alert("You must commit your move first!");
      return;
    }
    try {
      await contract.methods.revealMove(gameId, move, nonce).send({
        from: account,
        gas: 300000,
      });

      setTransactions((prev) => [
        ...prev,
        {
          date: new Date().toLocaleString(),
          action: 'Revealed Move',
          amount: wager,
          description: `Revealed move in game ID: ${gameId}`,
        },
      ]);
      alert('Move revealed! Waiting for the result.');
    } catch (error) {
      console.error("Error revealing move:", error);
    }
  };

  useEffect(() => {
    if (gameId) {
      console.log("Updated Game ID:", gameId);
    }
  }, [gameId]);

  return (
    <div className="rock-paper-scissors-game">
      <h2>Rock-Paper-Scissors Game</h2>
      {!gameId ? (
        <>
          <div>
            <label>Enter Wager (ETH):</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={wager}
              onChange={(e) => setWager(e.target.value)}
            />
          </div>
          <button onClick={createGame}>Create Game</button>
        </>
      ) : (
        <>
          <p>Game ID: {gameId ? gameId : 'Loading...'}</p>
          <p>Player1 wagered: {player1Wager ? `${player1Wager} ETH` : 'No wager info yet'}</p>
          <div className="rock-paper-scissors-buttons">
            <button onClick={() => commitMove(1)}>Rock</button>
            <button onClick={() => commitMove(2)}>Paper</button>
            <button onClick={() => commitMove(3)}>Scissors</button>
          </div>
          <button onClick={revealMove}>Reveal Move</button>
        </>
      )}
      <button onClick={joinGame}>Join Game</button>
      <button onClick={goBack}>Back to Home</button>

      {}
      <TransactionHistory transactions={transactions} />
    </div>
  );
};

export default RockPaperScissors;
