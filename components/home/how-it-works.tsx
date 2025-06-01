export default function HowItWorks() {
  return (
    <div className="mb-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          How It Works
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Three simple steps to financial clarity
        </p>
      </div>

      <div className="relative">
        <div className="absolute top-12 left-[calc(16.67%-8px)] right-[calc(16.67%-8px)] h-0.5 bg-emerald-100 dark:bg-emerald-900/30 hidden md:block"></div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="relative">
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-4 z-10">
                <span className="font-medium">1</span>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Create a Group
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-center">
                Start by naming your expense group and adding participants.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-4 z-10">
                <span className="font-medium">2</span>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Add Expenses
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-center">
                Log expenses as they happen. Specify who paid and how to split.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-4 z-10">
                <span className="font-medium">3</span>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Settle Up
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-center">
                See exactly who owes whom and settle debts efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
