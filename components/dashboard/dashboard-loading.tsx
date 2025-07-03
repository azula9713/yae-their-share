export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin border-4 border-primary border-t-transparent rounded-full mx-auto mb-4 size-8"></div>
        <p className="text-muted-foreground">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );
}
