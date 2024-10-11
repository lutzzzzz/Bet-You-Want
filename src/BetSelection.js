import React from 'react';

const BetOption = ({ title, description, onSelect }) => {
  return (
    <div className="bet-option">
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={onSelect}>Select this Bet Type</button>
    </div>
  );
};

const BetSelection = ({ onSelectDiceRoll, odds, houseBalance }) => {
  return (
    <div className="bet-selection">
      <h1>Select Your Bet Type</h1>
      <BetOption 
        title="Dice Roll"
        description={`Bet based on a simple randomized outcome. Current Odds: ${odds.toFixed(2)}x. House Balance: ${houseBalance} ETH.`}
        onSelect={onSelectDiceRoll}
      />
      <BetOption 
        title="Sports Match"
        description="Bet on an external event with a fixed outcome"
        onSelect={() => console.log('Selected: Sports Match')}
      />
      <BetOption 
        title="Unregulated Bet"
        description="Bet on anything you want, unregulated"
        onSelect={() => console.log('Selected: Unregulated Bet')}
      />
    </div>
  );
};

export default BetSelection;