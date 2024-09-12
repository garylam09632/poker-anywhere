export default class Player {
  id: number;
  name: string;
  chips: number;
  buyIn: number;
  position: string;
  currentBet: number;
  chipChange: number;
  hasFolded: boolean;
  hasActed: boolean;
  hasBusted: boolean;
  originalIndex?: number;
  tempBuyIn?: number;

  constructor(
    id: number, 
    name: string, 
    chips: number, 
    buyIn: number, 
    position: string, 
    currentBet: number, 
    chipChange: number, 
    hasFolded: boolean, 
    hasActed: boolean, 
    hasBusted: boolean, 
    originalIndex?: number
  ) {
    this.id = id;
    this.name = name;
    this.chips = chips;
    this.buyIn = buyIn;
    this.position = position;
    this.currentBet = currentBet;
    this.chipChange = chipChange;
    this.hasFolded = hasFolded;
    this.hasActed = hasActed;
    this.hasBusted = hasBusted;
    this.originalIndex = undefined;
    this.tempBuyIn = 0;
  }
}