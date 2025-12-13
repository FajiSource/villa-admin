import { useState } from "react";
import { useAddRoomPhoto, useDeleteRoomPhoto, useGetRoomPhotos } from "../lib/react-query/QueriesAndMutation";
import { ArrowLeft, PlusCircle, Trash2, ImageIcon, Camera } from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { getImageUrl } from '../utils/imageUtils';

interface RoomGalleryPageProps {
  onBack: () => void;
  onNavigate?: (section: string) => void;
}

export default function RoomGalleryPage({ onBack, onNavigate }: RoomGalleryPageProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", image: null as File | null });
  const { data: posts, isPending: isGettingPhotos } = useGetRoomPhotos();
  const { mutateAsync: addPost } = useAddRoomPhoto();
  const { mutateAsync: deletePhoto } = useDeleteRoomPhoto();
  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleCreate = async () => {
    if (!form.image) {
      addToast("warning", "Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("image", form.image);

    try {
      await addPost(formData);
      setShowCreateModal(false);
      setForm({ name: "", description: "", image: null });
      addToast("success", "Photo added successfully!");
    } catch (err) {
      console.error(err);
      addToast("danger", "Failed to add photo.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      await deletePhoto(id);
      addToast("success", "Photo deleted successfully!");
    } catch (err) {
      console.error(err);
      addToast("danger", "Failed to delete photo.");
    }
  };


  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-blue-100">
          <div className="flex items-center gap-3">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border-slate-300"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Manage
            </Button>
            {onNavigate && (
              <Button
                onClick={() => onNavigate('photo-gallery')}
                variant="outline"
                className="flex items-center gap-2 bg-white hover:bg-slate-50 border-slate-300"
              >
                <Camera className="h-4 w-4" /> General Gallery
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <ImageIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="poppins">Room Gallery</h1>
          </div>

          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2  hover:bg-slate-50 border-slate-300 shadow-lg text-slate-800 border bg-white/90"
          >
            <PlusCircle className="h-4 w-4 poppins " /> 
            Add New Photo
          </Button>
        </div>

        {/* Content */}
        {isGettingPhotos ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--primary-color)] mb-4"></div>
            <p className="text-slate-600">Loading photos...</p>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post: any) => (
              <div
                key={post.id}
                className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="relative overflow-hidden h-56">
                  <img
                    src={getImageUrl(post.imageUrl)}
                    alt={post.name || "Room photo"}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <Button
                    onClick={() => handleDelete(post.id)}
                    variant="destructive"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  >
                    <Trash2 className="h-4 w-4" /> Delete Photo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100">
            <div className="p-6 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full mb-4">
              <ImageIcon className="h-16 w-16 text-[var(--primary-color)]" />
            </div>
            <p className="text-slate-600 mb-2">No room photos yet</p>
            <p className="text-slate-400 text-sm">Click "Add New Photo" to get started</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-6 border border-blue-100">
            <div className="flex items-center gap-3 pb-4 border-b border-blue-100">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <ImageIcon className="h-5 w-5 text-white" />
              </div>
              <h2 className="poppins">Add Room Photo</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="image" className="text-slate-700 mb-2 block">
                  Upload Image
                </Label>
                <Input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-[var(--primary-color)] file:to-[var(--primary-color-dark)] file:text-white file:cursor-pointer hover:file:from-[var(--primary-color-dark)] hover:file:to-[var(--primary-color-dark)]"
                />
                <p className="text-sm text-slate-500 mt-2">Upload a high-quality image for the room gallery</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-blue-100">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  setForm({ name: "", description: "", image: null });
                }}
                className="border-slate-300 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                className=" border-slate-300 hover:from-[var(--primary-color-dark)] hover:to-[var(--primary-color-dark)] text-black/500"
              >
                Save Photo
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}