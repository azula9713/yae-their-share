import Link from "next/link";
import { Button } from "../ui/button";
import { Heart, PlusCircle, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <div className="text-center mb-16">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900 dark:to-pink-900 rounded-2xl mb-4 shadow-lg">
              <Heart className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Their Share
          </h1>
          <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Share moments, split costs, stay friends. The warmest way to handle group expenses with the people you care
            about.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link href="/create-event" className="inline-block">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 px-8 py-3 shadow-lg"
              >
                <PlusCircle className="h-5 w-5" />
                Start Sharing
              </Button>
            </Link>
            <Link href="/demo" className="inline-block">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 px-8 py-3 border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-300"
              >
                <Sparkles className="h-5 w-5" />
                See It in Action
              </Button>
            </Link>
          </div>
        </div>
  );
}
