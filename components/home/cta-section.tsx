
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <div className="text-center">
      <Card className="border-0 shadow-xl bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 text-white">
        <CardContent className="p-12">
          <h3 className="text-3xl font-bold mb-4">Ready to share the love?</h3>
          <p className="text-xl text-orange-100 mb-8">
            Join friends everywhere who keep their relationships
            money-drama-free
          </p>
          <Link href="/create-split">
            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-3 shadow-lg"
            >
              Create Your First Split
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
