import React, { useEffect, useState } from 'react';

const PoolSize = ({ gameType, fetchPoolSize }) => {
  const [poolSize, setPoolSize] = useState(0);

  useEffect(() => {
    const getPoolSize = async () => {
      const size = await fetchPoolSize(gameType);
      setPoolSize(size);
    };
    getPoolSize();
  }, [gameType, fetchPoolSize]);

  return (
    <div className="pool-size">
      <h3>{gameType} Pool Size</h3>
      <p>{poolSize} ETH</p>
    </div>
  );
};

export default PoolSize;