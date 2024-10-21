type PlayerBet = {
  [key: number]: number;
}

export default interface Pot {
  amount: number;
  eligiblePlayers: number[];
  distribution?: PlayerBet;
  baseAmount?: number;
  baseUpdatedBy?: number;
  paidPlayers?: number[];
}