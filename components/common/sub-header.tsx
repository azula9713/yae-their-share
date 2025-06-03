import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SubHeader() {
  return (
    <Link
      href="/"
      className="flex items-center text-sm mb-6 hover:underline text-emerald-600 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
    >
      <ArrowLeft className="size-4 mr-1" />
      Back to home
    </Link>
  );
}
