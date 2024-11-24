import { Crypto } from "./Crypto";

class JsonValue {

  value: string | null;

  toString(): string | null { return this.value }

  toInt(): number | null { return this.value ? parseInt(this.value) : null }; 

  toObject<T>(): T | null { return this.value ? JSON.parse(this.value) as T : null };

  constructor (value: string | null) {
    this.value = value;
  }

}

export class LocalStorage {

  static get(key: string): JsonValue {
    return new JsonValue(localStorage.getItem(key) ? Crypto.decrypt(localStorage.getItem(key) || "") : null);
  }

  static set(key: string, value: any): void {
    localStorage.setItem(key, Crypto.encrypt(typeof value === 'object' ? JSON.stringify(value) : value));
  }

  static getTheme(): string {
    return localStorage.getItem('theme') ? Crypto.decrypt(localStorage.getItem('theme') || "light") : "light";
  }

}