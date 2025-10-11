import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import {
  ArrowLeft,
  Camera,
  Edit,
  Trash2,
  Plus,
  Upload,
  X,
  ImagePlus,
  Eye,
  Calendar,
  FileImage,
  Home
} from 'lucide-react';
import { useAddHomePhoto, useDeletePhoto, useGetHomePhotos, useUpdateHomePhoto } from '../lib/react-query/QueriesAndMutation';
import { useToast } from '../contexts/ToastContext';

interface HomePhoto {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  created_at: string;
}

interface PhotoGalleryManagerProps {
  onBack: () => void;
  onNavigate?: (section: string) => void;
}




export function PhotoGalleryManager({ onBack, onNavigate }: PhotoGalleryManagerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<HomePhoto | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: null as File | null
  });

  const { data: photos, isPending: isLoading } = useGetHomePhotos();
  const { mutateAsync: addPhoto } = useAddHomePhoto();
  const { mutateAsync: updatePhoto } = useUpdateHomePhoto();
  const { mutateAsync: deletePhoto } = useDeletePhoto();
  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.files) {
      const file = e.target.files[0];
      setForm(prev => ({ ...prev, [name]: file }));

      // Create preview URL
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setForm({ name: "", description: "", image: null });
    setPreviewImage(null);
  };

  const handleCreate = async () => {
    if (!form.name || !form.description || !form.image) {
      addToast("danger", "Please fill all fields and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("image", form.image);

    try {
      await addPhoto(formData);
      setShowCreateModal(false);
      resetForm();
      addToast("success", "Photo added successfully!");
    } catch (err) {
      console.error(err);
      addToast("danger", "Failed to add photo.");
    }
  };

  const handleUpdate = async () => {
    if (!selectedPhoto || !form.name || !form.description) {
      addToast("danger", "Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    if (form.image) formData.append("image", form.image);

    try {
      await updatePhoto({ id: selectedPhoto.id, data: formData });
      setShowUpdateModal(false);
      resetForm();
      setSelectedPhoto(null);
      addToast("success", "Photo updated successfully!");
    } catch (err) {
      console.error(err);
      addToast("danger", "Failed to update photo.");
    }
  };

  const handleDelete = async () => {
    if (!selectedPhoto) return;

    try {
      await deletePhoto(selectedPhoto.id);
      setShowDeleteModal(false);
      setSelectedPhoto(null);
      addToast("success", "Photo deleted successfully!");
    } catch (err) {
      console.error(err);
      addToast("danger", "Failed to delete photo.");
    }
  };

  const openEditModal = (photo: HomePhoto) => {
    setSelectedPhoto(photo);
    setForm({
      name: photo.name,
      description: photo.description,
      image: null
    });
    setPreviewImage(null);
    setShowUpdateModal(true);
  };

  const openDeleteModal = (photo: HomePhoto) => {
    setSelectedPhoto(photo);
    setShowDeleteModal(true);
  };

  const viewImage = (url: string) => {
    // Mock image URL - replace with your actual image URL logic
    return `${import.meta.env.VITE_STORAGE_URL}/${url}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="glass-effect border-slate-200 shadow-lg">
                <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 rounded-t-lg animate-pulse" />
                <CardContent className="p-6 space-y-3">
                  <div className="h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 bg-slate-200 rounded w-3/4 animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="relative h-32 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-8 py-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              className="bg-white/90 text-slate-800 hover:bg-white border-0 shadow-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Management
            </Button>

            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-white/20 backdrop-blur-md">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Home Photo Gallery Manager</h1>
                <p className="text-white/80">Manage your resort's showcase images</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {onNavigate && (
              <Button
                onClick={() => onNavigate('room-gallery')}
                className="bg-white/90 text-slate-800 hover:bg-white border-0 shadow-lg"
              >
                <Home className="h-4 w-4 mr-2" />
                Room Photos
              </Button>
            )}
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Photo
            </Button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 py-12">
        {onNavigate && (
          <div className="mb-8">
            <Card
              className="glass-effect border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => onNavigate('room-gallery')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 group-hover:scale-110 transition-transform">
                      <Home className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Room Photo Gallery</h3>
                      <p className="text-slate-600 text-sm">
                        Manage photos specifically for room listings and accommodations
                      </p>
                    </div>
                  </div>
                  <ArrowLeft className="h-5 w-5 text-slate-400 rotate-180 group-hover:translate-x-2 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {photos && photos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos.map((photo) => (
              <Card
                key={photo.id}
                className="group glass-effect border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={viewImage(photo.imageUrl)}
                    alt={photo.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* <div className="absolute top-4 right-4 flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 text-slate-800 hover:bg-white border-0 shadow-lg"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div> */}

                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <Badge className="bg-white/90 text-slate-800 border-0">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(photo.created_at)}
                      </Badge>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => openEditModal(photo)}
                          className="bg-blue-500/90 hover:bg-blue-600 text-white border-0 shadow-lg"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteModal(photo)}
                          className="bg-red-500/90 hover:bg-red-600 text-white border-0 shadow-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {photo.name}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2">
                      {photo.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <div className="flex items-center space-x-2 text-slate-500">
                      <FileImage className="h-4 w-4" />
                      <span className="text-sm">Photo ID: {photo.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass-effect border-slate-200 shadow-lg">
            <CardContent className="p-16 bg-white">
              <div className="text-center space-y-6">
                <div className="p-8 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 w-fit mx-auto">
                  <Camera className="h-16 w-16 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">No Photos Yet</h3>
                  <p className="text-slate-500 mb-6">
                    Start building your resort's photo gallery by uploading beautiful showcase images.
                  </p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Photo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Photo Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-slate-800">
              <div className="p-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-500">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <span>Add New Photo</span>
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Upload a new photo to showcase your resort's beauty.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Photo Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Ocean View Suite"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe this beautiful location..."
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Upload Image</Label>
              <div className="relative">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="cursor-pointer"
                />
                <ImagePlus className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              {previewImage && (
                <div className="mt-4 relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPreviewImage(null);
                      setForm(prev => ({ ...prev, image: null }));
                    }}
                    className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Add Photo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Photo Modal */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-slate-800">
              <div className="p-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-500">
                <Edit className="h-5 w-5 text-white" />
              </div>
              <span>Edit Photo</span>
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Update the photo information and image if needed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Photo Name</Label>
              <Input
                id="edit-name"
                name="name"
                placeholder="e.g., Ocean View Suite"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                placeholder="Describe this beautiful location..."
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">Update Image (Optional)</Label>
              <div className="relative">
                <Input
                  id="edit-image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="cursor-pointer"
                />
                <ImagePlus className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              {previewImage && (
                <div className="mt-4 relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPreviewImage(null);
                      setForm(prev => ({ ...prev, image: null }));
                    }}
                    className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowUpdateModal(false);
                resetForm();
                setSelectedPhoto(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Update Photo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-slate-800">
              <div className="p-2 rounded-full bg-gradient-to-r from-red-400 to-red-500">
                <Trash2 className="h-5 w-5 text-white" />
              </div>
              <span>Delete Photo</span>
            </DialogTitle>
            <DialogDescription className="text-slate-600 pt-2">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-800">"{selectedPhoto?.name}"</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedPhoto && (
            <div className="py-4">
              <img
                src={viewImage(selectedPhoto.imageUrl)}
                alt={selectedPhoto.name}
                className="w-full h-32 object-cover rounded-lg border"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedPhoto(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Photo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}