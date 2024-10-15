import React, { useState } from 'react';
import Web3 from 'web3';

function DiceRoll({ goBack, account, web3, contract, odds, houseBalance, setHouseBalance, setTransactions }) {
  const [betAmount, setBetAmount] = useState('');
  const [guess, setGuess] = useState(1);
  const [isBetting, setIsBetting] = useState(false);
  const [betResult, setBetResult] = useState(null);

  const placeBet = async () => {
    if (!betAmount || guess < 1 || guess > 6) {
      alert("Please enter a valid bet amount and guess between 1 and 6.");
      return;
    }

    setIsBetting(true);

    try {
      const betValue = Web3.utils.toWei(betAmount, 'ether');
      await contract.methods.placeBet(guess).send({ from: account, value: betValue });
      alert("Bet placed successfully!");
    } catch (error) {
      console.error("Error placing bet", error);
      alert("Failed to place bet. Please try again.");
    } finally {
      setIsBetting(false);
    }
  };

  const rollDice = async () => {
    setIsBetting(true);

    try {
      await contract.methods.rollDice().send({ from: account });
      alert("Dice rolled successfully! Check MetaMask for transaction details.");
      setBetResult("Bet settled! Check the result on your MetaMask transactions.");

      // 更新庄家的余额（这里简单地增加/减少资金池，可以根据你的业务逻辑调整）
      const winnings = parseFloat(betAmount) * odds;
      setHouseBalance(houseBalance - winnings);
      setTransactions((prev) => [...prev, { date: new Date().toLocaleString(), game: 'Dice Roll', amount: betAmount, result: winnings > 0 ? 'Win' : 'Lose' }]);
    } catch (error) {
      console.error("Error rolling dice", error);
      alert("Failed to roll dice. Please try again.");
    } finally {
      setIsBetting(false);
    }
  };

  return (
    <div className="dice-roll">
      <h2>Dice Roll Game</h2>
      <p>House Balance: {houseBalance} ETH</p>
      <p>Current Odds: {odds.toFixed(2)}x</p>
      <input
        type="number"
        min="0.01"
        step="0.01"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        placeholder="Bet Amount (ETH)"
      />
      <input
        type="number"
        min="1"
        max="6"
        value={guess}
        onChange={(e) => setGuess(Number(e.target.value))}
        placeholder="Your Guess (1-6)"
      />
      <button onClick={placeBet} disabled={isBetting}>Place Bet</button>
      <button onClick={rollDice} disabled={isBetting}>Roll Dice</button>
      {isBetting && <p>Betting in progress... Please wait.</p>}
      {betResult && <p>{betResult}</p>}
      <button onClick={goBack}>Back to Main Page</button>
    </div>
  );
}

export default DiceRoll;
