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
}