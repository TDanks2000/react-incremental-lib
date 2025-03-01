import { useState } from 'react';
import { useCurrencyStore } from '../stores';
import {
  UpgradeNonSellable,
  UpgradeSellable,
  UpgradeStatic,
} from '../types/types';

type UseUpgradeProps = UpgradeStatic & (UpgradeSellable | UpgradeNonSellable);

export const useUpgrade = (props: UseUpgradeProps) => {
  const [owned, setOwned] = useState(0);

  const { currency, increase, decrease } = useCurrencyStore();
  const { cost } = props;

  const handleBuying = (amount: number) => {
    if (currency < Math.floor(cost * amount)) return;
    decrease(cost * amount);
    setOwned(owned + amount);
  };

  const handleSelling = (amount: number) => {
    if (owned < amount) return;
    if (amount === 0) return;

    increase(cost * amount);
    setOwned(owned - amount);
  };

  const handleUpgrade = () => {
    props.onUpgrade();
  };

  const handleBuy = () => {
    if (currency < cost) return;
    decrease(cost);

    props.onBuy();
  };

  const handleBuyAll = () => {
    const amount = Math.floor(currency / cost);
    if (amount === 0) return;
    handleBuying(amount);

    props.onBuyAll();
  };

  const handleBuyCustom = (amount: number) => {
    handleBuying(amount);
    props.onBuyCustom(amount);
  };

  const handleSell = () => {
    if (!props.isSellable) return;
    handleSelling(1);

    props.onSell();
  };

  const handleSellAll = () => {
    if (!props.isSellable) return;
    handleSelling(owned);

    props.onSellAll();
  };

  const handleSellCustom = (amount: number) => {
    if (!props.isSellable) return;
    handleSelling(amount);

    props.onSellCustom(amount);
  };

  return {
    handleUpgrade,
    handleBuy,
    handleBuyAll,
    handleBuyCustom,
    handleSell,
    handleSellAll,
    handleSellCustom,
    owned,
  };
};
