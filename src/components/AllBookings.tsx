import React, { useEffect, useState } from "react";
import {
  Filter,
  Search,
  Calendar,
  User,
  Bed,
  MapPin,
  Phone,
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";
import Header from "./customs/Header";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import apiService from "../services/apiService";
import { useToast } from "../contexts/ToastContext";

type Booking = {
  id: number | string;
  customer_name: string;
  contact_number: string;
  booking_date: string;
  check_in: string;
  check_out: string;
  room_type?: string | null;
  room_quantity?: number | null;
  cottage_type?: string | null;
  cottage_quantity?: number | null;
  entrance_guests?: number | null;
  total_amount: number | string;
  payment_proof?: string | null;
  payment_proof_url?: string | null;
  proof_of_payment?: string | null;
  proof_of_payment_url?: string | null;
  paymentProof?: string | null;
  paymentProofUrl?: string | null;
  proofOfPayment?: string | null;
  proofOfPaymentUrl?: string | null;
  image?: string | null;
  status?: string | null;
  booking_status?: string | null;
  is_approved?: number | null;
  accommodation_id: number | string | null;
  feedback?: {
    rating: number;
    comment?: string;
    created_at: string;
  } | null;
};

type DateFilter = "all" | "today" | "yesterday";

export function AllBookings() {
  const { addToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DateFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [processingBooking, setProcessingBooking] = useState<
    number | string | null
  >(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiService.get("/api/bookings");
        if (res.data.success) {
          setBookings(res.data.data);
          setFilteredBookings(res.data.data);
          console.log("Fetched bookings:", res.data.data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const formatBookingDate = (dateString: string) => {
    const bookingDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);
    const diffDays =
      (today.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return bookingDate.toLocaleDateString();
  };

  const handleFilterChange = (value: DateFilter) => {
    setFilter(value);
    applyFilters(value, searchTerm);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(filter, value);
  };

  const applyFilters = (filterValue: DateFilter, searchValue: string) => {
    let filtered = [...bookings];

    // Apply date filter
    if (filterValue === "today") {
      filtered = filtered.filter((b) => {
        const bookingDate = new Date(b.booking_date);
        const today = new Date();
        return bookingDate.toDateString() === today.toDateString();
      });
    } else if (filterValue === "yesterday") {
      filtered = filtered.filter((b) => {
        const bookingDate = new Date(b.booking_date);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return bookingDate.toDateString() === yesterday.toDateString();
      });
    }

    // Apply search filter
    if (searchValue) {
      filtered = filtered.filter(
        (b) =>
          b.customer_name.toLowerCase().includes(searchValue.toLowerCase()) ||
          b.contact_number.includes(searchValue) ||
          (b.room_type &&
            b.room_type.toLowerCase().includes(searchValue.toLowerCase())) ||
          (b.cottage_type &&
            b.cottage_type.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }

    setFilteredBookings(filtered);
  };

  const getStatusBadge = (checkIn: string, checkOut: string) => {
    const today = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (today < checkInDate) {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Upcoming
        </Badge>
      );
    } else if (today >= checkInDate && today <= checkOutDate) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Active
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          Completed
        </Badge>
      );
    }
  };

  const getBookingStatus = (
    booking: Booking
  ): "approved" | "declined" | "pending" | "cancelled" => {
    // Check various possible status fields
    const status = (
      booking.status ||
      booking.booking_status ||
      "pending"
    ).toLowerCase();
    if (status === "approved") return "approved";
    if (status === "declined") return "declined";
    if (status === "cancelled" || status === "canceled") return "cancelled";
    return "pending";
  };

  const handleApprove = async (bookingId: number | string) => {
    setProcessingBooking(bookingId);
    try {
      const res = await apiService.post(`/api/bookings/${bookingId}/approve`);
      if (res.data.success) {
        addToast("success", "Booking approved successfully!");
        // Refresh bookings
        const refreshRes = await apiService.get("/api/bookings");
        if (refreshRes.data.success) {
          const updatedBookings = refreshRes.data.data;
          setBookings(updatedBookings);
          // Reapply filters with updated data
          let filtered = [...updatedBookings];

          // Apply date filter
          if (filter === "today") {
            filtered = filtered.filter((b) => {
              const bookingDate = new Date(b.booking_date);
              const today = new Date();
              return bookingDate.toDateString() === today.toDateString();
            });
          } else if (filter === "yesterday") {
            filtered = filtered.filter((b) => {
              const bookingDate = new Date(b.booking_date);
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              return bookingDate.toDateString() === yesterday.toDateString();
            });
          }

          // Apply search filter
          if (searchTerm) {
            filtered = filtered.filter(
              (b) =>
                b.customer_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                b.contact_number.includes(searchTerm) ||
                (b.room_type &&
                  b.room_type
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())) ||
                (b.cottage_type &&
                  b.cottage_type
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()))
            );
          }

          setFilteredBookings(filtered);
        }
      } else {
        addToast("danger", res.data.message || "Failed to approve booking");
      }
    } catch (error: any) {
      console.error("Error approving booking:", error);
      addToast(
        "danger",
        error.response?.data?.message || "Failed to approve booking"
      );
    } finally {
      setProcessingBooking(null);
    }
  };

  const handleDecline = async (bookingId: number | string) => {
    setProcessingBooking(bookingId);
    try {
      const res = await apiService.post(`/api/bookings/${bookingId}/decline`);
      if (res.data.success) {
        addToast("success", "Booking declined successfully!");
        // Refresh bookings
        const refreshRes = await apiService.get("/api/bookings");
        if (refreshRes.data.success) {
          const updatedBookings = refreshRes.data.data;
          setBookings(updatedBookings);
          // Reapply filters with updated data
          let filtered = [...updatedBookings];

          // Apply date filter
          if (filter === "today") {
            filtered = filtered.filter((b) => {
              const bookingDate = new Date(b.booking_date);
              const today = new Date();
              return bookingDate.toDateString() === today.toDateString();
            });
          } else if (filter === "yesterday") {
            filtered = filtered.filter((b) => {
              const bookingDate = new Date(b.booking_date);
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              return bookingDate.toDateString() === yesterday.toDateString();
            });
          }

          // Apply search filter
          if (searchTerm) {
            filtered = filtered.filter(
              (b) =>
                b.customer_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                b.contact_number.includes(searchTerm) ||
                (b.room_type &&
                  b.room_type
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())) ||
                (b.cottage_type &&
                  b.cottage_type
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()))
            );
          }

          setFilteredBookings(filtered);
        }
      } else {
        addToast("danger", res.data.message || "Failed to decline booking");
      }
    } catch (error: any) {
      console.error("Error declining booking:", error);
      addToast(
        "danger",
        error.response?.data?.message || "Failed to decline booking"
      );
    } finally {
      setProcessingBooking(null);
    }
  };

  const handleCancel = async (bookingId: number | string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setProcessingBooking(bookingId);
    try {
      const res = await apiService.delete(`/api/bookings/${bookingId}`);
      if (res.data.success) {
        addToast("success", "Booking cancelled successfully!");
        // Refresh bookings
        const refreshRes = await apiService.get("/api/bookings");
        if (refreshRes.data.success) {
          const updatedBookings = refreshRes.data.data;
          setBookings(updatedBookings);
          // Reapply filters with updated data
          let filtered = [...updatedBookings];

          // Apply date filter
          if (filter === "today") {
            filtered = filtered.filter((b) => {
              const bookingDate = new Date(b.booking_date);
              const today = new Date();
              return bookingDate.toDateString() === today.toDateString();
            });
          } else if (filter === "yesterday") {
            filtered = filtered.filter((b) => {
              const bookingDate = new Date(b.booking_date);
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              return bookingDate.toDateString() === yesterday.toDateString();
            });
          }

          // Apply search filter
          if (searchTerm) {
            filtered = filtered.filter(
              (b) =>
                b.customer_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                b.contact_number.includes(searchTerm) ||
                (b.room_type &&
                  b.room_type
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())) ||
                (b.cottage_type &&
                  b.cottage_type
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()))
            );
          }

          setFilteredBookings(filtered);
        }
      } else {
        addToast("danger", res.data.message || "Failed to cancel booking");
      }
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      addToast(
        "danger",
        error.response?.data?.message || "Failed to cancel booking"
      );
    } finally {
      setProcessingBooking(null);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full p-8 bg-pelagic-gradient-light overflow-auto">
        <Header title="Booking Records" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)] mx-auto mb-4"></div>
            <p className="text-slate-600">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-8 bg-pelagic-gradient-light overflow-auto">
      <Header title="Booking Records" />

      {/* Controls Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-white/20">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 border-slate-200 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => handleFilterChange("all")}
                className={
                  filter === "all"
                    ? "resort-gradient-primary text-white"
                    : "border-slate-200 text-slate-600 hover:border-[var(--primary-color)]"
                }
              >
                <Filter className="w-4 h-4 mr-2" />
                All
              </Button>
              <Button
                variant={filter === "today" ? "default" : "outline"}
                onClick={() => handleFilterChange("today")}
                className={
                  filter === "today"
                    ? "resort-gradient-primary text-white"
                    : "border-slate-200 text-slate-600 hover:border-[var(--primary-color)]"
                }
              >
                Today
              </Button>
              <Button
                variant={filter === "yesterday" ? "default" : "outline"}
                onClick={() => handleFilterChange("yesterday")}
                className={
                  filter === "yesterday"
                    ? "resort-gradient-primary text-white"
                    : "border-slate-200 text-slate-600 hover:border-[var(--primary-color)]"
                }
              >
                Yesterday
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-slate-600">
            <span className="font-medium text-[var(--primary-color)]">
              {filteredBookings.length}
            </span>{" "}
            bookings found
          </div>
        </div>
      </div>

      {/* Bookings Grid */}
      {filteredBookings.length === 0 ? (
        <Card className="text-center py-16 border-slate-200">
          <CardContent className="space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">
              No bookings found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredBookings.map((booking) => (
            <Card
              key={booking.id}
              className="group hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-[var(--primary-color)]/30 bg-white"
            >
              <CardContent className="p-6">
                {/* Header with Name and Status */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg group-hover:text-[var(--primary-color)] transition-colors">
                      {booking.customer_name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Booked {formatBookingDate(booking.booking_date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Trip state badge */}
                    {getStatusBadge(booking.check_in, booking.check_out)}
                    {/* Approval status badge */}
                    {(() => {
                      const s = getBookingStatus(booking);
                      if (s === "approved") {
                        return (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Approved
                          </Badge>
                        );
                      }
                      if (s === "declined") {
                        return (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            Declined
                          </Badge>
                        );
                      }
                      if (s === "cancelled") {
                        return (
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                            Cancelled
                          </Badge>
                        );
                      }
                      return (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          Pending
                        </Badge>
                      );
                    })()}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex items-center gap-2 mb-4 text-slate-600">
                  <Phone
                    className="w-4 h-4"
                    style={{ color: "var(--primary-color)" }}
                  />
                  <span className="text-sm">{booking.contact_number}</span>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Check In</p>
                    <p className="font-medium text-slate-900">
                      {new Date(booking.check_in).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Check Out</p>
                    <p className="font-medium text-slate-900">
                      {new Date(booking.check_out).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Accommodation Details */}
                <div className="space-y-3 mb-4">
                  {booking.room_type && (
                    <div className="flex items-center gap-3">
                      <Bed
                        className="w-4 h-4"
                        style={{ color: "var(--primary-color)" }}
                      />
                      <span className="text-sm text-slate-600">
                        {booking.room_type} ({booking.room_quantity})
                      </span>
                    </div>
                  )}
                  {booking.cottage_type && (
                    <div className="flex items-center gap-3">
                      <MapPin
                        className="w-4 h-4"
                        style={{ color: "var(--primary-color)" }}
                      />
                      <span className="text-sm text-slate-600">
                        {booking.cottage_type} ({booking.cottage_quantity})
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <User
                      className="w-4 h-4"
                      style={{ color: "var(--primary-color)" }}
                    />
                    <span className="text-sm text-slate-600">
                      {booking.entrance_guests} guests
                    </span>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Total Amount</span>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-bold text-lg text-slate-900">
                        ₱
                        {parseFloat(
                          String(booking.total_amount ?? 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Proof of Payment */}
                <div className="mt-4 w-[200px] border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm font-medium uppercase tracking-wide">
                      Proof of Payment
                    </span>
                    {booking.image ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-200 text-slate-700 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)]"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[80vh] overflow-auto">
                          <DialogHeader>
                            <DialogTitle>Proof of Payment</DialogTitle>
                          </DialogHeader>
                          <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                            <img
                              src={booking.image || ""}
                              alt={`Proof of payment for ${booking.customer_name}`}
                              className="w-full max-w-[50vh] max-h-[50vh] w-x-auto object-contain "
                              loading="lazy"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span className="text-xs text-slate-500 italic">
                        Not provided
                      </span>
                    )}
                  </div>
                </div>

                {/* Feedback Section */}
                {booking.feedback && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star
                          className="w-4 h-4"
                          style={{ color: "var(--primary-color)" }}
                        />
                        <span className="text-sm font-semibold text-green-800">
                          Customer Feedback
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= booking.feedback!.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-600">
                          ({booking.feedback.rating}/5)
                        </span>
                      </div>
                      {booking.feedback.comment && (
                        <p className="text-sm text-green-700 mb-2">
                          {booking.feedback.comment}
                        </p>
                      )}
                      <p className="text-xs text-slate-500">
                        Submitted on{" "}
                        {new Date(
                          booking.feedback.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {booking.status !== "completed" && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    {(() => {
                      const bookingStatus = getBookingStatus(booking);

                      // Show action buttons for pending bookings
                      if (bookingStatus === "pending") {
                        return (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApprove(booking.id)}
                              disabled={processingBooking === booking.id}
                              className="flex-1 resort-gradient-primary text-white hover:opacity-90"
                            >
                              {processingBooking === booking.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDecline(booking.id)}
                              disabled={processingBooking === booking.id}
                              className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 hover:text-red-700 flex items-center justify-center"
                            >
                              {processingBooking === booking.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Decline
                                </>
                              )}
                            </Button>
                          </div>
                        );
                      }

                      // Show cancel button for approved bookings (admin can cancel)
                      if (bookingStatus === "approved") {
                        return (
                          <div className="flex items-center justify-center gap-2">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-4 py-2 text-sm font-semibold">
                              <CheckCircle className="w-4 h-4 mr-2 inline" />
                              Approved
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancel(booking.id)}
                              disabled={processingBooking === booking.id}
                              className="border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 hover:text-orange-700"
                            >
                              {processingBooking === booking.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancel
                                </>
                              )}
                            </Button>
                          </div>
                        );
                      }

                      // Show status badge for declined or cancelled bookings
                      if (bookingStatus === "declined") {
                        return (
                          <div className="flex items-center justify-center">
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100 px-4 py-2 text-sm font-semibold">
                              <XCircle className="w-4 h-4 mr-2 inline" />
                              Declined
                            </Badge>
                          </div>
                        );
                      }

                      if (bookingStatus === "cancelled") {
                        return (
                          <div className="flex items-center justify-center">
                            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 px-4 py-2 text-sm font-semibold">
                              <XCircle className="w-4 h-4 mr-2 inline" />
                              Cancelled
                            </Badge>
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
