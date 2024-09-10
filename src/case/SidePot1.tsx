import { Stage } from "@/type/General";
import Player from "@/type/interface/Player"
import Pot from "@/type/interface/Pot"

const players: Player[] = [
  {
    id: 1,
    name: "Gary",
    chips: 10200,
    position: "BB",
    hasFolded: false,
    currentBet: 0,
    hasActed: false,
    chipChange: 1400,
    buyIn: 10000,
    hasBusted: false,
  },
  {
    id: 2,
    name: "Makiyo",
    chips: 9200,
    position: "Player 4",
    hasFolded: true,
    currentBet: 0,
    hasActed: false,
    chipChange: -600,
    buyIn: 10000,
    hasBusted: false,
  },
  {
    id: 3,
    name: "Kyle",
    chips: 4700,
    position: "Player 5",
    hasFolded: true,
    currentBet: 0,
    hasActed: false,
    chipChange: -5200,
    buyIn: 10000,
    hasBusted: false,
  },
  {
    id: 4,
    name: "Louie",
    chips: 18800,
    position: "BTN",
    hasFolded: false,
    currentBet: 0,
    hasActed: false,
    chipChange: 10200,
    buyIn: 10000,
    hasBusted: false,
  },
  {
    id: 5,
    name: "Unix",
    chips: 3600,
    position: "SB",
    hasFolded: false,
    currentBet: 0,
    hasActed: false,
    chipChange: -5200,
    buyIn: 10000,
    hasBusted: false,
  },
]

const pots: Pot[] = [
  {
    amount: 4000,
    eligiblePlayers: [1, 4, 5]
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