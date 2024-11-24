import Player from "./interface/Player";
import Pot from "./interface/Pot";
import { Stage } from "./General";

export type History = {
  players: Player[];
  currentBet: number;
  pots: Pot[];
  stage: Stage;
  dealerIndex: number;
  activePlayerIndex: number;
  initialed: boolean;
}