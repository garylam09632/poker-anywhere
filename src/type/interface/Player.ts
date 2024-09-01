export default interface Player {
  id: number;
  name: string;
  chips: number;
  position: string;
  hasFolded: boolean;
  currentBet: number;
  hasActed: boolean;
  chipChange: number;
  initialChips: number;
}