import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  ArrowLeft,
  Users,
  UserPlus,
  Shield,
  Key,
  Trash2,
  Edit,
  Crown,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  UserCheck,
  Calendar
} from 'lucide-react';
import { useChangeAdminPassword, useDeleteAdminUser, useGetAdminUsers, useRegisterNewUser, useGetAdmins, useGetCustomers } from '../lib/react-query/QueriesAndMutation';

interface AdminUser {
  id: number;
  fname: string;
  lname: string;
  email: string;
  role: string;
  created_at: string;
  last_login?: string;
}

interface AdminManagementProps {
  onBack: () => void;
}



const useToast = () => ({
  addToast: (type: string, message: string) => {
    console.log(`${type}: ${message}`);
  }
});

export function AdminManagement({ onBack }: AdminManagementProps) {
  const [activeTab, setActiveTab] = useState<'admins' | 'users'>('admins');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    new_password: "",
    confirm_password: ""
  });

  const { data: latest, isLoading } = useGetAdminUsers();
  const { data: admins = [] } = useGetAdmins();
  const { data: customers = [] } = useGetCustomers();
  const { mutateAsync: registerNewUser } = useRegisterNewUser();
  const { mutateAsync: removeUser } = useDeleteAdminUser();
  const { mutateAsync: changePassword } = useChangeAdminPassword();
  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const resetForms = () => {
    setForm({ fname: "", lname: "", email: "", password: "" });
    setPasswordForm({ new_password: "", confirm_password: "" });
    setShowPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fname || !form.email || !form.password) {
      addToast('danger', 'First name, email, and password are required!');
      return;
    }

    if (form.password.length < 6) {
      addToast('danger', 'Password must be at least 6 characters long!');
      return;
    }

    try {
      const result = await registerNewUser({
        fname: form.fname,
        lname: form.lname,
        email: form.email,
        password: form.password,
      });

      if (result.success) {
        addToast('success', 'Admin user added successfully!');
        setShowAddModal(false);
        resetForms();
      } else {
        addToast('danger', 'Failed to add user.');
      }
    } catch (err) {
      console.error(err);
      addToast('danger', 'Error occurred while adding user.');
    }
  };

  const handleRemoveUser = async () => {
    if (!selectedUser) return;

    try {
      await removeUser(selectedUser.id);
      addToast('success', 'Admin user removed successfully!');
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
      addToast('danger', 'Failed to remove user.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      addToast('danger', 'Passwords do not match!');
      return;
    }

    if (passwordForm.new_password.length < 6) {
      addToast('danger', 'Password must be at least 6 characters long!');
      return;
    }

    try {
      const result = await changePassword({
        userId: selectedUser.id,
        data: passwordForm,
      });

      if (result.success) {
        addToast('success', 'Password changed successfully!');
        setShowPasswordModal(false);
        resetForms();
        setSelectedUser(null);
      } else {
        addToast('danger', 'Failed to change password.');
      }
    } catch (err) {
      console.error(err);
      addToast('danger', 'Error occurred while changing password.');
    }
  };

  const openPasswordModal = (user: AdminUser) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  };

  const openDeleteModal = (user: AdminUser) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0">
            <Crown className="h-3 w-3 mr-1" />
            Super Admin
          </Badge>
        );
      case 'admin':
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gradient-to-r from-slate-400 to-slate-500 text-white border-0">
            <UserCheck className="h-3 w-3 mr-1" />
            {role}
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-pelagic-gradient-light min-h-screen">
      {/* Header */}
      <div className="relative h-32 w-full resort-gradient-primary">
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
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">User Management</h1>
                <p className="text-white/80">Manage admin accounts and regular users</p>
              </div>
            </div>
          </div>
          
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color-dark)] hover:from-[var(--primary-color-dark)] hover:to-[var(--primary-color-dark)] text-white shadow-lg"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Admin
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-8 mt-8 text-[var(--primary-color)]!">
        <div className="inline-flex rounded-xl overflow-hidden border border-white/30 shadow">
          <button
            onClick={() => setActiveTab('admins')}
            className={`px-4 py-2 text-sm font-medium ${activeTab==='admins' ? 'bg-blue-400 text-slate-800' : 'bg-white/10 text-black'} `}
          >
            Admins
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-medium text-black! ${activeTab==='users' ? 'bg-blue-400 text-slate-800' : 'bg-white/10 text-black'} `}
          >
            Users
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-effect border-pink-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color-dark)]">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Admins</p>
                  <p className="text-2xl font-bold text-slate-800">{admins?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-pink-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color-dark)]">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Users</p>
                  <p className="text-2xl font-bold text-slate-800">{customers?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-pink-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color-dark)]">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Active Today</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {(activeTab==='admins' ? admins : customers)?.filter((u:any) => u.last_login && 
                      new Date(u.last_login) > new Date(Date.now() - 24*60*60*1000)
                    ).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="glass-effect border-slate-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <div className="p-2 rounded-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color-dark)]">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span>{activeTab === 'admins' ? 'Administrative Users' : 'Regular Users'}</span>
            </CardTitle>
            <CardDescription className="text-slate-600">
              {activeTab==='admins' ? 'Manage admin accounts, permissions, and security settings' : 'View and manage regular user accounts'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(activeTab==='admins' ? admins : customers) && (activeTab==='admins' ? admins : customers).length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="font-semibold text-slate-700">{activeTab==='admins' ? 'Admin Details' : 'User Details'}</TableHead>
                      <TableHead className="font-semibold text-slate-700">Role</TableHead>
                      <TableHead className="font-semibold text-slate-700">Joined</TableHead>
                      <TableHead className="font-semibold text-slate-700">Last Login</TableHead>
                      <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(activeTab==='admins' ? admins : customers).map((user:any) => (
                      <TableRow key={user.id} className="border-slate-100 hover:bg-slate-50/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100">
                              <Users className="h-4 w-4 text-cyan-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">
                                {user.name || `${user.fname || ''} ${user.lname || ''}`}
                              </p>
                              <div className="flex items-center space-x-1 text-sm text-slate-500">
                                <Mail className="h-3 w-3" />
                                <span>{user.email}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getRoleBadge(user.role)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm text-slate-600">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(user.created_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.last_login ? (
                            <div className="text-sm text-slate-600">
                              {formatDateTime(user.last_login)}
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-slate-500">
                              Never
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {/* Change Password temporarily disabled: no backend endpoint */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDeleteModal(user)}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="p-6 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 w-fit mx-auto mb-4">
                  <Users className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">No {activeTab==='admins' ? 'Admin' : 'User'} Accounts</h3>
                {activeTab==='admins' && (
                  <p className="text-slate-500 mb-6">
                    Start by adding your first administrative user to manage the resort system.
                  </p>
                )}
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Admin Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-slate-800">
              <div className="p-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-500">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              <span>Add New Admin</span>
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Create a new administrative account for resort management.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddUser} className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fname">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fname"
                  name="fname"
                  placeholder="John"
                  value={form.fname}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lname">Last Name</Label>
                <Input
                  id="lname"
                  name="lname"
                  placeholder="Doe"
                  value={form.lname}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@resort.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <Mail className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Password must be at least 6 characters long
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  resetForms();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-slate-800">
              <div className="p-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-500">
                <Key className="h-5 w-5 text-white" />
              </div>
              <span>Change Password</span>
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Update the password for{' '}
              <span className="font-semibold text-slate-800">
                {selectedUser?.fname} {selectedUser?.lname}
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleChangePassword} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <div className="relative">
                <Input
                  id="new_password"
                  name="new_password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={passwordForm.new_password}
                  onChange={handlePasswordChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={passwordForm.confirm_password}
                  onChange={handlePasswordChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPasswordModal(false);
                  resetForms();
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                <Key className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-slate-800">
              <div className="p-2 rounded-full bg-gradient-to-r from-red-400 to-red-500">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <span>Remove {activeTab==='admins' ? 'Admin' : 'User'}</span>
            </DialogTitle>
            <DialogDescription className="text-slate-600 pt-2">
              Are you sure you want to remove{' '}
              <span className="font-semibold text-slate-800">
                {selectedUser?.fname} {selectedUser?.lname}
              </span>{' '}
              from the administrative team? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <Card className="border-red-200 bg-red-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-red-100">
                      <Users className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-red-800">
                        {selectedUser.fname} {selectedUser.lname}
                      </p>
                      <p className="text-sm text-red-600">{selectedUser.email}</p>
                      <div className="mt-1">
                        {getRoleBadge(selectedUser.role)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRemoveUser}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}