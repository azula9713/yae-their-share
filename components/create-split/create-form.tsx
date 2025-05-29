import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

import { Button } from "../ui/button";
import { CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";

export default function CreateForm() {
  const router = useRouter();
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventName.trim()) return;

    // Get existing events
    const existingEvents = JSON.parse(
      localStorage.getItem("theirShareEvents") ?? "[]"
    );

    // Create a unique ID
    const newId = uuidv4();

    // Create a new split and store it in localStorage
    const newEvent = {
      id: newId,
      name: eventName,
      date: date ? date.toISOString() : null,
      participants: [],
      expenses: [],
    };

    // Add new split
    localStorage.setItem(
      "theirShareEvents",
      JSON.stringify([...existingEvents, newEvent])
    );

    // Navigate to the split page
    router.push(`/split/${newId}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="split-name">Split Name</Label>
          <Input
            id="split-name"
            placeholder="Trip to Paris, Dinner at Joe's, etc."
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="split-date">Split Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </CardFooter>
    </form>
  );
}
