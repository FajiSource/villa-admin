import React, { useEffect, useState } from "react";
import {
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";
import Header from "./customs/Header";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import apiService from "../services/apiService";
import { useToast } from "../contexts/ToastContext";

interface RescheduleRequest {
  id: number;
  booking_id: number;
  new_check_in: string;
  new_check_out: string;
  reason?: string;
  status: "pending" | "approved" | "declined";
  created_at: string;
  responded_at?: string;
  responded_by?: number;
  booking?: {
    id: number;
    name: string;
    contact: string;
    check_in: string;
    check_out: string;
    status: string;
    user?: {
      id: number;
      name: string;
      email: string;
    };
  };
  responder?: {
    id: number;
    name: string;
  };
}

export function RescheduleRequests() {
  const { addToast } = useToast();
  const [requests, setRequests] = useState<RescheduleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingRequest, setProcessingRequest] = useState<number | null>(
    null
  );
  const [selectedRequest, setSelectedRequest] =
    useState<RescheduleRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchRescheduleRequests();
  }, []);

  const fetchRescheduleRequests = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("/api/reschedule-requests");
      if (res.data.success) {
        setRequests(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching reschedule requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    setProcessingRequest(requestId);
    try {
      const res = await apiService.post(
        `/api/reschedule-requests/${requestId}/approve`
      );
      if (res.data.success) {
        addToast("success", "Reschedule request approved successfully!");
        fetchRescheduleRequests();
      } else {
        addToast("danger", res.data.message || "Failed to approve request");
      }
    } catch (error: any) {
      console.error("Error approving reschedule request:", error);
      addToast(
        "danger",
        error.response?.data?.error || "Failed to approve reschedule request"
      );
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleDecline = async (requestId: number) => {
    setProcessingRequest(requestId);
    try {
      const res = await apiService.post(
        `/api/reschedule-requests/${requestId}/decline`
      );
      if (res.data.success) {
        addToast("success", "Reschedule request declined successfully!");
        fetchRescheduleRequests();
      } else {
        addToast("danger", res.data.message || "Failed to decline request");
      }
    } catch (error: any) {
      console.error("Error declining reschedule request:", error);
      addToast(
        "danger",
        error.response?.data?.error || "Failed to decline reschedule request"
      );
    } finally {
      setProcessingRequest(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 ">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "declined":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Declined
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const processedRequests = requests.filter((r) => r.status !== "pending");

  if (loading) {
    return (
      <div className="h-full w-full p-8! bg-pelagic-gradient-light overflow-auto">
        <Header title="Reschedule Requests" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)] mx-auto mb-4"></div>
            <p className="text-slate-600">Loading reschedule requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-pelagic-gradient-light overflow-auto">
      <Header title="Reschedule Requests" />

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div
          className="mb-8 px-10! py-5! relative"
          style={{ marginTop: "20px", padding: "20px" }}
        >
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--primary-color)" }}
          >
            Pending Requests ({pendingRequests.length})
          </h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 px-10! py-5!">
            {pendingRequests.map((request) => (
              <Card
                key={request.id}
                className="group hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-[var(--primary-color)]/30 bg-white"
              >
                <CardContent className="p-6!">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">
                        Booking #{request.booking_id}
                      </h3>
                      {request.booking?.user && (
                        <p className="text-sm text-slate-500 mt-1">
                          {request.booking.user.name} (
                          {request.booking.user.email})
                        </p>
                      )}
                    </div>
                    <div className="mt-2" style={{ marginTop: "10px" }}>
                      {getStatusBadge(request.status)}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="bg-slate-50 rounded-lg p-3!">
                      <p className="text-xs text-slate-500 mb-1">
                        Current Dates
                      </p>
                      <p className="text-sm font-medium text-slate-900">
                        {request.booking
                          ? formatDate(request.booking.check_in)
                          : "N/A"}{" "}
                        -{" "}
                        {request.booking
                          ? formatDate(request.booking.check_out)
                          : "N/A"}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3! border border-green-200">
                      <p className="text-xs text-green-700 mb-1 font-medium">
                        Requested New Dates
                      </p>
                      <p className="text-sm font-medium text-green-900">
                        {formatDate(request.new_check_in)} -{" "}
                        {formatDate(request.new_check_out)}
                      </p>
                    </div>
                  </div>

                  {request.reason && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText
                          className="w-4 h-4"
                          style={{ color: "var(--primary-color)" }}
                        />
                        <span className="text-sm font-medium text-slate-700">
                          Reason
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 bg-slate-50 rounded p-2!">
                        {request.reason}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4! border-t border-slate-100">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApprove(request.id)}
                      disabled={processingRequest === request.id}
                      className="flex-1 resort-gradient-primary text-white hover:opacity-90"
                    >
                      {processingRequest === request.id ? (
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
                      onClick={() => handleDecline(request.id)}
                      disabled={processingRequest === request.id}
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 hover:text-red-700"
                    >
                      {processingRequest === request.id ? (
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div
          className="px-10! py-5! relative"
          style={{ marginTop: "20px", padding: "15px" }}
        >
          <h2
            className="text-2xl font-bold mb-4 mt-5 ml-5"
            style={{ color: "var(--primary-color)" }}
          >
            Processed Requests ({processedRequests.length})
          </h2>
          <div className="bg-red-50 p-4! rounded-lg mb-6 mx-10">
            {processedRequests.map((request) => (
              <Card key={request.id} className="border-slate-200 bg-white mb-4">
                <CardContent className="p-6!">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">
                        Booking #{request.booking_id}
                      </h3>
                      {request.booking?.user && (
                        <p className="text-sm text-slate-500 mt-1">
                          {request.booking.user.name}
                        </p>
                      )}
                    </div>
                    <div className="mt-2" style={{ marginTop: "10px" }}>
                      {getStatusBadge(request.status)}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="text-sm">
                      <span className="text-slate-500">Requested:</span>
                      <p className="font-medium text-slate-900">
                        {formatDate(request.new_check_in)} -{" "}
                        {formatDate(request.new_check_out)}
                      </p>
                    </div>
                    {request.responded_at && (
                      <div className="text-xs text-slate-500">
                        {request.status === "approved"
                          ? "Approved"
                          : "Declined"}{" "}
                        on {formatDateTime(request.responded_at)}
                        {request.responder && ` by ${request.responder.name}`}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {requests.length === 0 && (
        <Card className="text-center py-16! border-slate-200">
          <CardContent className="space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">
              No reschedule requests
            </h3>
            <p className="text-slate-500">
              All reschedule requests have been processed
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
