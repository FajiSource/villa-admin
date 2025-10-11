import { useState } from 'react';
import { ModernLogin } from './components/ModernLogin';
import { AdminSidebar } from './components/AdminSidebar';
import { Dashboard } from './components/Dashboard';
import { AllBookings } from './components/AllBookings';
import { ResortManagement } from './components/ResortManagement';
import { NewBooking } from './components/NewBooking';
import { RoomManagement } from './components/RoomManagement';
import { CottageManagement } from './components/CottageManagement';
import { PhotoGalleryManager } from './components/PhotoGalleryManager';
import { AdminManagement } from './components/AdminManagement';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthContext } from './contexts/AuthContext';
import AuthProvider from "./contexts/AuthContext"
import { SidebarProvider } from './components/ui/sidebar';
import { TooltipProvider } from './components/ui/tooltip';
import QueryProvider from './lib/react-query/QueryProvider';
import { ToastProvider } from './contexts/ToastContext';
import RoomGalleryPage from './components/RoomGalleryPage';

function AppContent() {
  const { isAuthenticated, isLoading: loading } = useAuthContext();
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleSectionSelect = (section: string) => {
    console.log(`Selected section: ${section}`);
    if (section === 'room-management') {
      setActiveItem('room-management');
    } else if (section === 'cottages-amenities') {
      setActiveItem('cottages-amenities');
    } else if (section === 'photo-gallery') {
      setActiveItem('photo-gallery');
    } else if (section === 'room-gallery') {
      setActiveItem('room-gallery');
    } else if (section === 'admin-settings') {
      setActiveItem('admin-settings');
    }
  };
  const handleBackToManage = () => {
    setActiveItem('manage');
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <Dashboard />;
      case 'manage':
        return <ResortManagement onSectionSelect={handleSectionSelect} />;
      case 'room-management':
        return <RoomManagement onBack={handleBackToManage} />;
      case 'cottages-amenities':
        return <CottageManagement onBack={handleBackToManage} />;
      case 'photo-gallery':
        return <PhotoGalleryManager onBack={handleBackToManage} onNavigate={handleSectionSelect} />;
      case 'room-gallery':
        return <RoomGalleryPage onBack={handleBackToManage} onNavigate={handleSectionSelect} />;
      case 'admin-settings':
        return <AdminManagement onBack={handleBackToManage} />;
      case 'new-booking':
        return <NewBooking />;
      case 'bookings':
        return <AllBookings />;
      default:
        return <Dashboard />;
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#3770bd] mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <ModernLogin />;
  }

  // Show authenticated app
  return (
    <ProtectedRoute>
      <TooltipProvider>
        <SidebarProvider>
          <div className="flex h-screen w-full bg-background overflow-hidden">
            <AdminSidebar
              activeItem={activeItem}
              onItemSelect={setActiveItem}
            />
            <div className="flex-1 h-full w-full overflow-auto">
              <div className="h-full w-full">
                {renderContent()}
              </div>
            </div>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <QueryProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </QueryProvider>
    </AuthProvider>
  );
}