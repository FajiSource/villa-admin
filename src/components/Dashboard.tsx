import { FaBed, FaCalendar, FaStar } from 'react-icons/fa6';
import Header from './customs/Header';
import BookingsLineChart from './ui/BookingsLineChart';
import { useGetBookingsTodayCount, useGetFeedbackStatistics } from '../lib/react-query/QueriesAndMutation';
import { LatestUsers } from './LatestUsers';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { useGetAccommodations } from '../lib/react-query/QueriesAndMutation';



export function Dashboard() {
  const { data: bookingCount, isLoading: loadingBookings } = useGetBookingsTodayCount();
  const { data: accommodations } = useGetAccommodations();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('yearly');
  const [showTodayBookings, setShowTodayBookings] = useState(false);
  const [showAvailableRooms, setShowAvailableRooms] = useState(false);
  const { data: feedbackStats, isLoading: loadingStats } = useGetFeedbackStatistics(selectedYear);

  // Get available accommodations (not currently booked)
  const today = new Date().toISOString().split('T')[0];
  const availableAccommodations = accommodations?.filter(acc => {
    // Check if accommodation has active bookings
    const hasActiveBooking = bookingCount?.today_bookings_list?.some((booking: any) => {
      return booking.accommodation_name === acc.name && 
             booking.status === 'approved' &&
             booking.check_in <= today &&
             booking.check_out >= today;
    });
    return !hasActiveBooking;
  }) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full w-full p-8 bg-gradient-to-br from-slate-50 to-blue-50 overflow-auto">
      <Header title="Welcome back, Admin!" />
      <section className="flex flex-1 flex-col relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 w-full">
          <div className="bg-white shadow-lg p-4 flex items-center gap-3 h-30 rounded-lg">
            <FaCalendar className="text-3xl border-r border-slate-200 pr-2" style={{ color: 'var(--primary-color) ' }} />
            <div>
              <p className="text-gray-500 text-sm">Bookings</p>
              <p className="text-xl font-bold text-gray-800 text-[var(--primary-color)]">{bookingCount?.bookings}</p>
            </div>
          </div>
          <div 
            className="bg-white shadow-lg p-4 flex items-center gap-3 h-30 rounded-lg cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105"
            onClick={() => setShowTodayBookings(true)}
          >
            <FaCalendar className="text-3xl border-r border-slate-200 pr-2" style={{ color: 'var(--primary-color)' }} />
            <div className="flex-1">
              <p className="text-gray-500 text-sm">Today's Bookings</p>
              <p className="text-xl font-bold text-gray-800">
                {loadingBookings ? '...' : (bookingCount?.today_count || 0)}
              </p>
            </div>
            <FaCalendar className="text-sm text-gray-400" />
          </div>
          <div 
            className="bg-white shadow-lg p-4 flex items-center gap-3 rounded-lg cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105"
            onClick={() => setShowAvailableRooms(true)}
          >
            <FaBed className="text-3xl text-green-400 border-r border-slate-200 pr-2" />
            <div className="flex-1">
              <p className="text-gray-500 text-sm">Available Rooms</p>
              <p className="text-xl font-bold text-gray-800">
                {loadingBookings ? '...' : (bookingCount?.rooms || 0)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                of {bookingCount?.total_rooms || 0} total
              </p>
            </div>
            <FaBed className="text-sm text-gray-400" />
          </div>
          <div className="bg-white shadow-lg p-4 flex items-center gap-3 rounded-lg">
            <FaStar className="text-3xl text-yellow-400 border-r border-slate-200 pr-2" />
            <div>
              <p className="text-gray-500 text-sm">Avg Rating ({selectedYear})</p>
              <p className="text-xl font-bold text-gray-800">
                {loadingStats ? '...' : feedbackStats?.data?.average_rating?.toFixed(1) || '0.0'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Feedback Statistics Section */}
        <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800" style={{ color: 'var(--primary-color)' }}>
              Customer Feedback Statistics
            </h2>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            >
              {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          {loadingStats ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)]"></div>
            </div>
          ) : feedbackStats?.data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Average Rating</span>
                    <FaStar className="text-yellow-400" />
                  </div>
                  <p className="text-3xl font-bold" style={{ color: 'var(--primary-color)' }}>
                    {feedbackStats.data.average_rating?.toFixed(2) || '0.00'}
                    <span className="text-lg text-gray-600">/5.00</span>
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Feedback</span>
                    <span className="text-2xl">📝</span>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: 'var(--primary-color)' }}>
                    {feedbackStats.data.total_feedback || 0}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Rating Distribution</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = feedbackStats.data.rating_distribution?.[`${rating}_star_count`] || 0;
                      const total = feedbackStats.data.total_feedback || 1;
                      const percentage = total > 0 ? (count / total) * 100 : 0;
                      
                      return (
                        <div key={rating} className="flex items-center gap-2">
                          <div className="flex items-center gap-1 w-16">
                            <span className="text-sm font-medium text-gray-600">{rating}</span>
                            <FaStar className="text-yellow-400 text-xs" />
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No feedback data available for {selectedYear}</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800" style={{ color: 'var(--primary-color)' }}>
              Bookings Report
            </h2>
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <BookingsLineChart period={reportPeriod} />
        </div>
        <LatestUsers />

      </section>

      {/* Today's Bookings Modal */}
      <Dialog open={showTodayBookings} onOpenChange={setShowTodayBookings}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FaCalendar style={{ color: 'var(--primary-color)' }} />
              Today's Bookings ({bookingCount?.today_count || 0})
            </DialogTitle>
            <DialogDescription>
              Bookings with check-in, check-out, or created today
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-3">
            {loadingBookings ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)]"></div>
              </div>
            ) : bookingCount?.today_bookings_list && bookingCount.today_bookings_list.length > 0 ? (
              bookingCount.today_bookings_list.map((booking: any) => (
                <div 
                  key={booking.id} 
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-800">{booking.accommodation_name}</h3>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Guest:</span> {booking.user_name}
                        </div>
                        <div>
                          <span className="font-medium">Check-in:</span> {formatDate(booking.check_in)}
                        </div>
                        <div>
                          <span className="font-medium">Check-out:</span> {formatDate(booking.check_out)}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {formatDate(booking.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaCalendar className="text-4xl mx-auto mb-2 text-gray-300" />
                <p>No bookings for today</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Available Rooms Modal */}
      <Dialog open={showAvailableRooms} onOpenChange={setShowAvailableRooms}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FaBed className="text-green-500" />
              Available Rooms ({bookingCount?.rooms || 0})
            </DialogTitle>
            <DialogDescription>
              Accommodations currently available for booking
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Rooms:</span>
                  <span className="ml-2 font-semibold">{bookingCount?.total_rooms || 0}</span>
                </div>
                <div>
                  <span className="text-gray-600">Booked:</span>
                  <span className="ml-2 font-semibold text-red-600">{bookingCount?.booked_rooms || 0}</span>
                </div>
                <div>
                  <span className="text-gray-600">Available:</span>
                  <span className="ml-2 font-semibold text-green-600">{bookingCount?.rooms || 0}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {loadingBookings ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)]"></div>
                </div>
              ) : availableAccommodations.length > 0 ? (
                availableAccommodations.map((acc: any) => (
                  <div 
                    key={acc.id} 
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-800">{acc.name}</h3>
                          <Badge className="bg-green-100 text-green-800">
                            Available
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Type:</span> {acc.type}
                          </div>
                          <div>
                            <span className="font-medium">Capacity:</span> {acc.maxGuests || acc.capacity} guests
                          </div>
                          <div>
                            <span className="font-medium">Price:</span> ₱{parseFloat(acc.price || acc.price_per_night || 0).toLocaleString()}/night
                          </div>
                          <div>
                            <span className="font-medium">Status:</span> {acc.status || 'Available'}
                          </div>
                        </div>
                        {acc.amenities && acc.amenities.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {acc.amenities.slice(0, 3).map((amenity: any, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {typeof amenity === 'string' ? amenity : amenity.name}
                              </Badge>
                            ))}
                            {acc.amenities.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{acc.amenities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaBed className="text-4xl mx-auto mb-2 text-gray-300" />
                  <p>No available rooms at the moment</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}