import { Calendar, Clock, Users, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAtom } from "jotai";
import { eventAtom, userAtom } from "@/atom/userAtoms";
import { useClerk } from "@clerk/clerk-react";
import EventCard from "@/components/EventCard";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CreateAdmin from "@/components/CreateAdmin";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUser] = useAtom(userAtom);
  const isUser = userData?.role === "USER";
  const isInstructor = userData?.role === "INSTRUCTOR";
  const isAdmin = userData?.role === "ADMIN";
  const { signOut } = useClerk();
  const [events] = useAtom(eventAtom);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(
    isUser ? "myBookings" : "upcoming"
  );

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/bookings/${userData._id}`
      );
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      setBookings(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format time
  const formatTime = (time) => {
    try {
      const [hours, minutes] = time.split(":");
      const timeObj = new Date();
      timeObj.setHours(parseInt(hours));
      timeObj.setMinutes(parseInt(minutes));
      return timeObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return time;
    }
  };

  useEffect(() => {
    if (!userData) {
      navigate("/login");
    }
  }, [userData, navigate]);

  useEffect(() => {
    if (activeTab === "myBookings") {
      fetchBookings();
    }
  }, [activeTab]);

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-shrink-0">
            <img
              src={userData?.photoUrl || "/placeholder.svg"}
              alt={userData?.name}
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{userData?.name}</h1>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {userData?.email}
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {userData?.phone}
              </div>
            </div>
            {!isUser && (
              <p className="mt-4 text-muted-foreground">{userData?.role}</p>
            )}
            {isAdmin && (
             <div> <Button onClick={() => setIsOpen(true)}>Create Admin</Button>
             <Link to="/admin">
              <Button variant="secondary">Manage Admin</Button>
             </Link>
             </div>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                setUser(null);
                signOut();
                navigate("/");
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="myBookings">My Bookings</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
            {isInstructor && (
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="myBookings">
            {loading ? (
              <p>Loading bookings...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : bookings.length === 0 ? (
              <p className="text-center text-xl text-gray-500">
                No bookings available.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {bookings.map((booking) => (
                  <Card className="overflow-hidden" key={booking._id}>
                    <img
                      src={booking.event.image || "/placeholder.svg"}
                      alt={booking.event.title}
                      className="aspect-video w-full object-cover"
                    />

                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="line-clamp-1">
                          {booking.event.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {booking.event.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="grid gap-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4" />
                          {formatDate(booking.event.date)}
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-sm">
                            <Clock className="mr-2 h-4 w-4" />
                            Available Time Slots:
                          </div>
                          <p>
                            {formatTime(booking.timeSlot.startTime)} -{" "}
                            {formatTime(booking.timeSlot.endTime)}
                          </p>
                        </div>

                        <div className="flex items-center text-sm">
                          <Users className="mr-2 h-4 w-4" />
                          {booking.event.availableSeats} seats available
                        </div>

                        <div className="text-lg font-bold">
                          $
                          {typeof booking.event.price === "number"
                            ? booking.event.price.toFixed(2)
                            : booking.event.price}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            {events.length === 0 ? (
              <p className="text-center text-xl text-gray-500">
                No upcoming events.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <EventCard key={event._id} {...event} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {events.length === 0 ? (
              <p className="text-center text-xl text-gray-500">
                No past events.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <EventCard key={event._id} {...event} />
                ))}
              </div>
            )}
          </TabsContent>

          {isInstructor && (
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Event Analytics</CardTitle>
                  <CardDescription>View event statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Analytics coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
      <CreateAdmin isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
