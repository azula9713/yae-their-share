import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SubHeader() {
  return (
    <Link
      href="/"
      className="flex items-center text-sm mb-6 hover:underline text-primary hover:text-primary/80 transition-colors"
    >
      <ArrowLeft className="size-4 mr-1" />
      Back to home
    </Link>
  );
}
