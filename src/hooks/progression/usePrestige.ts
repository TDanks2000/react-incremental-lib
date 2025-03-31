import { useCurrencyStore, usePrestigeStore } from "../../stores";


export const usePrestige = () => {
  const store = usePrestigeStore();
  const currency = useCurrencyStore();

  // Update canPrestige based on currency value
  if (currency.currency >= store.prestigeThreshold !== store.canPrestige) {
    usePrestigeStore.setState({ canPrestige: currency.currency >= store.prestigeThreshold });
  }

  return {
    prestigePoints: store.prestigePoints,
    prestigeMultiplier: store.prestigeMultiplier,
    prestigeThreshold: store.prestigeThreshold,
    canPrestige: store.canPrestige,
    prestige: store.prestige,
    setPrestigeThreshold: store.setPrestigeThreshold,
    registerResetCallback: store.registerResetCallback,
    reset: store.reset
  };
};