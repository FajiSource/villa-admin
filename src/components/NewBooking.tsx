import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  User,
  Phone,
  Calendar,
  Clock,
  Bed,
  Home,
  Users,
  Plus,
  Waves,
  Save
} from 'lucide-react';
import apiService from '../services/apiService';
import { useToast } from '../contexts/ToastContext';
import { useGetRoomTypes } from '../lib/react-query/QueriesAndMutation';

export function NewBooking() {
  const { addToast } = useToast();
  const { data: roomTypes, isLoading } = useGetRoomTypes();
 
  const [form, setForm] = useState({
    customer_name: '',
    contact_number: '',
    booking_date: '',
    check_in: '',
    check_out: '',
    room_type: '',
    room_quantity: 0,
    room_unit_price: 0,
    room_total: 0,
    cottage_type: '',
    cottage_quantity: 0,
    cottage_unit_price: 0,
    cottage_total: 0,
    entrance_guests: 0,
    entrance_fee_unit: 0,
    entrance_fee_total: 0,
    extra_hours: 0,
    extra_hours_unit: 0,
    extra_hours_total: 0,
    additional_services: '',
    additional_quantity: 0,
    additional_unit_price: 0,
    additional_total: 0,
    total_amount: 0
  });


  const handleChange = (name: string, value: string | number) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate totals
    calculateTotals(name, value);
  };

  const calculateTotals = (fieldName: string, value: string | number) => {
    // Auto-calculation logic for totals
    const updatedForm = { ...form, [fieldName]: value };

    // Calculate room total
    if (fieldName === 'room_quantity' || fieldName === 'room_unit_price') {
      updatedForm.room_total = Number(updatedForm.room_quantity) * Number(updatedForm.room_unit_price);
    }

    // Calculate cottage total
    if (fieldName === 'cottage_quantity' || fieldName === 'cottage_unit_price') {
      updatedForm.cottage_total = Number(updatedForm.cottage_quantity) * Number(updatedForm.cottage_unit_price);
    }

    // Calculate entrance fee total
    if (fieldName === 'entrance_guests' || fieldName === 'entrance_fee_unit') {
      updatedForm.entrance_fee_total = Number(updatedForm.entrance_guests) * Number(updatedForm.entrance_fee_unit);
    }

    // Calculate extra hours total
    if (fieldName === 'extra_hours' || fieldName === 'extra_hours_unit') {
      updatedForm.extra_hours_total = Number(updatedForm.extra_hours) * Number(updatedForm.extra_hours_unit);
    }

    // Calculate additional services total
    if (fieldName === 'additional_quantity' || fieldName === 'additional_unit_price') {
      updatedForm.additional_total = Number(updatedForm.additional_quantity) * Number(updatedForm.additional_unit_price);
    }

    // Calculate grand total
    updatedForm.total_amount =
      Number(updatedForm.room_total) +
      Number(updatedForm.cottage_total) +
      Number(updatedForm.entrance_fee_total) +
      Number(updatedForm.extra_hours_total) +
      Number(updatedForm.additional_total);

    setForm(updatedForm);
  };

  const handleRoomTypeChange = (roomId: string) => {
    const selectedRoom = roomTypes?.data?.find(room => room.id.toString() === roomId);
    if (selectedRoom) {
      console.log(roomId)
      handleChange('room_type', roomId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiService.post('/admin/bookings', form);
      addToast("success", "Booking created successfully!");
      //   console.log(res.data);
      setForm({
        customer_name: '',
        contact_number: '',
        booking_date: '',
        check_in: '',
        check_out: '',
        room_type: '',
        room_quantity: 0,
        room_unit_price: 0,
        room_total: 0,
        cottage_type: '',
        cottage_quantity: 0,
        cottage_unit_price: 0,
        cottage_total: 0,
        entrance_guests: 0,
        entrance_fee_unit: 0,
        entrance_fee_total: 0,
        extra_hours: 0,
        extra_hours_unit: 0,
        extra_hours_total: 0,
        additional_services: '',
        additional_quantity: 0,
        additional_unit_price: 0,
        additional_total: 0,
        total_amount: 0
      })
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      addToast("danger", "Failed to create booking!");
    }

  };

  const tableItems = [
    {
      label: 'Room Type',
      name: 'room_type',
      qty: 'room_quantity',
      price: 'room_unit_price',
      total: 'room_total',
      type: 'select'
    },
    {
      label: 'Cottage Type',
      name: 'cottage_type',
      qty: 'cottage_quantity',
      price: 'cottage_unit_price',
      total: 'cottage_total',
      type: 'input'
    },
    {
      label: 'Entrance Fee (No. of Guests)',
      name: '',
      qty: 'entrance_guests',
      price: 'entrance_fee_unit',
      total: 'entrance_fee_total',
      type: 'none'
    },
    {
      label: 'Extra Hour(s) Stay',
      name: '',
      qty: 'extra_hours',
      price: 'extra_hours_unit',
      total: 'extra_hours_total',
      type: 'none'
    },
    {
      label: 'Additional Services',
      name: 'additional_services',
      qty: 'additional_quantity',
      price: 'additional_unit_price',
      total: 'additional_total',
      type: 'input'
    }
  ];

  return (
    <div className="h-full w-full space-y-8 p-8 bg-gradient-to-br from-slate-50 to-blue-50 overflow-auto">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500">
            <Waves className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              New Booking
            </h1>
            <p className="text-slate-600 text-lg">
              Create a new reservation for your guests
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Details */}
        <Card className="glass-effect border-cyan-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-slate-800">
              <div className="p-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500">
                <User className="h-6 w-6 text-white" />
              </div>
              <span>Customer Details</span>
            </CardTitle>
            <CardDescription className="text-slate-600">
              Enter guest information and booking dates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customer_name" className="flex items-center space-x-2 text-slate-700">
                  <User className="h-4 w-4" />
                  <span>Guest Name</span>
                </Label>
                <Input
                  id="customer_name"
                  type="text"
                  value={form.customer_name}
                  onChange={(e) => handleChange('customer_name', e.target.value)}
                  className="bg-white/80 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
                  placeholder="Enter guest full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_number" className="flex items-center space-x-2 text-slate-700">
                  <Phone className="h-4 w-4" />
                  <span>Contact Number</span>
                </Label>
                <Input
                  id="contact_number"
                  type="text"
                  value={form.contact_number}
                  onChange={(e) => handleChange('contact_number', e.target.value)}
                  className="bg-white/80 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
                  placeholder="+63 XXX XXX XXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking_date" className="flex items-center space-x-2 text-slate-700">
                  <Calendar className="h-4 w-4" />
                  <span>Booking Date</span>
                </Label>
                <Input
                  id="booking_date"
                  type="date"
                  value={form.booking_date}
                  onChange={(e) => handleChange('booking_date', e.target.value)}
                  className="bg-white/80 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="check_in" className="flex items-center space-x-2 text-slate-700">
                  <Clock className="h-4 w-4" />
                  <span>Check-in Date & Time</span>
                </Label>
                <Input
                  id="check_in"
                  type="datetime-local"
                  value={form.check_in}
                  onChange={(e) => handleChange('check_in', e.target.value)}
                  className="bg-white/80 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>

              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="check_out" className="flex items-center space-x-2 text-slate-700">
                  <Clock className="h-4 w-4" />
                  <span>Check-out Date & Time</span>
                </Label>
                <Input
                  id="check_out"
                  type="datetime-local"
                  value={form.check_out}
                  onChange={(e) => handleChange('check_out', e.target.value)}
                  className="bg-white/80 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Details */}
        <Card className="glass-effect border-purple-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-slate-800">
              <div className="p-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500">
                <Bed className="h-6 w-6 text-white" />
              </div>
              <span>Booking Details</span>
            </CardTitle>
            <CardDescription className="text-slate-600">
              Select rooms, services and calculate pricing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-100 to-blue-50 border-b-2 border-cyan-200">
                    <TableHead className="font-semibold text-slate-800">Item Description</TableHead>
                    <TableHead className="font-semibold text-slate-800">Quantity</TableHead>
                    <TableHead className="font-semibold text-slate-800">Unit Price</TableHead>
                    <TableHead className="font-semibold text-slate-800">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableItems.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-blue-50/50">
                      <TableCell className="font-medium">
                        <div className="space-y-2">
                          <span className="text-slate-700">{item.label}</span>
                          {item.type === 'select' && item.name === 'room_type' && (
                            <Select value={form.room_type} onValueChange={handleRoomTypeChange}>
                              <SelectTrigger className="bg-white/80 border-cyan-200 text-black/100">
                                <SelectValue placeholder="Select Room Type" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.isArray(roomTypes?.data) &&  roomTypes?.data?.map((room:any) => (
                                  <SelectItem key={room.id} value={room.id.toString()}>
                                    <p className='text-black/50'> {room.name}</p>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {item.type === 'input' && item.name && (
                            <Input
                              type="text"
                              value={form[item.name as keyof typeof form]}
                              onChange={(e) => handleChange(item.name, e.target.value)}
                              className="bg-white/80 border-cyan-200 focus:border-cyan-400"
                              placeholder={`Enter ${item.label.toLowerCase()}`}
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={form[item.qty as keyof typeof form]}
                          onChange={(e) => handleChange(item.qty, Number(e.target.value))}
                          className="w-20 bg-white/80 border-cyan-200 focus:border-cyan-400"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="text-slate-600 mr-1">₱</span>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form[item.price as keyof typeof form]}
                            onChange={(e) => handleChange(item.price, Number(e.target.value))}
                            className="w-24 bg-white/80 border-cyan-200 focus:border-cyan-400"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center font-semibold text-slate-800">
                          <span className="text-slate-600 mr-1">₱</span>
                          <span>{Number(form[item.total as keyof typeof form]).toLocaleString()}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Total Row */}
                  <TableRow className="bg-gradient-to-r from-cyan-50 to-blue-50 border-t-2 border-cyan-300">
                    <TableCell className="font-bold text-slate-800 text-lg">Total Amount</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="font-bold text-xl text-slate-800">
                      ₱{form.total_amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Booking
          </Button>
        </div>
      </form>
    </div>
  );
}