import { InstructorForm } from "@/components/InstructorForm";

export default function NewInstructorPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Add New Instructor
      </h1>
      <InstructorForm />
    </div>
  );
}
