import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

// This would normally come from your database based on the ID
const eventData = {
  id: "1",
  title: "Introduction to Web Development",
  date: "March 15, 2024",
  instructor: "Dr. Sarah Johnson",
  image: "/placeholder.svg?height=400&width=800",
}

export default function RateEventPage() {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")

  const handleSubmit = async () => {
    // Here you would submit the rating to your API
    console.log({ eventId: params.id, rating, comment })

    // Redirect back to the event page
    router.push(`/events/${params.id}`)
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Rate Event</h1>

        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="w-16 h-16 rounded-md overflow-hidden">
              <img
                src={eventData.image || "/placeholder.svg"}
                alt={eventData.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <CardTitle>{eventData.title}</CardTitle>
              <CardDescription>
                {eventData.date} • {eventData.instructor}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Rating</CardTitle>
            <CardDescription>How would you rate your experience with this event?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium mb-2">
                Your Review (Optional)
              </label>
              <Textarea
                id="comment"
                placeholder="Share your experience with this event..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={rating === 0}>
              Submit Rating
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
