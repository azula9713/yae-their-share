import { Calculator, Coffee, Shield, Smartphone, TrendingUp, Users } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function Features() {
  return (
    <div className="grid gap-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Made for Real Friendships</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Because money shouldn't complicate your relationships
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-orange-900/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900 dark:to-pink-900 rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl text-slate-800 dark:text-white">Fair & Flexible</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Not everyone needs to pay for everything. Split expenses exactly how your group wants.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-900/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl text-slate-800 dark:text-white">Crystal Clear</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  No confusion, no arguments. See exactly who owes what with beautiful, easy summaries.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-amber-900/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900 dark:to-yellow-900 rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <Coffee className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl text-slate-800 dark:text-white">Every Occasion</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  From coffee dates to dream vacations. Keep every shared moment organized and stress-free.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-slate-800 dark:text-white">Your Choice</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Jump right in or create an account. Your data stays safe either way you choose.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <Smartphone className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-slate-800 dark:text-white">Always With You</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Add expenses on the spot, settle up anywhere. Works beautifully on every device.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-rose-50 dark:from-slate-800 dark:to-rose-900/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900 dark:to-pink-900 rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <Calculator className="h-6 w-6 text-rose-600" />
                </div>
                <CardTitle className="text-xl text-slate-800 dark:text-white">Smart Math</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  We handle the complex calculations so you can focus on making memories together.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
  );
}
