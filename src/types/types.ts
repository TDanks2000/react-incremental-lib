export type UpgradeStatic = {
  upgradeName: string;
  cost: number;
  onUpgrade: () => void;
  onBuy: () => void;
  onBuyAll: () => void;
  onBuyCustom: (amount: number) => void;
};

export type UpgradeSellable = {
  isSellable: true;
  onSell: () => void;
  onSellAll: () => void;
  onSellCustom: (amount: number) => void;
};

export type UpgradeNonSellable = {
  isSellable: false;
};

export type Notation = 'compact' | 'standard' | 'scientific' | 'engineering';
