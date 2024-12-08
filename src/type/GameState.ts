import Player from "./interface/Player";
import Pot from "./interface/Pot";
import { Stage } from "./General";

export type GameState = {
  players: Player[];
  bustedPlayers: Player[];
  currentBet: number;
  pots: Pot[];
  stage: Stage;
  handNumber: number;
  dealerIndex: number;
  activePlayerIndex: number;
  initialed: boolean;
}