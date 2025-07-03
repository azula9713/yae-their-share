export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4 size-8"></div>
        <p className="text-slate-600 dark:text-slate-400">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );
}
