import { KeyboardShortcut } from "@/constants/DefaultKeyboardShortCut";
import { LocalStorage } from "./LocalStorage";
import { registeredKeys } from "@/constants/LocalStorageKey";
import { Settings } from "@/type/Settings";
import { ChipDisplayMode } from "@/type/General";

export class Helper {
  static formatAbbreviatedNumber = (value: number): string => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(value % 1000000000 === 0 ? 0 : 1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
    }
    return value.toString();
  };

  static parseAbbreviatedNumber = (value: string): number => {
    const cleanValue = value.trim().toUpperCase();
    if (cleanValue.endsWith('B')) {
      return parseFloat(cleanValue.slice(0, -1)) * 1000000000;
    }
    if (cleanValue.endsWith('M')) {
      return parseFloat(cleanValue.slice(0, -1)) * 1000000;
    }
    if (cleanValue.endsWith('K')) {
      return parseFloat(cleanValue.slice(0, -1)) * 1000;
    }
    return parseFloat(cleanValue);
  };

  static getKeyboardShortcut = (key: keyof typeof KeyboardShortcut): string => {
    let shortcutSetting = LocalStorage.get('shortcutSetting').toObject() as typeof KeyboardShortcut | null;
    if (!shortcutSetting) {
      shortcutSetting = KeyboardShortcut;
    }
    return shortcutSetting[key];
  }

  static validateLocalStorage = (): boolean => {
    let ok = true;
    for (const key of registeredKeys) {
      if (LocalStorage.get(key).isNull()) {
        console.log(`${key} is null`);
        LocalStorage.remove(key);
        ok = false;
      }
    }
    return ok;
  }

  static cdm = (value: number): string => {
    const chipDisplayMode = LocalStorage.get('cdm').toString();
    if (!chipDisplayMode) {
      return value.toString();
    }
    if (chipDisplayMode === 'chips') {
      return value.toString();
    } else {
      const settings = LocalStorage.get('settings').toObject() as Settings;
      if (!settings) return value.toString();
      return (Math.round((value / settings.bigBlind) * 10) / 10).toString() + " BB";
    }
  }

  // static getLang = (): string => {
  //   const url = new URL(window.location.href);
  //   const lang = url.pathname.split('/')[1];
  //   if (lang) {
  //     return lang;
  //   }
  // }
}