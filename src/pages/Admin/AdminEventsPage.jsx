import { Delete, PaintBucket, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useParams } from "react-router-dom";
import { useAtom } from "jotai";
import { eventAtom } from "@/atom/userAtoms";

export default function AdminEventsPage() {
  const { clubId } = useParams();
  const [events, setEvents] = useAtom(eventAtom);
  const filteredEvents = events.filter((event) => event.clubId === clubId);

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      // Update the state to remove the deleted event
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Manage Events</h1>
        <Button asChild>
          <Link to={`/admin/events/new/${clubId}`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Link>
        </Button>
      </div>
      {filteredEvents.length === 0 ? (
        <p className="text-center text-xl text-gray-500">
          No events available for this club.
        </p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Available Seats</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event._id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.seats}</TableCell>
                  <TableCell>${event.price}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      onClick={() => handleDeleteEvent(event._id)}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
