import { Dictionary } from "@/type/Dictionary";

export class Validator {

  static validatePlayerCount(playerCount: number): boolean {
    return playerCount >= 2 && playerCount <= 10;
  }

  static validateSmallBlind(value: number | string, dictionary: Dictionary): string {
    return Number(value) < 1 ? dictionary.message.smallBlindMustBeGreaterThan0 : '';
  }

  static validateBigBlind(value: number | string, smallBlind: number | string, dictionary: Dictionary): string {
    return Number(value) < Number(smallBlind) ? dictionary.message.bigBlindMustBeGreaterOrEqualToSmallBlind : '';
  }

  static validateBuyIn(value: number | string, bigBlind: number | string, dictionary: Dictionary): string {
    return Number(value) < Number(bigBlind) * 2 ? dictionary.message.buyInMustBeGreaterThanBigBlindTimes2 : '';
  }

}