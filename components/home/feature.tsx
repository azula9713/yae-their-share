import { CheckCircle } from "lucide-react";
import React from "react";

type Props = {
    icon: React.ReactNode;
    title: string;
    description: string;
    features: string[];
};

export default function Feature({
    icon,
    title,
    description,
    features,
}: Props) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center rounded-2xl bg-muted mb-6 size-16">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-lg text-muted-foreground leading-relaxed mb-6">
       {description}
      </p>
      <div className="space-y-2">
        {/* <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="size-4 text-primary" />
          <span>Handles any split scenario</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="size-4 text-primary" />
          <span>Precise to the penny</span>
        </div> */}
        {features.map((feature, index) => (
          <div key={index} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="size-4 text-primary" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
