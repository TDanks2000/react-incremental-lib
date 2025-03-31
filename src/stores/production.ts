import { create } from 'zustand';
import { useCurrencyStore } from '.';

export interface Producer {
  id: string;
  name: string;
  baseCost: number;
  baseProduction: number;
  costScaling: number;
  count: number;
  dependencies?: {
    producerId: string;
    requiredCount: number;
  }[];
}

interface ProductionState {
  producers: Record<string, Producer>;
  lastUpdate: number;
}

interface ProductionStore extends ProductionState {
  addProducer: (producer: Omit<Producer, 'count'>) => void;
  buyProducer: (producerId: string) => boolean;
  updateProduction: (deltaTime: number) => void;
  getProducerCost: (producerId: string) => number;
  getProducerProduction: (producerId: string) => number;
  canBuyProducer: (producerId: string) => boolean;
  reset: () => void;
}

const calculateCost = (producer: Producer): number => {
  return producer.baseCost * Math.pow(producer.costScaling, producer.count);
};

const calculateProduction = (producer: Producer, producers: Record<string, Producer>): number => {
  if (!producer.dependencies || producer.dependencies.length === 0) {
    return producer.baseProduction * producer.count;
  }

  const dependencyMultiplier = producer.dependencies.reduce((mult, dep) => {
    const dependency = producers[dep.producerId];
    if (!dependency || dependency.count < dep.requiredCount) return 0;
    return mult * (dependency.count / dep.requiredCount);
  }, 1);

  return producer.baseProduction * producer.count * dependencyMultiplier;
};

export const useProductionStore = create<ProductionStore>()((set, get) => ({
  producers: {},
  lastUpdate: Date.now(),

  addProducer: (producer) => set((state) => ({
    producers: {
      ...state.producers,
      [producer.id]: { ...producer, count: 0 }
    }
  })),

  buyProducer: (producerId) => {
    const state = get();
    const producer = state.producers[producerId];
    const currency = useCurrencyStore.getState();

    if (!producer) return false;

    const cost = calculateCost(producer);
    if (currency.currency < cost) return false;

    currency.decrease(cost);
    set((state) => ({
      producers: {
        ...state.producers,
        [producerId]: { ...producer, count: producer.count + 1 }
      }
    }));

    return true;
  },

  updateProduction: (deltaTime) => {
    const state = get();
    const currency = useCurrencyStore.getState();
    let totalProduction = 0;

    Object.values(state.producers).forEach(producer => {
      totalProduction += calculateProduction(producer, state.producers);
    });

    const productionThisTick = (totalProduction * deltaTime) / 1000; // Convert ms to seconds
    currency.increase(productionThisTick);

    set({ lastUpdate: Date.now() });
  },

  getProducerCost: (producerId) => {
    const producer = get().producers[producerId];
    return producer ? calculateCost(producer) : 0;
  },

  getProducerProduction: (producerId) => {
    const state = get();
    const producer = state.producers[producerId];
    return producer ? calculateProduction(producer, state.producers) : 0;
  },

  canBuyProducer: (producerId) => {
    const state = get();
    const producer = state.producers[producerId];
    if (!producer) return false;

    const currency = useCurrencyStore.getState();
    return currency.currency >= calculateCost(producer);
  },

  reset: () => set({ producers: {}, lastUpdate: Date.now() })
}));