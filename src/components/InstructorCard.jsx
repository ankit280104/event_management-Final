import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function InstructorCard({ _id, name, bio, image }) {
  return (
    <Card>
      <div>
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="aspect-video w-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription className="line-clamp-2">{bio}</CardDescription>
      </CardHeader>
      {/* <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link to={`/instructors/${id}`}>View Profile</Link>
        </Button>
      </CardFooter> */}
    </Card>
  );
}
