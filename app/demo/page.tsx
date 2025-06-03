"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { Card } from "@/components/ui/card"

export default function DemoPage() {
  const router = useRouter()

  useEffect(() => {
    // Create a demo split with sample data
    const demoEvent = {
      id: `demo-${Date.now()}`,
      name: "Weekend Trip to the Beach",
      date: new Date().toISOString(),
      participants: [
        { id: "p1", name: "Alex" },
        { id: "p2", name: "Taylor" },
        { id: "p3", name: "Jordan" },
        { id: "p4", name: "Casey" },
      ],
      expenses: [
        {
          id: "e1",
          description: "Airbnb Rental",
          amount: 450,
          paidBy: "p1",
          splitBetween: ["p1", "p2", "p3", "p4"],
        },
        {
          id: "e2",
          description: "Groceries",
          amount: 120,
          paidBy: "p2",
          splitBetween: ["p1", "p2", "p3", "p4"],
        },
        {
          id: "e3",
          description: "Gas",
          amount: 80,
          paidBy: "p3",
          splitBetween: ["p1", "p2", "p3"],
        },
        {
          id: "e4",
          description: "Dinner at Seafood Restaurant",
          amount: 200,
          paidBy: "p4",
          splitBetween: ["p1", "p2", "p3", "p4"],
        },
        {
          id: "e5",
          description: "Beach Equipment Rental",
          amount: 75,
          paidBy: "p1",
          splitBetween: ["p1", "p2", "p4"],
        },
      ],
    }

    // Get existing events or initialize empty array
    const existingEvents = JSON.parse(localStorage.getItem("theirShareEvents") ?? "[]")

    // Add demo split
    localStorage.setItem("theirShareEvents", JSON.stringify([...existingEvents, demoEvent]))

    // Navigate to the split page
    router.push(`/split/${demoEvent.id}`)
  }, [router])

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Creating Demo Split</h2>
          <p className="text-center text-muted-foreground">
            Setting up a sample weekend trip with participants and expenses...
          </p>
        </div>
      </Card>
    </div>
  )
}
