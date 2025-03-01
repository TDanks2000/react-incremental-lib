import React from 'react';
import { useUpgrade } from 'react-incremental-library';

export const UseUpgradeExample = () => {
  const upgrade = useUpgrade({
    upgradeName: 'Upgrade',
    cost: 50,
    isSellable: true,
    onUpgrade: () => console.log('Upgraded!'),
    onBuy: () => console.log('Bought Upgrade!'),
    onBuyAll: () => console.log('Bought All Upgrades!'),
    onBuyCustom: (amount) => console.log(`Bought ${amount} Upgrades!`),
    onSell: () => console.log('Sold Upgrade!'),
    onSellAll: () => console.log('Sold All Upgrades!'),
    onSellCustom: (amount) => console.log(`Sold ${amount} Upgrades!`),
  });

  return (
    <div>
      <h1>Upgrade Example</h1>
      <p>Owned: {upgrade.owned}</p>
      <button onClick={upgrade.handleBuy}>Buy</button>
      <button onClick={upgrade.handleBuyAll}>Buy All</button>
      <button onClick={() => upgrade.handleBuyCustom(5)}>Buy 5</button>
      <button onClick={upgrade.handleSell}>Sell</button>
      <button onClick={upgrade.handleSellAll}>Sell All</button>
      <button onClick={() => upgrade.handleSellCustom(3)}>Sell 3</button>
    </div>
  );
};
