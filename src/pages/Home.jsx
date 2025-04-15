import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import {
  instructorAtom,
  eventAtom,
  clubsListAtom,
  userAtom,
} from "@/atom/userAtoms";
import { useUser } from "@clerk/clerk-react";
import { EventCard } from "@/components/EventCard";
import { ClubCard } from "@/components/ClubCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Toast } from "@/components/ui/toast";

const bannerImages = [
  "https://images.pexels.com/photos/9005485/pexels-photo-9005485.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://img.freepik.com/free-psd/banner-template-concert_23-2148403186.jpg?t=st=1740513424~exp=1740517024~hmac=f92e911059661e78161add02da5ce2ef224ccc988053132423217ee81ccdc3eb&w=1380",
];

const Home = () => {
  const navigate = useNavigate();
  const [clubs] = useAtom(clubsListAtom);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isLoaded, isSignedIn, user } = useUser();
  const [userData, setUserData] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);
  let intervalId = null;

  useEffect(() => {
    if (userData !== null) return; // Only run if userData is null

    if (!isLoaded || !isSignedIn) return; // Ensure Clerk is fully loaded
    console.log(userData);
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const email = user?.primaryEmailAddress?.emailAddress;

        if (!email) {
          throw new Error("Email not found");
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/profile/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to sync user with backend."
          );
        }

        const userData = await response.json();
        console.log("User Data:", userData.data);
        setUserData(userData.data); // Set user data once
      } catch (error) {
        Toast({
          title: "Error",
          description: error.message || "Failed to load user data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userData, setUserData]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + bannerImages.length) % bannerImages.length
    );
  };

  return (
    <div className="container py-8">
      <Card className="relative w-full h-96 overflow-hidden my-6">
        <CardContent className="relative w-full h-full">
          <img
            src={bannerImages[currentIndex]}
            alt={`Banner ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="bg-white/80"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNext}
              className="bg-white/80"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {clubs.length === 0 ? (
        <p className="text-center text-xl text-gray-500">No clubs available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => (
            <ClubCard key={club._id} {...club} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
