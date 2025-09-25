import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { AccommodationGallery } from './AccommodationGallery';
import {
  ArrowLeft,
  Star,
  Trash2,
  Building,
  Home,
  Users,
  TreePine,
  MapPin,
  Calendar,
  Camera,
  Plus,
  Clock,
  EyeOff,
  Eye
} from 'lucide-react';
import { useAddSchedule, useGetSchedules } from '../lib/react-query/QueriesAndMutation';

interface Price {
  id: number;
  description: string;
  price: string;
}

interface Amenity {
  id: number;
  name: string;
}

interface Schedule {
  id: number;
  date: string;
  created_at: string;
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
  schedules?: Schedule[];
}

interface AccommodationDetailsProps {
  accommodation: Cottage;
  onBack: () => void;
  onDelete: (id: number) => void;
  refetch: () => void;
}


export function AccommodationDetails({ accommodation, onBack, onDelete, refetch }: AccommodationDetailsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [showAllSchedules, setShowAllSchedules] = useState(false);

  const { mutateAsync: addSchedule, isPending: isAddingSchedule } = useAddSchedule();
  const { data: schedules, isPending: isGettingSchedules } = useGetSchedules(accommodation?.id);

  const handleDelete = async () => {
    setIsDeleting(true);
    // Simulate API call delay
    setTimeout(() => {
      onDelete(accommodation.id);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }, 1000);
  };

  const handleAddSchedule = async () => {
    if (!scheduleDate) return;

    try {
      const result = await addSchedule({ date: scheduleDate, accommodationId: accommodation.id });

      setScheduleDate('');
      setShowAddSchedule(false);
      refetch();
      console.log('Schedule added successfully:', result);
    } catch (error) {
      console.error('Failed to add schedule:', error);
    }
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
      case 'villa': return 'from-purple-500 to-indigo-600';
      case 'cottage': return 'from-emerald-500 to-teal-600';
      case 'family_room': return 'from-orange-500 to-amber-600';
      default: return 'from-blue-500 to-cyan-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const TypeIcon = getTypeIcon(accommodation.type);

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-50 to-blue-50 overflow-auto">
      {/* Hero Section */}
      <div className="relative h-96 w-full overflow-hidden">
        {accommodation.imageUrl ? (
          <img
            src={`${import.meta.env.VITE_STORAGE_URL}/${accommodation.imageUrl}`}
            alt={accommodation.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getTypeColor(accommodation.type)} flex items-center justify-center`}>
            <TypeIcon className="h-24 w-24 text-white/80" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-between p-8">
          <div className="flex items-start justify-between">
            <Button
              onClick={onBack}
              className="bg-white/90 text-slate-800 hover:bg-white border-0 shadow-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <Badge className={`bg-gradient-to-r ${getTypeColor(accommodation.type)} text-white border-0 shadow-lg px-3 py-1`}>
              <TypeIcon className="h-4 w-4 mr-2" />
              {accommodation.type.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl">
              {accommodation.name}
            </h1>
            <div className="flex items-center space-x-4">
              {accommodation.ratings_avg_ratings !== undefined && accommodation.ratings_avg_ratings > 0 && (
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-white font-semibold">
                    {accommodation.ratings_avg_ratings.toFixed(1)}
                  </span>
                  <span className="text-white/80">
                    ({accommodation.ratings_count} reviews)
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
                <Calendar className="h-4 w-4 text-white" />
                <span className="text-white/90">Added {formatDate(accommodation.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-8 py-12 space-y-12">
        {/* Overview Card */}
        <Card className="glass-effect border-cyan-200 shadow-xl">
          <CardContent className="p-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${getTypeColor(accommodation.type)}`}>
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Location Type</h3>
                    <p className="text-slate-600 capitalize">{accommodation.type.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Guest Rating</h3>
                    <p className="text-slate-600">
                      {accommodation.ratings_avg_ratings?.toFixed(1) || 'No ratings'}
                      {accommodation.ratings_count && accommodation.ratings_count > 0 && (
                        <span className="ml-1">({accommodation.ratings_count} reviews)</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500">
              <span className="text-white font-bold text-lg">₱</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Pricing Options</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {accommodation.prices.map((price) => (
              <Card
                key={price.id}
                className="glass-effect border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
                        {price.description || "Standard Rate"}
                      </h4>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-3xl font-bold text-emerald-600">
                          ₱{parseFloat(price.price).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 group-hover:from-emerald-200 group-hover:to-green-200 transition-all">
                      <span className="text-emerald-600 font-bold text-sm">₱</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Amenities Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500">
              <TreePine className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Resort Amenities</h2>
          </div>

          <Card className="glass-effect border-purple-200 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-wrap gap-3">
                {accommodation.amenities.map((amenity) => (
                  <Badge
                    key={amenity.id}
                    className="bg-gradient-to-r from-purple-100 via-indigo-100 to-blue-100 text-purple-800 border-purple-200 px-4 py-2 text-sm hover:from-purple-200 hover:via-indigo-200 hover:to-blue-200 transition-all cursor-default shadow-sm"
                  >
                    ✨ {amenity.name}
                  </Badge>
                ))}
              </div>

              {accommodation.amenities.length === 0 && (
                <div className="text-center py-8">
                  <TreePine className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No amenities listed for this accommodation.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

       {/* Schedule Management */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-gradient-to-r from-orange-400 to-red-500">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">Schedule Management</h2>
            </div>
            <Button
              onClick={() => setShowAddSchedule(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Schedule
            </Button>
          </div>
          
          <Card className="glass-effect border-orange-200 shadow-lg">
            <CardContent className="p-8">
              {schedules?.data?.length > 0 ? (
                <div className="space-y-4">
                  {/* Schedules Grid/List */}
                  <div 
                    className={`
                      grid gap-4 md:grid-cols-2 lg:grid-cols-3 
                      ${showAllSchedules ? 'max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-50 pr-2' : ''}
                    `}
                  >
                    {(showAllSchedules ? schedules?.data : schedules?.data?.slice(0, 6))?.map((schedule) => (
                      <Card
                        key={schedule.id}
                        className="border-orange-100 hover:shadow-md transition-all duration-200 group"
                      >
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-orange-600" />
                            <span className="font-semibold text-slate-800">
                              {new Date(schedule.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long', 
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">
                            Added {formatDate(schedule.created_at)}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {schedules?.data?.length > 6 && (
                    <div className="flex justify-center pt-4 border-t border-orange-100">
                      <Button
                        onClick={() => setShowAllSchedules(!showAllSchedules)}
                        variant="outline"
                        className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 transition-all duration-200"
                      >
                        {showAllSchedules ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            View All ({schedules?.data?.length} schedules)
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No schedules set for this accommodation.</p>
                  <p className="text-sm text-slate-400 mt-1">Click "Add Schedule" to create your first schedule.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Photo Gallery */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Photo Gallery</h2>
          </div>

          <AccommodationGallery accommodation_id={accommodation.id} />
        </div>
      </div>

      {/* Fixed Delete Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <Button
          onClick={() => setShowDeleteConfirm(true)}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-2xl rounded-full px-6 py-3 transform transition-all duration-200 hover:scale-105"
        >
          <Trash2 className="h-5 w-5 mr-2" />
          Delete
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-slate-800">
              <div className="p-2 rounded-full bg-gradient-to-r from-red-400 to-red-500">
                <Trash2 className="h-5 w-5 text-white" />
              </div>
              <span>Confirm Delete</span>
            </DialogTitle>
            <DialogDescription className="text-slate-600 pt-2">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-800">"{accommodation.name}"</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
              className="border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Schedule Dialog */}
      <Dialog open={showAddSchedule} onOpenChange={setShowAddSchedule}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-slate-800">
              <div className="p-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <span>Add Schedule</span>
            </DialogTitle>
            <DialogDescription className="text-slate-600 pt-2">
              Set a new schedule date for{' '}
              <span className="font-semibold text-slate-800">"{accommodation.name}"</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="scheduleDate">Schedule Date</Label>
              <Input
                id="scheduleDate"
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="bg-white/80 border-orange-200 focus:border-orange-400"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddSchedule(false);
                setScheduleDate('');
              }}
              disabled={isAddingSchedule}
              className="border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSchedule}
              disabled={isAddingSchedule || !scheduleDate}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isAddingSchedule ? 'Adding...' : 'Add Schedule'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}