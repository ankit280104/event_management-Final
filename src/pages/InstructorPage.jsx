import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import { instructorAtom } from "@/atom/userAtoms"; // Fix: Updated import

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { InstructorCard } from "@/components/InstructorCard";

const bannerImages = [
  "https://img.freepik.com/free-vector/flat-design-theatre-show-webinar_23-2149830005.jpg?t=st=1740513558~exp=1740517158~hmac=4daa8514c947e565a25fcfaf3f9d959847cc078172eb28ce6ac69b49fb9bd022&w=1060",
  "https://images.pexels.com/photos/9005485/pexels-photo-9005485.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://img.freepik.com/free-psd/banner-template-concert_23-2148403186.jpg?t=st=1740513424~exp=1740517024~hmac=f92e911059661e78161add02da5ce2ef224ccc988053132423217ee81ccdc3eb&w=1380",
];

const InstructorPage = () => {

  const [instructors] = useAtom(instructorAtom);
  const [currentIndex, setCurrentIndex] = useState(0);
  let intervalId = null;



  useEffect(() => {
    intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const handleNext = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    resetInterval();
  };

  const handlePrevious = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + bannerImages.length) % bannerImages.length
    );
    resetInterval();
  };

  const resetInterval = () => {
    intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);
  };

  return (
    <div className="container py-8">
      <div>
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
      </div>

      {instructors.length === 0 ? (
        <p className="text-center text-xl text-gray-500">
          No events available for this club.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor) => (
            <InstructorCard key={instructor._id} {...instructor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorPage;
