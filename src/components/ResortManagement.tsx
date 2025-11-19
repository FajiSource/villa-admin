import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  Bed, 
  Home, 
  Camera, 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  ImageIcon,
  Shield,
  KeyRound,
  Waves,
  TreePine,
  Megaphone
} from 'lucide-react';

interface ResortManagementProps {
  onSectionSelect?: (section: string) => void;
}

export function ResortManagement({ onSectionSelect }: ResortManagementProps) {
  const managementSections = [
    {
      id: 'cottages-amenities',
      title: 'Villas & Cottages',
      description: 'Manage accommodations, images, amenities, and pricing',
      icon: TreePine,
      gradient: 'from-emerald-500 to-teal-500',
      actions: [
        { label: 'Add Accommodation', icon: Plus },
        { label: 'Edit Amenities', icon: Edit }
      ]
    },
    {
      id: 'announcements',
      title: "What's New Today",
      description: 'Create and manage announcements and news for clients',
      icon: Megaphone,
      gradient: 'from-purple-500 to-pink-500',
      actions: [
        { label: 'Add Announcement', icon: Plus },
        { label: 'Manage Content', icon: Edit }
      ]
    }
  ];

  const handleCardClick = (sectionId: string) => {
    if (onSectionSelect) {
      onSectionSelect(sectionId);
    }
  };

  // const handleActionClick = (e: React.MouseEvent, action: string, sectionId: string) => {
  //   e.stopPropagation();
  //   console.log(`Action: ${action} for section: ${sectionId}`);
  // };

  return (
    <div className="h-full w-full space-y-8 p-8 bg-gradient-to-br from-slate-50 to-blue-50 overflow-auto">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-full pelagic-gradient-primary">
            <Waves className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[var(--primary-color)]">
              Resort Management
            </h1>
            <p className="text-slate-600 text-lg">
              Manage all aspects of Villa Perez Resort
            </p>
          </div>
        </div>
      </div>

      {/* Management Cards Grid */}
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-2">
        {managementSections.map((section) => (
          <Card 
            key={section.id}
            className="glass-effect border-cyan-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
            onClick={() => handleCardClick(section.id)}
          >
            <CardHeader className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-xl bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color-dark)] shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <section.icon className="h-8 w-8 text-[var(--primary-color)]" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl text-slate-800" style={{ color: 'var(--foreground)' }}>
                    {section.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 mt-1">
                    {section.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {section.actions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start space-x-3 bg-white/50 border-slate-200 hover:bg-white transition-all duration-200"
                    style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                    // onClick={(e) => handleActionClick(e, action.label, section.id)}
                  >
                    <action.icon className="h-4 w-4 text-[var(--primary-color)]" />
                    <span className='text-[var(--primary-color)]'>{action.label}</span>
                  </Button>
                ))}
              </div>

              <div className="pt-4 bg border-t border-slate-200">
                <Button 
                  className={`text-[var(--primary-color)] w-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color-dark)] hover:opacity-90 text-black shadow-lg transform hover:scale-105 transition-all duration-200`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(section.id);
                  }}
                >
                  Manage {section.title.split(' ')[0]}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      {/* <div className="mt-12">
        <Card className="glass-effect border-cyan-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-800">
              <div className="p-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription className="text-slate-600">
              Frequently used management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Button 
                variant="outline" 
                className="flex flex-col items-center space-y-2 h-20 bg-white/50 border-slate-200 hover:bg-white hover:border-emerald-300 hover:text-emerald-600"
              >
                <Plus className="h-5 w-5" />
                <span className="text-sm">Add New Room</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center space-y-2 h-20 bg-white/50 border-slate-200 hover:bg-white hover:border-blue-300 hover:text-blue-600"
              >
                <Camera className="h-5 w-5" />
                <span className="text-sm">Upload Photos</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center space-y-2 h-20 bg-white/50 border-slate-200 hover:bg-white hover:border-purple-300 hover:text-purple-600"
              >
                <Edit className="h-5 w-5" />
                <span className="text-sm">Edit Amenities</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center space-y-2 h-20 bg-white/50 border-slate-200 hover:bg-white hover:border-orange-300 hover:text-orange-600"
              >
                <Shield className="h-5 w-5" />
                <span className="text-sm">Security Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}