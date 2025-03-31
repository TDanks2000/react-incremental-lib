export interface Producer {
  id: string;
  name: string;
  baseProduction: number;
  productionMultiplier: number;
  productionInterval: number;
  lastProductionTime: number;
  isActive: boolean;
  cost: number;
  owned: number;
  maxOwned?: number;
}

export interface ProductionState {
  producers: Producer[];
}

export interface ProductionStore extends ProductionState {
  addProducer: (producer: Producer) => void;
  removeProducer: (id: string) => void;
  updateProducer: (id: string, updates: Partial<Producer>) => void;
}

export interface UseAutoIncrementProps {
  interval: number;
  increaseBy: number;
  onPause?: () => void;
  onResume?: () => void;
  onAutoIncrement?: (amount: number) => void;
  options?: {
    startPaused?: boolean;
  };
}