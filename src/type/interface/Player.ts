export default interface Player {
  id: number;
  name: string;
  chips: number;
  buyIn: number; // Renamed from initialChips
  position: string;
  hasFolded: boolean;
  currentBet: number;
  hasActed: boolean;
  chipChange: number;
  originalIndex?: number;
}