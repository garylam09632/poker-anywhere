export default interface Player {
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
}