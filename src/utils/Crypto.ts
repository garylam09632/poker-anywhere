import CryptoJS from "crypto-js";

const key = "VTZizH89IiAjTdtZlBAA6y9cxYo6PWnYXLApjiddtPNlVfc0LojlR51MiBYqoBOw"

export class Crypto {

  static encrypt = (value: string) => {
    return CryptoJS.AES.encrypt(value, key).toString();
  };

  static decrypt = (value: string) => {
    return CryptoJS.AES.decrypt(value, key).toString(CryptoJS.enc.Utf8);
  }

  static hash = (value: string) => {
    return CryptoJS.HmacSHA256(value, key).toString();
  }
}