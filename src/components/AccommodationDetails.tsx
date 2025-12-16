import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  ArrowLeft,
  Building,
  Home,
  Users,
  TreePine,
  Edit,
  Trash2,
} from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';
import { useEffect } from 'react';
 
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
  onEdit?: (accommodation: Cottage) => void;
  refetch: () => void;
}


export function AccommodationDetails({ accommodation, onBack, onDelete, onEdit, refetch }: AccommodationDetailsProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'villa': return Building;
      case 'cottage': return Home;
      case 'family_room': return Users;
      default: return TreePine;
    }
  };

  const getTypeColor = (type: string) => {
    // Use resort gradient consistently for better theme cohesion
    return 'from-[var(--primary-color)] to-[var(--primary-color-dark)]';
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  
  // Normalize fields from backend shape and process image URL
  const rawImageSrc = (accommodation as any).image;
  const imageSrc = rawImageSrc ? getImageUrl(rawImageSrc) : '';
  const normalizedPrices = Array.isArray((accommodation as any).prices)
  ? (accommodation as any).prices
  : ((accommodation as any).price
  ? [{ id: 1, description: 'Per Night', price: String((accommodation as any).price) }]
  : []);
  const normalizedAmenities = Array.isArray((accommodation as any).amenities)
  ? (accommodation as any).amenities.map((a: any, idx: number) =>
    typeof a === 'string' ? ({ id: idx + 1, name: a }) : a
)
: [];

const TypeIcon = getTypeIcon(accommodation.type);

useEffect(() => {
  console.log(accommodation);
  console.log(imageSrc);
}, [accommodation, imageSrc]);
  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-50 to-blue-50 overflow-auto">
      {/* Hero Section */}
      <div className="relative h-96 w-full overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
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
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  onClick={() => onEdit(accommodation)}
                  className="bg-blue-500/90 text-white hover:bg-blue-600 border-0 shadow-lg"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button
                onClick={() => onDelete(accommodation.id)}
                className="bg-red-500/90 text-white hover:bg-red-600 border-0 shadow-lg"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl">
              {accommodation.name}
            </h1>
            {normalizedPrices.length > 0 && (
              <div className="inline-flex items-baseline gap-2 bg-white/15 backdrop-blur-md rounded-full px-5 py-2">
                <span className="text-white/90">Starting from</span>
                <span className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--primary-color)' }}>
                  ₱{parseFloat(normalizedPrices[0].price).toLocaleString()}
                </span>
                <span className="text-white/80">/night</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-10 space-y-8">
        {/* Description */}
        {(accommodation as any).description && (
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--primary-color)' }}>About this accommodation</h2>
            <p className="text-slate-700">{(accommodation as any).description}</p>
          </div>
        )}

        {/* Amenities */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color-dark)]">
              <TreePine className="h-5 w-5 text-black" />
            </div>
            <h2 className="text-xl font-semibold">Amenities</h2>
          </div>

          {normalizedAmenities.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {normalizedAmenities.slice(0, 6).map((amenity) => (
                <Badge
                  key={amenity.id}
                  className="bg-[var(--primary-color)]/10 text-[var(--primary-color-dark)] border-0 px-3 py-1"
                >
                  {amenity.name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No amenities listed.</p>
          )}
        </div>
      </div>
    </div>
  );
}