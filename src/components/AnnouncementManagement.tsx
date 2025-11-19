import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Search,
  Calendar,
  Eye,
  EyeOff,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { useAddNewAnnouncement, useGetAnnouncements, useUpdateAnnouncement, useDeleteAnnouncement } from '../lib/react-query/QueriesAndMutation';
import { useToast } from '../contexts/ToastContext';

interface Announcement {
  id: number;
  title: string;
  content: string;
  image?: string | null;
  published_at?: string | null;
  expires_at?: string | null;
  is_active: boolean;
  priority: number;
  created_at: string;
}

interface AnnouncementManagementProps {
  onBack: () => void;
}

export function AnnouncementManagement({ onBack }: AnnouncementManagementProps) {
  const { data: announcements, isPending: isGettingData, refetch } = useGetAnnouncements();
  const { mutateAsync: createNewAnnouncement, isPending: isCreating } = useAddNewAnnouncement();
  const { mutateAsync: updateAnnouncement, isPending: isUpdating } = useUpdateAnnouncement();
  const { mutateAsync: deleteAnnouncement, isPending: isDeleting } = useDeleteAnnouncement();

  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    published_at: '',
    expires_at: '',
    is_active: true,
    priority: 0,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Ensure announcements is always an array
  const announcementsList = Array.isArray(announcements) ? announcements : [];
  
  const filteredAnnouncements = announcementsList.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Debug logging
  console.log('AnnouncementManagement - announcements:', announcements);
  console.log('AnnouncementManagement - announcementsList:', announcementsList);
  console.log('AnnouncementManagement - filteredAnnouncements:', filteredAnnouncements);

  const handleChange = (field: string, value: string | boolean | number) => {
    setForm({ ...form, [field]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      addToast('danger', 'Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    if (form.published_at) formData.append("published_at", form.published_at);
    if (form.expires_at) formData.append("expires_at", form.expires_at);
    formData.append("is_active", form.is_active ? '1' : '0');
    formData.append("priority", String(form.priority));
    if (image) formData.append("image", image);

    try {
      await createNewAnnouncement(formData);
      addToast('success', 'Announcement created successfully!');
      setIsAddModalOpen(false);
      resetForm();
      refetch();
    } catch (err: any) {
      console.error('Error:', err.response?.data || err.message);
      addToast('danger', err.response?.data?.error || 'Failed to create announcement.');
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setForm({
      title: announcement.title,
      content: announcement.content,
      published_at: announcement.published_at ? announcement.published_at.split('T')[0] : '',
      expires_at: announcement.expires_at ? announcement.expires_at.split('T')[0] : '',
      is_active: announcement.is_active,
      priority: announcement.priority,
    });
    setImage(null);
    setImagePreview(announcement.image || null);
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement || !form.title.trim() || !form.content.trim()) {
      addToast('danger', 'Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    if (form.published_at) formData.append("published_at", form.published_at);
    if (form.expires_at) formData.append("expires_at", form.expires_at);
    formData.append("is_active", form.is_active ? '1' : '0');
    formData.append("priority", String(form.priority));
    if (image) formData.append("image", image);

    try {
      await updateAnnouncement({ id: editingAnnouncement.id, data: formData });
      addToast('success', 'Announcement updated successfully!');
      setIsEditModalOpen(false);
      setEditingAnnouncement(null);
      resetForm();
      refetch();
    } catch (err: any) {
      console.error('Error:', err.response?.data || err.message);
      addToast('danger', err.response?.data?.error || 'Failed to update announcement.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteAnnouncement(id);
      addToast('success', 'Announcement deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error:', err.response?.data || err.message);
      addToast('danger', err.response?.data?.error || 'Failed to delete announcement.');
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      content: '',
      published_at: '',
      expires_at: '',
      is_active: true,
      priority: 0,
    });
    setImage(null);
    setImagePreview(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isActive = (announcement: Announcement) => {
    if (!announcement.is_active) return false;
    const now = new Date();
    if (announcement.published_at && new Date(announcement.published_at) > now) return false;
    if (announcement.expires_at && new Date(announcement.expires_at) < now) return false;
    return true;
  };

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
          <div className="p-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-500">
            <Megaphone className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              What's New Today Management
            </h1>
            <p className="text-slate-600 text-lg">
              Create and manage announcements and news
            </p>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 border-cyan-200 focus:border-cyan-400"
          />
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg inline-flex items-center justify-center h-10 px-4 py-2 rounded-md">
              <Plus className="h-4 w-4 mr-2" />
              Add Announcement
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-slate-800">
                <div className="p-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500">
                  <Megaphone className="h-5 w-5 text-white" />
                </div>
                <span>Add New Announcement</span>
              </DialogTitle>
              <DialogDescription className="text-slate-600">
                Create a new announcement to display on the client side.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Anniversary Discount"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="bg-white/80 border-cyan-200 focus:border-cyan-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <textarea
                  id="content"
                  value={form.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  className="w-full min-h-[150px] px-3 py-2 border border-cyan-200 rounded-md bg-white/80 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                  placeholder="Enter announcement content..."
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="published_at">Published Date</Label>
                  <Input
                    id="published_at"
                    type="date"
                    value={form.published_at}
                    onChange={(e) => handleChange('published_at', e.target.value)}
                    className="bg-white/80 border-cyan-200 focus:border-cyan-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expires_at">Expires Date</Label>
                  <Input
                    id="expires_at"
                    type="date"
                    value={form.expires_at}
                    onChange={(e) => handleChange('expires_at', e.target.value)}
                    className="bg-white/80 border-cyan-200 focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority (0-100)</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="0"
                    max="100"
                    value={form.priority}
                    onChange={(e) => handleChange('priority', parseInt(e.target.value) || 0)}
                    className="bg-white/80 border-cyan-200 focus:border-cyan-400"
                  />
                  <p className="text-xs text-gray-500">Higher priority shows first</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="is_active">Status</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={form.is_active}
                      onChange={(e) => handleChange('is_active', e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <Label htmlFor="is_active" className="cursor-pointer">
                      Active
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-white/80 border-cyan-200 focus:border-cyan-400"
                />
                {imagePreview && (
                  <div className="mt-2 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  className="border-slate-200 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!form.title.trim() || !form.content.trim() || isCreating}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isCreating ? 'Creating...' : 'Create Announcement'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Announcements List */}
      <div className="space-y-6">
        <Card className="glass-effect border-cyan-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <div className="p-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500">
                <Megaphone className="h-5 w-5 text-white" />
              </div>
              <span>All Announcements ({filteredAnnouncements.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isGettingData ? (
              <div className="text-center py-12">
                <div className="p-4 rounded-full bg-slate-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-pulse">
                  <Megaphone className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-600 mb-2">Loading announcements...</h3>
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 rounded-full bg-slate-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Megaphone className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No announcements found</h3>
                <p className="text-slate-500 mb-4">
                  {searchTerm ? 'No announcements match your search criteria.' : 'Start by adding your first announcement.'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Announcement
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAnnouncements?.map((announcement) => (
                  <Card key={announcement.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-cyan-100">
                    {announcement.image && (
                      <div className="relative h-48 w-full">
                        <img
                          src={announcement.image}
                          alt={announcement.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          {isActive(announcement) ? (
                            <Badge className="bg-green-500 text-white">
                              <Eye className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-500 text-white">
                              <EyeOff className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                          {announcement.priority > 0 && (
                            <Badge className="bg-purple-500 text-white">
                              Priority: {announcement.priority}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold text-slate-800 line-clamp-2">{announcement.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-3">{announcement.content}</p>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {announcement.published_at ? formatDate(announcement.published_at) : 'Not published'}
                        {announcement.expires_at && ` - ${formatDate(announcement.expires_at)}`}
                      </div>

                      <div className="space-y-2 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            Created {formatDate(announcement.created_at)}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(announcement)}
                              disabled={isUpdating}
                              className="border-cyan-200 hover:bg-cyan-50 hover:border-cyan-300 text-cyan-600"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(announcement.id)}
                              disabled={isDeleting}
                              className="border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-slate-800">
              <div className="p-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500">
                <Edit className="h-5 w-5 text-white" />
              </div>
              <span>Edit Announcement</span>
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Update the announcement details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                placeholder="e.g., Anniversary Discount"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="bg-white/80 border-cyan-200 focus:border-cyan-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-content">Content *</Label>
              <textarea
                id="edit-content"
                value={form.content}
                onChange={(e) => handleChange('content', e.target.value)}
                className="w-full min-h-[150px] px-3 py-2 border border-cyan-200 rounded-md bg-white/80 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                placeholder="Enter announcement content..."
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-published_at">Published Date</Label>
                <Input
                  id="edit-published_at"
                  type="date"
                  value={form.published_at}
                  onChange={(e) => handleChange('published_at', e.target.value)}
                  className="bg-white/80 border-cyan-200 focus:border-cyan-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-expires_at">Expires Date</Label>
                <Input
                  id="edit-expires_at"
                  type="date"
                  value={form.expires_at}
                  onChange={(e) => handleChange('expires_at', e.target.value)}
                  className="bg-white/80 border-cyan-200 focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority (0-100)</Label>
                <Input
                  id="edit-priority"
                  type="number"
                  min="0"
                  max="100"
                  value={form.priority}
                  onChange={(e) => handleChange('priority', parseInt(e.target.value) || 0)}
                  className="bg-white/80 border-cyan-200 focus:border-cyan-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-is_active">Status</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit-is_active"
                    checked={form.is_active}
                    onChange={(e) => handleChange('is_active', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <Label htmlFor="edit-is_active" className="cursor-pointer">
                    Active
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">Image (Leave empty to keep current image)</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-white/80 border-cyan-200 focus:border-cyan-400"
              />
              {imagePreview && (
                <div className="mt-2 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setImage(null);
                      if (editingAnnouncement?.image) {
                        setImagePreview(editingAnnouncement.image);
                      } else {
                        setImagePreview(null);
                      }
                    }}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {editingAnnouncement && editingAnnouncement.image && !imagePreview && (
                <p className="text-xs text-slate-500">Current image will be replaced if a new one is selected.</p>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingAnnouncement(null);
                  resetForm();
                }}
                className="border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!form.title.trim() || !form.content.trim() || isUpdating}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                {isUpdating ? 'Updating...' : 'Update Announcement'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

