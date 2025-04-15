import React, { useState } from 'react';
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { clubsListAtom } from "@/atom/userAtoms";

export default function AdminClubsPage() {
  const [clubs, setClubs] = useAtom(clubsListAtom);
  const [clubToDelete, setClubToDelete] = useState(null);

  const handleDeleteClubs = async () => {
    if (!clubToDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/clubs/${clubToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete club");
      }

      // Update the state to remove the deleted club
      setClubs((prevClubs) => prevClubs.filter((club) => club._id !== clubToDelete));
      
      // Reset the clubToDelete state
      setClubToDelete(null);

      alert("Success: Club deleted successfully!");
    } catch (error) {
      console.error("Error deleting club:", error);
      alert("Error: Failed to delete club. Please try again.");
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Manage Clubs</h1>
        <Button asChild>
          <Link to="/admin/clubs/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Club
          </Link>
        </Button>
      </div>

      {clubs.length === 0 ? (
        <p className="text-center text-xl text-gray-500">No clubs available.</p>
      ) : (
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Image</th>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Add Events</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clubs.map((club) => (
                <tr key={club._id} className="border-b">
                  <td className="p-2 text-center">
                    <img
                      src={club.image || "https://via.placeholder.com/100"}
                      alt={club.title}
                      className="w-20 h-20 object-cover mx-auto"
                    />
                  </td>
                  <td className="p-2 font-medium">{club.title}</td>
                  <td className="p-2 truncate max-w-xs">{club.description}</td>
                  <td className="p-2">
                    <Link to={`/admin/events/${club._id}`} id="add-event-link">
                      <Plus className="mr-2 h-4 w-4 inline" />
                      Add Event
                    </Link>
                  </td>
                  <td className="p-2 text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setClubToDelete(club._id)}
                        >
                          <Trash2 />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the club
                            and remove its data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setClubToDelete(null)}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteClubs}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}