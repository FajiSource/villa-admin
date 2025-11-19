import { 
  LayoutDashboard, 
  Settings, 
  CalendarPlus,
  BookOpen,
  LogOut,
  Palmtree,
  CalendarClock
} from 'lucide-react';
import Logo from './Logo';
import { useAuthContext } from '../contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';

interface AdminSidebarProps {
  activeItem: string;
  onItemSelect: (item: string) => void;
}

export function AdminSidebar({ activeItem, onItemSelect }: AdminSidebarProps) {
  const { logout } = useAuthContext();
  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      key: "dashboard"
    },
    {
      title: "Resort Management",
      icon: Settings,
      key: "manage"
    },
    {
      title: "User Management",
      icon: Settings,
      key: "admin-settings"
    },
    {
      title: "All Bookings",
      icon: BookOpen,
      key: "bookings"
    },
    {
      title: "Reschedule Requests",
      icon: CalendarClock,
      key: "reschedule-requests"
    }
  ];

  return (
    <Sidebar className="sidebar-gradient border-r border-white/10">
      <SidebarContent>
        <SidebarGroup>
          <div className="p-6 border-b border-white/10">
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="scale-125">
                  <Logo />
                </div>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-xs uppercase tracking-wider">Admin Portal</p>
              </div>
            </div>
          </div>
          <SidebarGroupContent className="p-4">
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton 
                    onClick={() => onItemSelect(item.key)}
                    isActive={activeItem === item.key}
                    className={`
                      w-full rounded-xl p-3 transition-all duration-200 
                      ${activeItem === item.key 
                        ? 'pelagic-gradient-primary text-white shadow-lg transform scale-105' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-white/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={logout}
              className="w-full rounded-xl p-3 text-white/80 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center justify-center mt-4 opacity-60">
          <Palmtree className="h-4 w-4 text-cyan-400" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}