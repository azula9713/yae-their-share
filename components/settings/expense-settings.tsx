import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Globe } from "lucide-react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";

type Props = {};

export default function ExpenseSettings({}: Props) {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-green-600" />
          Expense Defaults
        </CardTitle>
        <CardDescription>
          Set default behaviors for new expenses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="split-method">Default Split Method</Label>
            <Select
            // value={settings.defaultSplitMethod}
            // onValueChange={(value) =>
            //   updateSetting("defaultSplitMethod", value)
            // }
            >
              <SelectTrigger id="split-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equal">Equal Split</SelectItem>
                <SelectItem value="percentage">Percentage Split</SelectItem>
                <SelectItem value="custom">Custom Amounts</SelectItem>
                <SelectItem value="shares">By Shares</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
            // value={settings.language}
            // onValueChange={(value) => updateSetting("language", value)}
            >
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {/* {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))} */}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Compact Mode</Label>
            <p className="text-sm text-muted-foreground">
              Show more information in less space
            </p>
          </div>
          <Switch
          //   checked={settings.display.compactMode}
          //   onCheckedChange={(checked) =>
          //     updateSetting("display.compactMode", checked)
          //   }
          />
        </div>
      </CardContent>
    </Card>
  );
}
