import { UseMutateFunction } from "@tanstack/react-query";
import { getAllCurrencies, getCurrencyByCode } from "global-currency-list";
import { DollarSign } from "lucide-react";

import { useGetUserSettings } from "@/hooks/user/use-user";
import { IAppSettings } from "@/types/settings.types";

import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";

type Props = {
  updateSettings: UseMutateFunction<
    { success: boolean; message: string },
    Error,
    { settings: IAppSettings },
    unknown
  >;
};

export default function CurrencySettings({ updateSettings }: Readonly<Props>) {
  const {
    currency: currencySettings,
    privacy: privacySettings,
    display: displaySettings,
  } = useGetUserSettings();

  const currencies = getAllCurrencies().filter(
    (currency, index, self) =>
      index ===
      self.findIndex(
        (c) =>
          c.code === currency.code &&
          c.currency_number === currency.currency_number
      )
  );

  const formatCurrencyExample = (amount: number) => {
    const formatted = amount.toLocaleString("en-US", {
      minimumFractionDigits: currencySettings.displayCents
        ? currencySettings.decimalPlaces
        : 0,
      maximumFractionDigits: currencySettings.displayCents
        ? currencySettings.decimalPlaces
        : 0,
    });
    return `${currencySettings.symbol}${formatted}`;
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-600" />
          Currency & Formatting
        </CardTitle>
        <CardDescription>
          Configure how monetary values are displayed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={currencySettings.code}
              onValueChange={(value) => {
                const currency = getCurrencyByCode(value);
                if (currency) {
                  const updatedSettings: IAppSettings = {
                    currency: {
                      ...currencySettings,
                      code: currency.code,
                      symbol: currency.symbol ?? "",
                      currencyName: currency.currency_name,
                      countryName: currency.country_name,
                      decimalPlaces: currencySettings.decimalPlaces,
                      displayCents: currencySettings.displayCents,
                    },
                    privacy: { ...privacySettings },
                    display: { ...displaySettings },
                  };

                  updateSettings({
                    settings: updatedSettings,
                  });
                }
              }}
            >
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem
                    key={`${currency.code + currency.country_name}`}
                    value={currency.code}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {currency.code}
                      </Badge>

                      <span>{currency.currency_name}</span>
                      <span className="font-mono text-sm">
                        {currency.symbol}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="decimal-places">Decimal Places</Label>
            <Select
              value={currencySettings.decimalPlaces.toString()}
              onValueChange={(value) => {
                const decimalPlaces = parseInt(value);
                if (!isNaN(decimalPlaces)) {
                  const updatedSettings: IAppSettings = {
                    currency: {
                      ...currencySettings,
                      decimalPlaces: decimalPlaces,
                    },
                    privacy: { ...privacySettings },
                    display: { ...displaySettings },
                  };

                  updateSettings({
                    settings: updatedSettings,
                  });
                }
              }}
            >
              <SelectTrigger id="decimal-places">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 (No decimals)</SelectItem>
                <SelectItem value="2">2 (Standard)</SelectItem>
                <SelectItem value="3">3 (Precise)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Cents</Label>
              <p className="text-sm text-muted-foreground">
                Display decimal places in amounts
              </p>
            </div>
            <Switch
              checked={currencySettings.displayCents}
              onCheckedChange={(checked) => {
                const updatedSettings: IAppSettings = {
                  currency: {
                    ...currencySettings,
                    displayCents: checked,
                  },
                  privacy: { ...privacySettings },
                  display: { ...displaySettings },
                };

                updateSettings({
                  settings: updatedSettings,
                });
              }}
            />
          </div>
        </div>

        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-2">
            Preview:
          </p>
          <div className="space-y-1 text-sm">
            <p>Small amount: {formatCurrencyExample(12.34)}</p>
            <p>Large amount: {formatCurrencyExample(1234.56)}</p>
            <p>Round number: {formatCurrencyExample(100)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
