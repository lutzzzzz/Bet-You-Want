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

const BetSelection = () => {
  const handleSelect = (betType) => {
    console.log(`Selected: ${betType}`);
  };

  return (
    <div className="bet-selection">
      <h1>Select Your Bet Type</h1>
      <BetOption 
        title="Dice Roll"
        description="Bet based on a simple randomized outcome"
        onSelect={() => handleSelect('Dice Roll')}
      />
      <BetOption 
        title="Sports Match"
        description="Bet on an external event with a fixed outcome"
        onSelect={() => handleSelect('Sports Match')}
      />
      <BetOption 
        title="Unregulated Bet"
        description="Bet on anything you want, unregulated"
        onSelect={() => handleSelect('Unregulated Bet')}
      />
    </div>
  );
};

export default BetSelection;