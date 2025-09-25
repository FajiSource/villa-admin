import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import {
  Bed,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Search,
  Waves
} from 'lucide-react';
import { useAddRoomType, useDeleteRoomType, useGetRoomTypes } from '../lib/react-query/QueriesAndMutation';

interface Room {
  id: number;
  name: string;
  created_at: string;
}

interface RoomManagementProps {
  onBack: () => void;
}

export function RoomManagement({ onBack }: RoomManagementProps) {
  const { data: types, isLoading, refetch } = useGetRoomTypes();
  const { mutateAsync: newRoomType, isPending: isAddingType } = useAddRoomType()
  const { mutateAsync: deleteRoomType, isPending: isDeleting } = useDeleteRoomType()
  const [rooms, setRooms] = useState<Room[]>([]);
  useEffect(() => {
    console.log(types)
    if (types) {
      setRooms(types.data);
    }
  }, [types])
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const filteredRooms = rooms?.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRoom = async () => {
    if (newRoomName.trim()) {
      await newRoomType({ name: newRoomName });
      setNewRoomName('');
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteRoom = async (id: number) => {
     try {
            await deleteRoomType(id);
            refetch();
        } catch (error) {
            console.log(error);
        }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full w-full space-y-8 p-8 bg-gradient-to-br from-slate-50 to-blue-50 overflow-auto">
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
          <div className="p-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500">
            <Bed className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Room Management
            </h1>
            <p className="text-slate-600 text-lg">
              Manage all room types and configurations
            </p>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 border-cyan-200 focus:border-cyan-400"
          />
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add New Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-slate-800">
                <div className="p-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500">
                  <Bed className="h-5 w-5 text-white" />
                </div>
                <span>Add New Room Type</span>
              </DialogTitle>
              <DialogDescription className="text-slate-600">
                Create a new room type for your resort. Enter the room name below.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="roomName">Room Name</Label>
                <Input
                  id="roomName"
                  placeholder="e.g., Deluxe Ocean Suite"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="bg-white/80 border-cyan-200 focus:border-cyan-400"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddRoom();
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewRoomName('');
                }}
                className="border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddRoom}
                disabled={!newRoomName.trim()}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Room
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rooms Table */}
      <Card className="glass-effect border-cyan-200 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <div className="p-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500">
              <Waves className="h-5 w-5 text-white" />
            </div>
            <span>All Rooms ({filteredRooms.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRooms.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 rounded-full bg-slate-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Bed className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No rooms found</h3>
              <p className="text-slate-500 mb-4">
                {searchTerm ? 'No rooms match your search criteria.' : 'Start by adding your first room type.'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Room
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Room Name</TableHead>
                  <TableHead className="w-40">Created Date</TableHead>
                  <TableHead className="text-right w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.map((room) => (
                  <TableRow key={room.id} className="hover:bg-cyan-50/50">
                    <TableCell>
                      <Badge variant="outline" className="border-cyan-200 text-cyan-700">
                        #{room.id}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-800">
                      <div className="flex items-center space-x-2">
                        <Bed className="h-4 w-4 text-cyan-600" />
                        <span>{room.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {formatDate(room.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRoom(room.id)}
                          className="border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-effect border-cyan-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Rooms</CardTitle>
            <Bed className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{rooms?.length}</div>
            <p className="text-xs text-slate-500">Room types available</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-cyan-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Recently Added</CardTitle>
            <Plus className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {rooms?.filter(room => {
                const daysSinceCreated = (Date.now() - new Date(room.created_at).getTime()) / (1000 * 60 * 60 * 24);
                return daysSinceCreated <= 7;
              }).length}
            </div>
            <p className="text-xs text-slate-500">Added this week</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-cyan-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Search Results</CardTitle>
            <Search className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{filteredRooms.length}</div>
            <p className="text-xs text-slate-500">
              {searchTerm ? `Matching "${searchTerm}"` : 'All rooms shown'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}