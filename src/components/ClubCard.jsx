import { Calendar, Clock, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

export function ClubCard({ _id, title, description, image }) {
  return (
    <Card className="overflow-hidden">
      <div className="w-full aspect-[16/9]">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link to={`/club-events/${_id}`}>Select Event</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
