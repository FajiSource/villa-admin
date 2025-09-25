import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Construction, Waves, Palmtree } from 'lucide-react';

interface PlaceholderContentProps {
  title: string;
  description: string;
}

export function PlaceholderContent({ title, description }: PlaceholderContentProps) {
  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <Card className="glass-effect border-cyan-200 shadow-xl max-w-2xl mx-auto mt-20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-3">
            <div className="p-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500">
              <Construction className="h-8 w-8 text-white" />
            </div>
            <Waves className="h-8 w-8 text-cyan-500" />
            <Palmtree className="h-8 w-8 text-emerald-500" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {title}
          </CardTitle>
          <CardDescription className="text-slate-600 text-lg">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="p-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
            <p className="text-slate-700 text-lg">
              🏖️ This section is currently under development
            </p>
            <p className="text-slate-600 mt-2">
              Our development team is working hard to bring you the best {title.toLowerCase()} experience.
              This feature will be available in the next resort system update.
            </p>
          </div>
          <div className="flex justify-center space-x-2 pt-4">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-150"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}