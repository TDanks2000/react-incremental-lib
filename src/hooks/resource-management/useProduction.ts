import { useProductionStore } from '../../stores';


export const useProduction = () => {
  const store = useProductionStore();

  return {...store};
}