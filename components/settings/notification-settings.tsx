import React from 'react'

type Props = {}

export default function NotificationSettings({}: Props) {
  return (
             <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-teal-50 dark:from-slate-800 dark:to-teal-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-teal-600" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Expense Added</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when someone adds a new expense
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.expenseAdded}
                  onCheckedChange={(checked) =>
                    updateSetting("notifications.expenseAdded", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Settlement Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Remind you about pending settlements
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.settlementReminders}
                  onCheckedChange={(checked) =>
                    updateSetting("notifications.settlementReminders", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly expense summaries
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.weeklyReports}
                  onCheckedChange={(checked) =>
                    updateSetting("notifications.weeklyReports", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
  )
}