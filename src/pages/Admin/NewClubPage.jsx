import { ClubForm } from "@/components/ClubForm";

export default function NewClubPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Create New Event
      </h1>
      <ClubForm />
    </div>
  );
}
