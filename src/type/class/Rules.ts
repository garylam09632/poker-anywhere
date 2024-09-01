import Player from "../interface/Player";

abstract class Rule {
  canBet(player: Player, bet: number, currentBet: number, bigBlind: number): boolean {
    // Player all in, Player call, Player min raise
    if (bet === player.chips || bet === currentBet || (bet >= currentBet + bigBlind && bet <= player.chips))
      return true;
    return false;
  }
}

class NormalRule extends Rule {

}

export { Rule, NormalRule }