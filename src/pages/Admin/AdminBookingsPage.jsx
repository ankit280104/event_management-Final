import React, { useState, useEffect } from "react";
import { Check, Search, Trash2, X, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { userAtom } from "@/atom/userAtoms";

const getStatusColor = (status) => {
  const statusColors = {
    CONFIRMED: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    CANCELLED: "bg-red-100 text-red-800",
    COMPLETED: "bg-blue-100 text-blue-800",
  };
  return statusColors[status] || "bg-gray-100 text-gray-800";
};

const getPaymentStatusColor = (status) => {
  const statusColors = {
    PAID: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    REFUNDED: "bg-purple-100 text-purple-800",
    FAILED: "bg-red-100 text-red-800",
  };
  return statusColors[status] || "bg-gray-100 text-gray-800";
};

export default function AdminBookingsPage() {
  const navigate = useNavigate();
  const [userData, setUser] = useAtom(userAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.user.name && 
       booking.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.user.email && 
       booking.user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/bookings/admin`,
        {
          headers: {
            'Content-Type': 'application/json',
            // Add any necessary authentication headers
          }
        }
      );
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      setBookings(data.data);
    } catch (err) {
      setError(err.message);
      console.error("Fetching bookings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userData) {
      navigate("/login");
    }
  }, [userData, navigate]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/bookings/${bookingId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            // Add any necessary authentication headers
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (!response.ok) throw new Error("Failed to update booking status");

      // Optimistically update the local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: newStatus } 
            : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update booking status");
    }
  };

  const BookingDetailsDialog = ({ booking }) => (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogDescription>
          Complete information about the booking
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium">Event</h4>
            <p>{booking.event.title}</p>
          </div>
          <div>
            <h4 className="font-medium">Date & Time</h4>
            <p>{new Date(booking.event.date).toLocaleDateString()}</p>
            <p>{booking.timeSlot.startTime} - {booking.timeSlot.endTime}</p>
          </div>
          <div>
            <h4 className="font-medium">User</h4>
            <p>{booking.user.name || 'N/A'}</p>
            <p className="text-sm text-gray-500">{booking.user.email || 'N/A'}</p>
          </div>
          <div>
            <h4 className="font-medium">Payment</h4>
            <p>${booking.event.price}</p>
            <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
              {booking.paymentStatus}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setSelectedBooking(null)}>
            Close
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  if (loading) return <div className="container py-8">Loading bookings...</div>;
  if (error) return <div className="container py-8">Error: {error}</div>;

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Manage Bookings</h1>
        <Button onClick={fetchBookings}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Event</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Date & Time</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Payment</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking._id} className="border-b">
                <td className="p-2 font-medium">
                  {booking.event.title}
                </td>
                <td className="p-2">
                  <div>{booking.user.name || 'N/A'}</div>
                  <div className="text-sm text-gray-500">
                    {booking.user.email || 'N/A'}
                  </div>
                </td>
                <td className="p-2">
                  <div>{new Date(booking.event.date).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-500">
                    {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                  </div>
                </td>
                <td className="p-2">
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </td>
                <td className="p-2">
                  <div>${booking.event.price}</div>
                  <Badge
                    className={getPaymentStatusColor(booking.paymentStatus)}
                  >
                    {booking.paymentStatus}
                  </Badge>
                </td>
                <td className="p-2 text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog
                      open={selectedBooking?._id === booking._id}
                      onOpenChange={() => setSelectedBooking(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      {selectedBooking && (
                        <BookingDetailsDialog booking={selectedBooking} />
                      )}
                    </Dialog>

                    {booking.status === "PENDING" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleStatusChange(booking._id, "CONFIRMED")
                          }
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleStatusChange(booking._id, "CANCELLED")
                          }
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </>
                    )}

                    {booking.status !== "PENDING" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleStatusChange(booking._id, "CANCELLED")
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}