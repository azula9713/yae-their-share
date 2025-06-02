export interface IAppSettings {
  currency: {
    code: string;
    symbol: string;
    currencyName: string;
    countryName: string;
    decimalPlaces: number;
    displayCents: boolean;
  };
  privacy: {
    shareAnalytics: boolean;
    autoBackup: boolean;
  };
  display: {
    compactMode: boolean;
    theme: string;
  };
}

