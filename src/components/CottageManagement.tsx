import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { AccommodationDetails } from './AccommodationDetails';
import {
  TreePine,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Search,
  Waves,
  Star,
  Home,
  Building,
  Users,
  X,
  Eye
} from 'lucide-react';
import { useAddNewAccommodation, useGetAccommodations, useUpdateAccommodation, useDeleteAccommodation } from '../lib/react-query/QueriesAndMutation';
import { useToast } from '../contexts/ToastContext';
import { getImageUrl } from '../utils/imageUtils';

interface Price {
  id: number;
  description: string;
  price: string;
}

interface Amenity {
  id: number;
  name: string;
}

interface Cottage {
  id: number;
  name: string;
  type: 'room' | 'villa' | 'cottage' | 'family_room';
  imageUrl?: string;
  prices: Price[];
  amenities: Amenity[];
  ratings_avg_ratings?: number;
  ratings_count?: number;
  created_at: string;
}

interface CottageManagementProps {
  onBack: () => void;
}

export function CottageManagement({ onBack }: CottageManagementProps) {
  const { data: cottages, isPending: isGettingData, refetch } = useGetAccommodations();
  const { mutateAsync: createNewAccomodation, isPending: isCreatingNewAccomodation } = useAddNewAccommodation();
  const { mutateAsync: updateAccommodation, isPending: isUpdatingAccommodation } = useUpdateAccommodation();
  const { mutateAsync: deleteAccommodation, isPending: isDeletingAccommodation } = useDeleteAccommodation();

  const { addToast } = useToast()
  // const [cottages, setCottages] = useState<Cottage[]>([
  //   {
  //     id: 1,
  //     name: 'Oceanview Villa',
  //     type: 'villa',
  //     imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250&fit=crop',
  //     prices: [
  //       { id: 1, description: 'Standard Rate', price: '8500' },
  //       { id: 2, description: 'Weekend Rate', price: '10500' }
  //     ],
  //     amenities: [
  //       { id: 1, name: 'Private Pool' },
  //       { id: 2, name: 'Ocean View' },
  //       { id: 3, name: 'Air Conditioning' }
  //     ],
  //     ratings_avg_ratings: 4.8,
  //     ratings_count: 24,
  //     created_at: '2024-01-15T10:30:00Z'
  //   },
  //   {
  //     id: 2,
  //     name: 'Family Cottage',
  //     type: 'cottage',
  //     imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop',
  //     prices: [
  //       { id: 3, description: 'Day Rate', price: '4500' },
  //       { id: 4, description: 'Overnight', price: '6500' }
  //     ],
  //     amenities: [
  //       { id: 4, name: 'Kitchen' },
  //       { id: 5, name: 'Garden View' },
  //       { id: 6, name: 'BBQ Area' }
  //     ],
  //     ratings_avg_ratings: 4.6,
  //     ratings_count: 18,
  //     created_at: '2024-01-20T14:15:00Z'
  //   },
  //   {
  //     id: 3,
  //     name: 'Deluxe Family Room',
  //     type: 'family_room',
  //     imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=250&fit=crop',
  //     prices: [
  //       { id: 5, description: 'Standard', price: '5500' }
  //     ],
  //     amenities: [
  //       { id: 7, name: 'King + Queen Beds' },
  //       { id: 8, name: 'Mini Fridge' },
  //       { id: 9, name: 'Balcony' }
  //     ],
  //     ratings_avg_ratings: 4.7,
  //     ratings_count: 12,
  //     created_at: '2024-02-05T09:45:00Z'
  //   }
  // ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<Cottage | null>(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState<Cottage | null>(null);
  const [form, setForm] = useState({
    name: '',
    type: '',
    prices: [{ description: '', price: '' }],
    amenities: [''],
    capacity: '',
    status: 'Available',
    description: '',
  });
  const [image, setImage] = useState<File | null>(null);

  const filteredCottages = cottages?.filter(cottage =>
    cottage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cottage.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handlePriceChange = (index: number, field: 'description' | 'price', value: string) => {
    const newPrices = [...form.prices];
    newPrices[index][field] = value;
    setForm({ ...form, prices: newPrices });
  };

  const handleAmenityChange = (index: number, value: string) => {
    const newAmenities = [...form.amenities];
    newAmenities[index] = value;
    setForm({ ...form, amenities: newAmenities });
  };

  const addPrice = () => setForm({ ...form, prices: [...form.prices, { description: '', price: '' }] });
  const addAmenity = () => setForm({ ...form, amenities: [...form.amenities, ''] });

  const removePrice = (index: number) => {
    if (form.prices?.length > 1) {
      const newPrices = form.prices?.filter((_, i) => i !== index);
      setForm({ ...form, prices: newPrices });
    }
  };

  const removeAmenity = (index: number) => {
    if (form.amenities?.length > 1) {
      const newAmenities = form.amenities?.filter((_, i) => i !== index);
      setForm({ ...form, amenities: newAmenities });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim() && form.type) {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("type", form.type);
      if (form.capacity) formData.append("capacity", String(form.capacity));
      if (form.status) formData.append("status", form.status);
      if (form.description) formData.append("description", form.description);
      if (image) formData.append("image", image);

      // Map first price to price_per_night
      const firstPrice = form.prices?.[0]?.price;
      if (firstPrice) formData.append('price_per_night', String(firstPrice));
      // Optional: still include original prices fields for future-proofing
      form.prices.forEach((p, i) => {
        formData.append(`prices[${i}][description]`, p.description);
        formData.append(`prices[${i}][price]`, p.price);
      });
      form.amenities.forEach((a, i) => formData.append(`amenities[${i}]`, a));

      try {
        await createNewAccomodation(formData);
        setForm({ name: "", type: "", prices: [{ description: "", price: "" }], amenities: [""], capacity: "", status: "Available", description: "" });
        setImage(null);
        addToast("success", "Accommodation created successfully!");
        setIsAddModalOpen(false);
        refetch();

      } catch (err: any) {
        console.error("Error:", err.response?.data || err.message);
        addToast("danger", "Failed to create accommodation.");
      }

    }
  };

  const handleEditCottage = (cottage: Cottage) => {
    // Normalize data from backend format
    const normalizedPrices = Array.isArray((cottage as any).prices)
      ? (cottage as any).prices
      : ((cottage as any).price
          ? [{ description: 'Per Night', price: String((cottage as any).price) }]
          : [{ description: '', price: '' }]);
    
    const normalizedAmenities = Array.isArray((cottage as any).amenities)
      ? (cottage as any).amenities.map((a: any) => typeof a === 'string' ? a : a.name || '')
      : [];

    setEditingAccommodation(cottage);
    setForm({
      name: cottage.name,
      type: cottage.type.charAt(0).toUpperCase() + cottage.type.slice(1),
      prices: normalizedPrices.length > 0 ? normalizedPrices : [{ description: '', price: '' }],
      amenities: normalizedAmenities.length > 0 ? normalizedAmenities : [''],
      capacity: String((cottage as any).maxGuests || (cottage as any).capacity || ''),
      status: (cottage as any).status || 'Available',
      description: (cottage as any).description || '',
    });
    setImage(null);
    setIsEditModalOpen(true);
  };

  const handleDeleteCottage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this accommodation? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteAccommodation(id);
      addToast('success', 'Accommodation deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error:', err.response?.data || err.message);
      addToast('danger', err.response?.data?.error || 'Failed to delete accommodation.');
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccommodation || !form.name.trim() || !form.type) {
      addToast('danger', 'Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("type", form.type);
    formData.append("capacity", String(form.capacity || 1));
    formData.append("status", form.status || 'Available');
    formData.append("description", form.description || '');

    // Only append image if a new one is selected
    if (image) {
      formData.append("image", image);
    }

    // Map first price to price_per_night (required field)
    const firstPrice = form.prices?.[0]?.price;
    if (firstPrice) {
      formData.append('price_per_night', String(firstPrice));
    } else {
      // If no price provided, use existing price or default
      const existingPrice = (editingAccommodation as any).price || (editingAccommodation as any).prices?.[0]?.price || '0';
      formData.append('price_per_night', String(existingPrice));
    }
    
    // Append amenities array (filter out empty strings)
    const validAmenities = form.amenities.filter(a => a && a.trim());
    if (validAmenities.length > 0) {
      validAmenities.forEach((a, i) => {
        formData.append(`amenities[${i}]`, a.trim());
      });
    } else {
      // Send empty array if no amenities
      formData.append('amenities', '[]');
    }

    try {
      console.log('Updating accommodation ID:', editingAccommodation.id);
      console.log('Form values:', { name: form.name, type: form.type, capacity: form.capacity, status: form.status });
      console.log('FormData entries:', Array.from(formData.entries()));
      
      const result = await updateAccommodation({ id: editingAccommodation.id, data: formData });
      console.log('Update result:', result);
      
      addToast('success', 'Accommodation updated successfully!');
      setIsEditModalOpen(false);
      setEditingAccommodation(null);
      setForm({ name: '', type: '', prices: [{ description: '', price: '' }], amenities: [''], capacity: '', status: 'Available', description: '' });
      setImage(null);
      refetch();
    } catch (err: any) {
      console.error('Update error:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to update accommodation.';
      addToast('danger', errorMessage);
    }
  };

  const handleViewDetails = (cottage: Cottage) => {
    setSelectedAccommodation(cottage);
  };

  const handleBackToList = () => {
    setSelectedAccommodation(null);
  };

  const handleDeleteFromDetails = async (id: number) => {
    if (!confirm('Are you sure you want to delete this accommodation? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteAccommodation(id);
      addToast('success', 'Accommodation deleted successfully!');
      setSelectedAccommodation(null);
      refetch();
    } catch (err: any) {
      console.error('Error:', err.response?.data || err.message);
      addToast('danger', err.response?.data?.error || 'Failed to delete accommodation.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'villa': return Building;
      case 'cottage': return Home;
      case 'family_room': return Users;
      default: return TreePine;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'villa': return 'from-purple-200 via-indigo-200 to-blue-200 text-indigo-800';
      case 'cottage': return 'from-green-200 via-emerald-200 to-teal-200 text-emerald-800';
      case 'family_room': return 'from-orange-200 via-amber-200 to-yellow-200 text-orange-800';
      default: return 'from-blue-200 via-cyan-200 to-sky-200 text-blue-800';
    }
  };

  // Show details view if accommodation is selected
  if (selectedAccommodation) {
    return (
      <AccommodationDetails
        accommodation={selectedAccommodation}
        onBack={handleBackToList}
        onDelete={handleDeleteFromDetails}
        onEdit={(accommodation) => {
          setSelectedAccommodation(null);
          handleEditCottage(accommodation);
        }}
        refetch={() => refetch()}
      />
    );
  }

  return (
    <div className="flex-1 space-y-8 p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center space-x-2 bg-white/80 border-cyan-200 hover:bg-white hover:border-cyan-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Management</span>
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500">
            <TreePine className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Cottage & Accommodation Management
            </h1>
            <p className="text-slate-600 text-lg">
              Manage all resort accommodations and facilities
            </p>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search accommodations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 border-cyan-200 focus:border-cyan-400"
          />
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg inline-flex items-center justify-center h-10 px-4 py-2 rounded-md">
              <Plus className="h-4 w-4 mr-2" />
              Add Accommodation
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-slate-800">
                <div className="p-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500">
                  <TreePine className="h-5 w-5 text-white" />
                </div>
                <span>Add New Accommodation</span>
              </DialogTitle>
              <DialogDescription className="text-slate-600">
                Create a new accommodation for your resort. Fill in all the details below.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Accommodation Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Oceanview Villa"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="bg-white/80 border-cyan-200 focus:border-cyan-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={form.type} onValueChange={(value) => handleChange('type', value)} required>
                    <SelectTrigger className="bg-white/80 border-cyan-200 focus:border-cyan-400">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Room">Room</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Cottage">Cottage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="e.g., 4"
                    value={form.capacity}
                    onChange={(e) => handleChange('capacity', e.target.value)}
                    className="bg-white/80 border-cyan-200 focus:border-cyan-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={form.status} onValueChange={(value) => handleChange('status', value)} required>
                    <SelectTrigger className="bg-white/80 border-cyan-200 focus:border-cyan-400">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Booked">Booked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full min-h-[100px] px-3 py-2 border border-cyan-200 rounded-md bg-white/80 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                  placeholder="Enter accommodation description..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="bg-white/80 border-cyan-200 focus:border-cyan-400"
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Prices</Label>
                  <Button type="button" onClick={addPrice} variant="outline" size="sm" className="border-emerald-200 hover:bg-emerald-50">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Price
                  </Button>
                </div>
                {form.prices?.map((price, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Description (e.g., Standard Rate)"
                      value={price.description}
                      onChange={(e) => handlePriceChange(index, 'description', e.target.value)}
                      className="bg-white/80 border-cyan-200 focus:border-cyan-400 flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={price.price}
                      onChange={(e) => handlePriceChange(index, 'price', e.target.value)}
                      className="bg-white/80 border-cyan-200 focus:border-cyan-400 w-32"
                    />
                    {form.prices?.length > 1 && (
                      <Button type="button" onClick={() => removePrice(index)} variant="outline" size="sm" className="border-red-200 hover:bg-red-50 text-red-600">
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Amenities</Label>
                  <Button type="button" onClick={addAmenity} variant="outline" size="sm" className="border-emerald-200 hover:bg-emerald-50">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Amenity
                  </Button>
                </div>
                {form.amenities?.map((amenity, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Amenity (e.g., Private Pool)"
                      value={amenity}
                      onChange={(e) => handleAmenityChange(index, e.target.value)}
                      className="bg-white/80 border-cyan-200 focus:border-cyan-400 flex-1"
                    />
                    {form.amenities?.length > 1 && (
                      <Button type="button" onClick={() => removeAmenity(index)} variant="outline" size="sm" className="border-red-200 hover:bg-red-50 text-red-600">
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setForm({ name: '', type: '', prices: [{ description: '', price: '' }], amenities: [''], capacity: '', status: 'Available', description: '' });
                    setImage(null);
                  }}
                  className="border-slate-200 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!form.name.trim() || !form.type || isCreatingNewAccomodation}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isCreatingNewAccomodation ? 'Creating...' : 'Add Accommodation'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-slate-800">
                <div className="p-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500">
                  <Edit className="h-5 w-5 text-white" />
                </div>
                <span>Edit Accommodation</span>
              </DialogTitle>
              <DialogDescription className="text-slate-600">
                Update the accommodation details below.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpdateSubmit} className="space-y-6 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Accommodation Name</Label>
                  <Input
                    id="edit-name"
                    placeholder="e.g., Oceanview Villa"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="bg-white/80 border-cyan-200 focus:border-cyan-400 text-black"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-type">Type</Label>
                  <Select value={form.type} onValueChange={(value) => handleChange('type', value)} required>
                    <SelectTrigger className="bg-white/80 border-cyan-200 focus:border-cyan-400">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Room">Room</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Cottage">Cottage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-capacity">Capacity</Label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    placeholder="e.g., 4"
                    value={form.capacity}
                    onChange={(e) => handleChange('capacity', e.target.value)}
                    className="bg-white/80 border-cyan-200 focus:border-cyan-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={form.status} onValueChange={(value) => handleChange('status', value)} required>
                    <SelectTrigger className="bg-white/80 border-cyan-200 focus:border-cyan-400">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Booked">Booked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <textarea
                  id="edit-description"
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full min-h-[100px] px-3 py-2 border border-cyan-200 rounded-md bg-white/80 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                  placeholder="Enter accommodation description..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-image">Image (Leave empty to keep current image)</Label>
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="bg-white/80 border-cyan-200 focus:border-cyan-400"
                />
                {editingAccommodation && (editingAccommodation as any).imageUrl && (
                  <p className="text-xs text-slate-500">Current image will be replaced if a new one is selected.</p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Prices</Label>
                  <Button type="button" onClick={addPrice} variant="outline" size="sm" className="border-emerald-200 hover:bg-emerald-50">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Price
                  </Button>
                </div>
                {form.prices?.map((price, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Description (e.g., Standard Rate)"
                      value={price.description}
                      onChange={(e) => handlePriceChange(index, 'description', e.target.value)}
                      className="bg-white/80 border-cyan-200 focus:border-cyan-400 flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={price.price}
                      onChange={(e) => handlePriceChange(index, 'price', e.target.value)}
                      className="bg-white/80 border-cyan-200 focus:border-cyan-400 w-32"
                    />
                    {form.prices?.length > 1 && (
                      <Button type="button" onClick={() => removePrice(index)} variant="outline" size="sm" className="border-red-200 hover:bg-red-50 text-red-600">
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Amenities</Label>
                  <Button type="button" onClick={addAmenity} variant="outline" size="sm" className="border-emerald-200 hover:bg-emerald-50">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Amenity
                  </Button>
                </div>
                {form.amenities?.map((amenity, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Amenity (e.g., Private Pool)"
                      value={amenity}
                      onChange={(e) => handleAmenityChange(index, e.target.value)}
                      className="bg-white/80 border-cyan-200 focus:border-cyan-400 flex-1"
                    />
                    {form.amenities?.length > 1 && (
                      <Button type="button" onClick={() => removeAmenity(index)} variant="outline" size="sm" className="border-red-200 hover:bg-red-50 text-red-600">
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingAccommodation(null);
                    setForm({ name: '', type: '', prices: [{ description: '', price: '' }], amenities: [''], capacity: '', status: 'Available', description: '' });
                    setImage(null);
                  }}
                  className="border-slate-200 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!form.name.trim() || !form.type || isUpdatingAccommodation}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isUpdatingAccommodation ? 'Updating...' : 'Update Accommodation'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Accommodations Grid */}
      <div className="space-y-6">
        <Card className="glass-effect border-cyan-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <div className="p-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500">
                <Waves className="h-5 w-5 text-white" />
              </div>
              <span>All Accommodations ({filteredCottages?.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCottages?.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 rounded-full bg-slate-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TreePine className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No accommodations found</h3>
                <p className="text-slate-500 mb-4">
                  {searchTerm ? 'No accommodations match your search criteria.' : 'Start by adding your first accommodation.'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Accommodation
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCottages?.map((cottage) => {
                  const TypeIcon = getTypeIcon(cottage.type);
                  return (
                    <Card key={cottage.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-cyan-100">
                      {cottage.imageUrl && (
                        <div className="relative h-48 w-full">
                          <img
                            src={getImageUrl(cottage.imageUrl)}
                            alt={cottage.name}
                            className="h-full w-full object-cover"
                          />
                          <Badge className={`absolute top-2 right-2 bg-gradient-to-r ${getTypeColor(cottage.type)} shadow-sm`}>
                            <TypeIcon className="h-3 w-3 mr-1" />
                            {cottage.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      )}

                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-slate-800">{cottage.name}</h3>
                          {cottage.ratings_avg_ratings && (
                            <div className="flex items-center gap-1 text-yellow-500 text-sm">
                              <Star className="h-3 w-3 fill-current" />
                              <span className="text-slate-600">
                                {cottage.ratings_avg_ratings} ({cottage.ratings_count})
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {cottage.prices?.map((price) => (
                            <Badge
                              key={price.id}
                              variant="outline"
                              className="bg-gradient-to-tr from-green-100 via-green-200 to-green-50 text-green-800 border-green-200"
                            >
                              {price.description}: ₱{parseFloat(price.price).toLocaleString()}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {cottage.amenities.slice(0, 3)?.map((amenity, idx) => (
                            <Badge
                              key={amenity.id ?? amenity.name ?? idx}
                              variant="secondary"
                              className="bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 text-purple-800 text-xs"
                            >
                              {amenity.name}
                            </Badge>
                          ))}
                          {cottage.amenities?.length > 3 && (
                            <Badge variant="secondary" className="text-xs text-slate-500">
                              +{cottage.amenities?.length - 3} more
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-3 pt-3 border-t border-slate-100">
                          <Button
                            onClick={() => handleViewDetails(cottage)}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                              Added {formatDate(cottage.created_at)}
                            </span>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCottage(cottage)}
                                disabled={isUpdatingAccommodation}
                                className="border-cyan-200 hover:bg-cyan-50 hover:border-cyan-300 text-cyan-600"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCottage(cottage.id)}
                                disabled={isDeletingAccommodation}
                                className="border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-effect border-cyan-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Accommodations</CardTitle>
            <TreePine className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{cottages?.length}</div>
            <p className="text-xs text-slate-500">Available properties</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-cyan-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Villas</CardTitle>
            <Building className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {cottages?.filter(c => c.type === 'villa')?.length}
            </div>
            <p className="text-xs text-slate-500">Luxury villas</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-cyan-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Cottages</CardTitle>
            <Home className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {cottages?.filter(c => c.type === 'cottage')?.length}
            </div>
            <p className="text-xs text-slate-500">Cozy cottages</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-cyan-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Family Rooms</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {cottages?.filter(c => c.type === 'family_room')?.length}
            </div>
            <p className="text-xs text-slate-500">Family accommodations</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}