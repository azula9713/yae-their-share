import { Authenticated } from "convex/react";
import { LayoutDashboard, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Logo from "@/assets/noBgColor.png";

import { Button } from "../ui/button";

export default function Hero() {
  return (
    <div className="mb-16 max-w-2xl mx-auto text-center">
      <div className="inline-flex items-center justify-center mb-6">
        <Image src={Logo} alt="Split Expenses Logo" />
      </div>
      <h1 className="text-4xl font-bold mb-4">
        Split expenses{" "}
        <span className="text-primary">
          effortlessly
        </span>
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Track shared expenses, calculate who owes what, and settle up with
        clarity and confidence.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/create-split">
          <Button
            size="lg"
          >
            <PlusCircle className="size-4 mr-2" />
            Start Splitting
          </Button>
        </Link>
        <Authenticated>
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="lg"
            >
              <LayoutDashboard className="size-4 mr-2" />
              View Dashboard
            </Button>
          </Link>
        </Authenticated>
      </div>
    </div>
  );
}
