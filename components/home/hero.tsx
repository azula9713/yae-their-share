import Link from "next/link";
import { Button } from "../ui/button";
import { PlusCircle, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Their Share</h1>
        <p className="text-muted-foreground">
          Split expenses fairly with friends and family
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <Link href="/create-split" className="inline-block">
          <Button size="lg" className="gap-2">
            <PlusCircle className="size-5" />
            Create New Split
          </Button>
        </Link>
        <Link href="/demo" className="inline-block">
          <Button variant="outline" size="lg" className="gap-2">
            <Sparkles className="size-5" />
            Try Demo
          </Button>
        </Link>
      </div>
    </>
  );
}
