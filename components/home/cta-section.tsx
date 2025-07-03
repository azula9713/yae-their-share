import Link from "next/link";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function CTASection() {
  return (
    <div className="text-center">
      <Card className="shadow-sm bg-muted">
        <CardContent className="pt-6 pb-8 px-6">
          <h3 className="text-xl font-bold mb-2">
            Ready to get started?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Join thousands who trust Their Share for transparent, fair expense
            management.
          </p>
          <Link href="/create-split">
            <Button>
              Create Your First Split
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
