import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function HowItWorks() {
  return (
    <div className="mb-16">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-orange-900/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold mb-4 text-slate-800 dark:text-white">
            Simple as 1, 2, 3
          </CardTitle>
          <CardDescription className="text-lg text-slate-600 dark:text-slate-300">
            Start sharing expenses in minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-white">
                Create your split
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Give it a name that brings back memories - "Weekend in Paris" or
                "Sarah's Birthday Dinner"
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-white">
                Add your crew
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Include everyone who's part of the fun. Start tracking expenses
                as they happen.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-white">
                Settle up with ease
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                See who owes what in a clear, friendly breakdown. No awkward
                conversations needed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
