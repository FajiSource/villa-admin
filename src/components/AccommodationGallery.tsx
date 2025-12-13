import React, { useState } from "react";
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Upload, 
  X, 
  Camera, 
  ImagePlus, 
  Trash2, 
  ZoomIn,
  Download,
  Eye
} from 'lucide-react';
import { useAddAccommodationImage, useDeleteAccommodationImage, useGetAccommodationImages } from "../lib/react-query/QueriesAndMutation";
import { useToast } from "../contexts/ToastContext";
import { getImageUrl } from '../utils/imageUtils';

interface AccommodationImage {
  id: number;
  imageUrl: string;
}

interface AccommodationGalleryProps {
  accommodation_id: number;
}

export function AccommodationGallery({ accommodation_id }: AccommodationGalleryProps) {
  const [file, setFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleteImageId, setDeleteImageId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { data, isLoading,refetch } = useGetAccommodationImages(accommodation_id);
  const addMutation = useAddAccommodationImage();
  const deleteMutation = useDeleteAccommodationImage();
  const { addToast } = useToast();

  const viewImage = (url: string) => {
    return getImageUrl(url);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        setFile(droppedFile);
      } else {
        addToast("danger", "Please select a valid image file.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAddImage = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("accommodation_id", accommodation_id.toString());
    formData.append("image", file);

    try {
      await addMutation.mutateAsync(formData);
      refetch();
      setFile(null);
      addToast("success", "Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      addToast("danger", "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteImageId(null);
      addToast("success", "Image deleted successfully!");
    } catch (err) {
      console.error(err);
      addToast("danger", "Failed to delete image.");
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const images = data?.data || [];

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <Card className="glass-effect border-cyan-200 shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800">Add New Images</h3>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                dragActive 
                  ? 'border-cyan-400 bg-cyan-50' 
                  : 'border-slate-300 hover:border-cyan-300 hover:bg-slate-50'
              }`}
            >
              <div className="text-center space-y-4">
                {file ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="p-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500">
                        <ImagePlus className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-slate-800">{file.name}</p>
                        <p className="text-sm text-slate-500">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFile}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-center space-x-3">
                      <Button
                        onClick={handleAddImage}
                        disabled={isUploading}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={clearFile}
                        disabled={isUploading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 w-fit mx-auto">
                      <Camera className="h-8 w-8 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 mb-1">
                        Drag and drop images here, or click to browse
                      </p>
                      <p className="text-sm text-slate-500">
                        Supports JPG, PNG, GIF up to 10MB
                      </p>
                    </div>
                    <label className="inline-block">
                      <Button 
                        variant="outline" 
                        className="border-cyan-300 text-cyan-600 hover:bg-cyan-50"
                        asChild
                      >
                        <span>
                          <ImagePlus className="h-4 w-4 mr-2" />
                          Choose Files
                        </span>
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        multiple={false}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((img, index) => (
            <Card 
              key={img.id} 
              className="group overflow-hidden glass-effect border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative aspect-square">
                <img
                  src={viewImage(img.imageUrl)}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Overlay with Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <Badge className="bg-white/90 text-slate-800 border-0">
                      Image {index + 1}
                    </Badge>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedImage(viewImage(img.imageUrl))}
                        className="bg-white/90 text-slate-800 hover:bg-white border-0 shadow-lg"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteImageId(img.id)}
                        className="bg-red-500/90 hover:bg-red-600 text-white border-0 shadow-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-effect border-slate-200 shadow-lg">
          <CardContent className="p-12 bg-white">
            <div className="text-center space-y-4">
              <div className="p-6 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 w-fit mx-auto">
                <Camera className="h-12 w-12 text-slate-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">No Images Yet</h3>
                <p className="text-slate-500">
                  Start building your gallery by uploading some beautiful photos of this accommodation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Preview Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white">
          <DialogHeader className="sr-only">
            <DialogTitle>Image Preview</DialogTitle>
            <DialogDescription>
              Full size view of the accommodation image
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Full size preview"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/90 text-slate-800 hover:bg-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteImageId} onOpenChange={() => setDeleteImageId(null)}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-slate-800">
              <div className="p-2 rounded-full bg-gradient-to-r from-red-400 to-red-500">
                <Trash2 className="h-5 w-5 text-white" />
              </div>
              <span>Delete Image</span>
            </DialogTitle>
            <DialogDescription className="text-slate-600 pt-2">
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end space-x-3 pt-6">
            <Button
              variant="outline"
              onClick={() => setDeleteImageId(null)}
              className="border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteImageId && handleDelete(deleteImageId)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}