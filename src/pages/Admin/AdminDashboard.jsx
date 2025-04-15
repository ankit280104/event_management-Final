import { CalendarRange, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Admin Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Booking Management</CardTitle>
            <CardDescription>Manage your booking and schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link to="/admin/booking">
                <CalendarRange className="mr-2 h-4 w-4" />
                Manage Booking
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Event Management</CardTitle>
            <CardDescription>Manage your clubs and schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link to="/admin/clubs">
                <CalendarRange className="mr-2 h-4 w-4" />
                Manage Clubs
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Instructor Management</CardTitle>
            <CardDescription>
              Manage your instructors and presenters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link to="/admin/instructors">
                <Users className="mr-2 h-4 w-4" />
                Manage Instructors
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
