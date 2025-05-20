import WorkStep from "./work-step";

export default function HowItWorks() {
  return (
    <div className="rounded-lg border shadow-xs p-6">
      <h2 className="text-2xl font-semibold mb-4">How it works</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <WorkStep
          title="Create a split"
          description="Name your event and add the date it happened"
          stepNumber={1}
        />
        <WorkStep
          title="Add participants"
          description="Add everyone involved in the event"
          stepNumber={2}
        />
        <WorkStep
          title="Track expenses"
          description="Add expenses and see who owes whom"
          stepNumber={3}
        />
      </div>
    </div>
  );
}
