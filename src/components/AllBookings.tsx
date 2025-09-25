import React, { useEffect, useState } from 'react';
import { Filter, Search, Calendar, User, Bed, MapPin, Phone, DollarSign } from 'lucide-react';
import Header from './customs/Header';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import apiService from '../services/apiService';



export function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiService.get('/admin/bookings');
        if (res.data.success) {
          setBookings(res.data.data);
          setFilteredBookings(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const formatBookingDate = (dateString) => {
    const bookingDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);
    const diffDays = (today - bookingDate) / (1000 * 60 * 60 * 24);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return bookingDate.toLocaleDateString();
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    applyFilters(value, searchTerm);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters(filter, value);
  };

  const applyFilters = (filterValue, searchValue) => {
    let filtered = [...bookings];

    // Apply date filter
    if (filterValue === 'today') {
      filtered = filtered.filter(b => {
        const bookingDate = new Date(b.booking_date);
        const today = new Date();
        return bookingDate.toDateString() === today.toDateString();
      });
    } else if (filterValue === 'yesterday') {
      filtered = filtered.filter(b => {
        const bookingDate = new Date(b.booking_date);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return bookingDate.toDateString() === yesterday.toDateString();
      });
    }

    // Apply search filter
    if (searchValue) {
      filtered = filtered.filter(b => 
        b.customer_name.toLowerCase().includes(searchValue.toLowerCase()) ||
        b.contact_number.includes(searchValue) ||
        (b.room_type && b.room_type.toLowerCase().includes(searchValue.toLowerCase())) ||
        (b.cottage_type && b.cottage_type.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }

    setFilteredBookings(filtered);
  };

  const getStatusBadge = (checkIn, checkOut) => {
    const today = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (today < checkInDate) {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Upcoming</Badge>;
    } else if (today >= checkInDate && today <= checkOutDate) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Completed</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full p-8 bg-pelagic-gradient-light overflow-auto">
        <Header title="Booking Records" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3770bd] mx-auto mb-4"></div>
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
                className="pl-10 border-slate-200 focus:border-[#3770bd] focus:ring-[#3770bd]"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => handleFilterChange('all')}
                className={filter === 'all' ? 'pelagic-gradient-primary text-white' : 'border-slate-200 text-slate-600 hover:border-[#3770bd]'}
              >
                <Filter className="w-4 h-4 mr-2" />
                All
              </Button>
              <Button
                variant={filter === 'today' ? 'default' : 'outline'}
                onClick={() => handleFilterChange('today')}
                className={filter === 'today' ? 'pelagic-gradient-primary text-white' : 'border-slate-200 text-slate-600 hover:border-[#3770bd]'}
              >
                Today
              </Button>
              <Button
                variant={filter === 'yesterday' ? 'default' : 'outline'}
                onClick={() => handleFilterChange('yesterday')}
                className={filter === 'yesterday' ? 'pelagic-gradient-primary text-white' : 'border-slate-200 text-slate-600 hover:border-[#3770bd]'}
              >
                Yesterday
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-slate-600">
            <span className="font-medium text-[#3770bd]">{filteredBookings.length}</span> bookings found
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
            <h3 className="text-xl font-semibold text-slate-900">No bookings found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="group hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-[#3770bd]/30 bg-white">
              <CardContent className="p-6">
                {/* Header with Name and Status */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg group-hover:text-[#3770bd] transition-colors">
                      {booking.customer_name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Booked {formatBookingDate(booking.booking_date)}
                    </p>
                  </div>
                  {getStatusBadge(booking.check_in, booking.check_out)}
                </div>

                {/* Contact Info */}
                <div className="flex items-center gap-2 mb-4 text-slate-600">
                  <Phone className="w-4 h-4 text-[#3770bd]" />
                  <span className="text-sm">{booking.contact_number}</span>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Check In</p>
                    <p className="font-medium text-slate-900">{new Date(booking.check_in).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Check Out</p>
                    <p className="font-medium text-slate-900">{new Date(booking.check_out).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Accommodation Details */}
                <div className="space-y-3 mb-4">
                  {booking.room_type && (
                    <div className="flex items-center gap-3">
                      <Bed className="w-4 h-4 text-[#3770bd]" />
                      <span className="text-sm text-slate-600">
                        {booking.room_type} ({booking.room_quantity})
                      </span>
                    </div>
                  )}
                  {booking.cottage_type && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-[#3770bd]" />
                      <span className="text-sm text-slate-600">
                        {booking.cottage_type} ({booking.cottage_quantity})
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-[#3770bd]" />
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
                        ₱{parseFloat(booking.total_amount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}