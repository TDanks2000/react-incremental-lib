export type UpgradeStatic = {
  cost: number;
  onUpgrade: () => void;
  onBuy: () => void;
  onBuyAll: () => void;
  onBuyCustom: (amount: number) => void;
  onSell: () => void;
  onSellAll: () => void;
  onSellCustom: (amount: number) => void;
};

export type UpgradeSellable = {
  isSellable: true;
};

export type UpgradeNonSellable = {
  isSellable: false;
};

export type UseUpgradeProps = UpgradeStatic & (UpgradeSellable | UpgradeNonSellable);