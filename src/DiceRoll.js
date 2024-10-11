import React, { useState, useEffect } from 'react';

function DiceRoll({ goBack, account, web3, odds, houseBalance, setHouseBalance }) {
  const [result, setResult] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [isBetting, setIsBetting] = useState(false);
  const [gasEstimate, setGasEstimate] = useState('');

  useEffect(() => {
    if (web3 && betAmount) {
      const estimateGas = async () => {
        try {
          const gas = await web3.eth.estimateGas({
            from: account,
            value: web3.utils.toWei(betAmount, 'ether')
          });
          setGasEstimate(web3.utils.fromWei(gas.toString(), 'ether'));
        } catch (error) {
          console.error('Error estimating gas', error);
        }
      };
      estimateGas();
    }
  }, [web3, betAmount, account]);

  const rollDice = async () => {
    if (!betAmount || parseFloat(betAmount) <= 0) {
      alert('Please enter a valid bet amount.');
      return;
    }

    setIsBetting(true);

    try {
      const diceResult = Math.floor(Math.random() * 6) + 1;
      const isBig = diceResult > 3;
      const playerWins = isBig;

      // 如果玩家赢了
      if (playerWins) {
        const payout = parseFloat(betAmount) * odds;
        setHouseBalance(houseBalance - payout);
        alert(`You won! Dice rolled ${diceResult}. Your payout is ${payout} ETH.`);
      } else {
        setHouseBalance(houseBalance + parseFloat(betAmount));
        alert(`You lost! Dice rolled ${diceResult}. Better luck next time.`);
      }

      setResult(diceResult);
    } catch (error) {
      console.error('Error while rolling the dice:', error);
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
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        placeholder="Enter bet amount (ETH)"
      />
      <p>Estimated Gas Fee: {gasEstimate} ETH</p>
      <button onClick={rollDice} disabled={isBetting}>Roll the Dice</button>
      {isBetting && <p>Betting in progress... Please wait.</p>}
      {result !== null && <p>You rolled a {result}!</p>}
      <button onClick={goBack}>Back to Main Page</button>
    </div>
  );
}

export default DiceRoll;