export interface ICurrencySettings {
  code: string;
  symbol: string;
  currencyName: string;
  countryName: string;
  decimalPlaces: number;
  displayCents: boolean;
}

export interface IPrivacySettings {
  shareAnalytics: boolean;
  autoBackup: boolean;
}
export interface IDisplaySettings {
  compactMode: boolean;
  theme: string;
}

export interface IAppSettings {
  currency: ICurrencySettings;
  privacy: IPrivacySettings;
  display: IDisplaySettings;
}
