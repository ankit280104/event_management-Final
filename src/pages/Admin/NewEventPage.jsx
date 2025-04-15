import { EventForm } from "@/components/EventForm";
import { useParams } from "react-router-dom";

export default function NewEventPage() {
  const { clubId } = useParams();
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Create New Event
      </h1>
      <EventForm clubId={clubId} />
    </div>
  );
}
