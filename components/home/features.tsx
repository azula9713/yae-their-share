export default function Features() {
  return (
    <div className="rounded-lg border shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-4">Features</h2>
      <ul className="grid gap-2">
        <li className="flex items-start gap-2">
          <div className="h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
            <span className="h-2 w-2 rounded-full bg-primary"></span>
          </div>
          <span>Split expenses unevenly among specific participants</span>
        </li>
        <li className="flex items-start gap-2">
          <div className="h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
            <span className="h-2 w-2 rounded-full bg-primary"></span>
          </div>
          <span>See a clear breakdown of who owes whom</span>
        </li>
        <li className="flex items-start gap-2">
          <div className="h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
            <span className="h-2 w-2 rounded-full bg-primary"></span>
          </div>
          <span>Track expenses for trips, dinners, projects, and more</span>
        </li>
        <li className="flex items-start gap-2">
          <div className="h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
            <span className="h-2 w-2 rounded-full bg-primary"></span>
          </div>
          <span>Simplify complex group expenses with minimal effort</span>
        </li>
      </ul>
    </div>
  );
}
