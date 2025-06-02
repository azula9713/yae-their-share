import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

import { useCreateSplit } from "@/hooks/split/use-split-mutations";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { useGetCurrentUser } from "@/hooks/user/use-user";

export default function CreateForm() {
  const router = useRouter();
  const {data:user} = useGetCurrentUser();
  const [eventName, setEventName] = useState("");
  const [noOfMembers, setNoOfMembers] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const createSplit = useCreateSplit(user?.id!);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a unique ID
    const newId = uuidv4();

    createSplit.mutate({
      name: eventName,
      splitId: newId,
      date: date?.toString() ?? "",
      expenses: [],
      participants: Array.from(
        { length: parseInt(noOfMembers, 10) },
        (_, i) => ({
          participantId: crypto.randomUUID(),
          name: `Name ${i + 1}`,
        })
      ),
    });

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
          <Label htmlFor="no-of-members">
            How many people are splitting this?
          </Label>
          <Input
            id="no-of-members"
            value={noOfMembers}
            placeholder="2, 3, 4, etc."
            onChange={(e) => setNoOfMembers(e.target.value)}
            required
            type="number"
            min={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="split-date">Split Date (Optional)</Label>
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
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
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  setDate(selectedDate);
                  setDatePickerOpen(false);
                }}
                initialFocus
                className="w-auto"
              />
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
