
export enum MetalType {
  GOLD = 'GOLD',
  SILVER = 'SILVER'
}

export interface MarketRates {
  gold: number;
  silver: number;
  sources: { title: string; uri: string }[];
  lastUpdated: string;
}

export interface PlanningInputs {
  dailySaving: number;
  savingDuration: number;
  selectedMetal: MetalType;
  targetMetal: MetalType;
  targetQuantity: number;
  targetDuration: number;
}

export interface PlanningResults {
  totalSavings: number;
  estimatedQuantity: number;
  advice: string;
  requiredDailySaving: number;
}
