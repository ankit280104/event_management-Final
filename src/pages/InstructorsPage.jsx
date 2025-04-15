import { InstructorCard } from "@/components/InstructorCard";

// This would normally come from your database
const instructors = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    bio: "Expert in web development with 10+ years of teaching experience.",
    image: "/placeholder.svg?height=400&width=400",
    upcomingEvents: [
      {
        id: "1",
        title: "Introduction to Web Development",
        date: "March 15, 2024",
      },
      {
        id: "2",
        title: "Advanced JavaScript Concepts",
        date: "March 20, 2024",
      },
    ],
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    bio: "Specialist in UI/UX design and frontend development.",
    image: "/placeholder.svg?height=400&width=400",
    upcomingEvents: [
      {
        id: "3",
        title: "UI/UX Design Workshop",
        date: "March 25, 2024",
      },
    ],
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    bio: "Full-stack developer and cloud architecture expert.",
    image: "/placeholder.svg?height=400&width=400",
    upcomingEvents: [],
  },
];

export default function InstructorsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Our Instructors
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {instructors.map((instructor) => (
          <InstructorCard key={instructor.id} {...instructor} />
        ))}
      </div>
    </div>
  );
}
