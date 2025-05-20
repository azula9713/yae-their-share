export default function HowItWorks() {
  return (
    <div className="rounded-lg border shadow-xs p-6">
      <h2 className="text-2xl font-semibold mb-4">How it works</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-col items-center text-center p-4">
          <div className="bg-primary/10 rounded-full p-3 mb-3">
            <span className="text-primary font-bold text-xl">1</span>
          </div>
          <h3 className="font-medium mb-2">Create an event</h3>
          <p className="text-sm text-muted-foreground">
            Name your event and add the date it happened
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <div className="bg-primary/10 rounded-full p-3 mb-3">
            <span className="text-primary font-bold text-xl">2</span>
          </div>
          <h3 className="font-medium mb-2">Add participants</h3>
          <p className="text-sm text-muted-foreground">
            Add everyone involved in the event
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <div className="bg-primary/10 rounded-full p-3 mb-3">
            <span className="text-primary font-bold text-xl">3</span>
          </div>
          <h3 className="font-medium mb-2">Track expenses</h3>
          <p className="text-sm text-muted-foreground">
            Add expenses and see who owes whom
          </p>
        </div>
      </div>
    </div>
  );
}
