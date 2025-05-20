type Props = {
  title: string;
  description: string;
  stepNumber: number;
  icon?: React.ReactNode;
};

export default function WorkStep({
  title,
  description,
  stepNumber,
  icon,
}: Readonly<Props>) {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="bg-primary/10 rounded-full p-3 mb-3">
        <span className="text-primary font-bold text-xl">{stepNumber}</span>
      </div>
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
