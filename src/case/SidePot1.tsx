import { PlayerLocation } from "@/type/enum/Location";
import { Position } from "@/type/enum/Position";
import { Stage } from "@/type/General";
import Player from "@/type/interface/Player"
import Pot from "@/type/interface/Pot"

// this.id = id;
// this.name = name;
// this.chips = chips;
// this.buyIn = buyIn;
// this.position = position;
// this.location = location;
// this.currentBet = currentBet;
// this.chipChange = chipChange;
// this.hasFolded = hasFolded;
// this.hasActed = hasActed;
// this.hasBusted = hasBusted;
// this.originalIndex = undefined;
// this.tempBuyIn = 0;
const players: Player[] = [
  {
    id: 1,
    name: "Gary",
    chips: 10200,
    position: Position.BB,
    hasFolded: false,
    currentBet: 0,
    hasActed: false,
    chipChange: 1400,
    buyIn: 10000,
    hasBusted: false,
    location: PlayerLocation.LeftBottom,
    betHistory: [],
    actualBet: 0
  },
  {
    id: 2,
    name: "Makiyo",
    chips: 9200,
    position: Position.UTG,
    hasFolded: false,
    currentBet: 0,
    hasActed: false,
    chipChange: -600,
    buyIn: 10000,
    hasBusted: false,
    location: PlayerLocation.LeftCenter,
    betHistory: [],
    actualBet: 0
  },
  {
    id: 3,
    name: "Kyle",
    chips: 4700,
    position: Position.HJ,
    hasFolded: true,
    currentBet: 0,
    hasActed: false,
    chipChange: -5200,
    buyIn: 10000,
    hasBusted: false,
    location: PlayerLocation.TopRight,
    betHistory: [],
    actualBet: 0
  },
  {
    id: 4,
    name: "Louie",
    chips: 18800,
    position: Position.BTN,
    hasFolded: false,
    currentBet: 0,
    hasActed: false,
    chipChange: 10200,
    buyIn: 10000,
    hasBusted: false,
    location: PlayerLocation.BottomCenter,
    betHistory: [],
    actualBet: 0
  },
  {
    id: 5,
    name: "Unix",
    chips: 3600,
    position: Position.SB,
    hasFolded: false,
    currentBet: 0,
    hasActed: false,
    chipChange: -5200,
    buyIn: 10000,
    hasBusted: false,
    location: PlayerLocation.BottomLeft,
    betHistory: [],
    actualBet: 0
  },
]

const pots: Pot[] = [
  {
    amount: 3,
    eligiblePlayers: [1, 2, 4, 5]
  }
];

const stage: Stage = "Flop";

const state = {
  players,
  currentBet: 0,
  pots,
  stage,
  dealerIndex: 3,
  activePlayerIndex: 4,
  initialed: false,
}

export default state;