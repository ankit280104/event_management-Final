import { Calendar, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/atom/userAtoms";
import { ToastProvider } from "./ui/toast";

export function EventCard({
  _id,
  title,
  instructors,
  description,
  image,
  availableSeats,
  price,
  date,
  timeSlots,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userData] = useAtom(userAtom);
  const [selectedTime, setSelectedTime] = useState("");
  console.log(userData);

  console.log(timeSlots);
  // Check if event has passed
  const isEventPassed = () => {
    const eventDate = new Date(date);
    const now = new Date();

    // If the event is today, check if all time slots have passed
    if (eventDate.toDateString() === now.toDateString()) {
      return timeSlots.every((slot) => {
        const [hours, minutes] = slot.endTime.split(":");
        const slotEndTime = new Date(eventDate);
        slotEndTime.setHours(parseInt(hours), parseInt(minutes));
        return slotEndTime < now;
      });
    }

    // Otherwise just check the date
    return eventDate < now;
  };

  const isPassed = isEventPassed();

  // Format date
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format time
  const formatTime = (time) => {
    try {
      const [hours, minutes] = time.split(":");
      const timeObj = new Date();
      timeObj.setHours(parseInt(hours));
      timeObj.setMinutes(parseInt(minutes));
      return timeObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return time;
    }
  };

  const handleBooking = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/bookings/${userData._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          eventId: _id,
          timeSlot: selectedTime,
        }),
      }
    );

    // Handle response
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to sync user with backend.");
    }
    const data = await response.json();
    setIsDialogOpen(false);
    alert(data.message || "Booking successful!");
  };

  return (
    <>
      <Card className={`overflow-hidden ${isPassed ? "opacity-75" : ""}`}>
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="aspect-video w-full object-cover"
        />

        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="line-clamp-1">{title}</CardTitle>
            {isPassed && (
              <span className="text-xs font-medium bg-gray-200 text-gray-700 px-2 py-1 rounded">
                Event Ended
              </span>
            )}
          </div>
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-2">
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4" />
              {formatDate(date)}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4" />
                Available Time Slots:
              </div>
              <ul className="ml-6 text-sm space-y-1">
                {timeSlots.map((slot, index) => (
                  <li key={slot._id || index}>
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center text-sm">
              <Users className="mr-2 h-4 w-4" />
              {availableSeats} seats available
            </div>

            <div className="text-lg font-bold">
              ${typeof price === "number" ? price.toFixed(2) : price}
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full"
                disabled={isPassed}
                variant={isPassed ? "secondary" : "default"}
              >
                {isPassed ? "Event Ended" : "Book Now"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Book Event</DialogTitle>
                <DialogDescription>
                  Select your preferred time slot and number of seats
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Available Time Slots</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot, index) => {
                      const formattedTime = `${formatTime(
                        slot.startTime
                      )} - ${formatTime(slot.endTime)}`;

                      return (
                        <Button
                          key={slot._id || index}
                          variant="outline"
                          className={`text-left ${
                            selectedTime?.startTime === slot.startTime
                              ? "bg-blue-500 text-white"
                              : "bg-white text-black"
                          }`}
                          onClick={() => {
                            setSelectedTime({
                              startTime: formatTime(slot.startTime),
                              endTime: formatTime(slot.endTime),
                            });
                            console.log("Selected Time:", {
                              startTime: formatTime(slot.startTime),
                              endTime: formatTime(slot.endTime),
                            });
                          }}
                        >
                          {formatTime(slot.startTime)} -{" "}
                          {formatTime(slot.endTime)}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Event Details</h4>
                  <div className="text-sm space-y-1">
                    <p>Date: {formatDate(date)}</p>
                    <div>
                      {instructors?.length === 0 ? (
                        <p className="text-center text-xl text-gray-500">
                          Instructor not selected yet.
                        </p>
                      ) : (
                        <div>
                          {instructors?.map((instructor) => (
                            <div
                              key={instructor._id}
                              className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full"
                            >
                              <span>{instructor.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 hover:bg-transparent"
                                onClick={() =>
                                  handleInstructorSelect(instructor._id)
                                }
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p>
                      Price per seat: $
                      {typeof price === "number" ? price.toFixed(2) : price}
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (!selectedTime) {
                      alert("Please select a time slot before booking.");
                      return;
                    }

                    handleBooking();
                    setIsDialogOpen(false);
                  }}
                >
                  Confirm Booking
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </>
  );
}

export default EventCard;
