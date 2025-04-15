import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { instructorAtom } from "@/atom/userAtoms";
import { useAtom } from "jotai";

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useAtom(instructorAtom);

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Manage Instructors
        </h1>
        <Button asChild>
          <Link to="/admin/instructors/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Instructor
          </Link>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Events</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instructors.map((instructor) => (
              <TableRow key={instructor._id}>
                <TableCell className="font-medium">{instructor.name}</TableCell>
                <TableCell>{instructor.email}</TableCell>
                <TableCell>{instructor.specialization}</TableCell>
                <TableCell>{instructor.events}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/instructors/${instructor._id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
