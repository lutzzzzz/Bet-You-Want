import React, { useState } from 'react';
import TransactionHistory from './TransactionHistory';

function DiceRoll({ goBack, account, web3, contract, houseBalance, setHouseBalance, setTransactions, transactions = [] }) { // 设置默认值为[]
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
      const betValue = web3.utils.toWei(betAmount, 'ether');
      await contract.methods.placeBet(guess).send({ from: account, value: betValue, gas: 300000 });
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
      await contract.methods.rollDice().send({ from: account, gas: 300000 });
      const events = await contract.getPastEvents('DiceRolled', {
        filter: { player: account },
        fromBlock: 0,
        toBlock: 'latest'
      });
      if (events.length > 0) {
        const latestEvent = events[events.length - 1];
        const rolledNumber = latestEvent.returnValues.rolledNumber;
        const won = latestEvent.returnValues.won;
        const resultMessage = won ? "Congratulations! You won!" : "Sorry, you lost this time.";
        setBetResult(`Rolled Number: ${rolledNumber}. ${resultMessage}`);

        // Update the house balance after the result
        const balance = await web3.eth.getBalance(contract.options.address);
        setHouseBalance(web3.utils.fromWei(balance, 'ether'));

        // Update transactions
        setTransactions((prev) => [
          ...prev,
          {
            date: new Date().toLocaleString(),
            game: 'Dice Roll',
            amount: betAmount,
            result: won ? 'Win' : 'Lose'
          }
        ]);
      } else {
        setBetResult("Unable to retrieve the rolled number. Please try again later.");
      }
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

      {/* Display Transaction History specific to Dice Roll */}
      {Array.isArray(transactions) && (
        <TransactionHistory transactions={transactions.filter(transaction => transaction.game === 'Dice Roll')} />
      )}
    </div>
  );
}

export default DiceRoll;
