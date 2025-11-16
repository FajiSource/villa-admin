import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Palmtree } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Logo from './Logo';

interface LoginFormProps {
  onLogin: () => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1520839672389-f7c489c76d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMHJlc29ydCUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzU3MjQ5NzkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Tropical resort background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-cyan-800/40 to-teal-700/60"></div>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md relative z-10 glass-effect border-white/30 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="scale-150">
                <Logo />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl text-white/95">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-white/80">
            Welcome back! Access your luxury resort management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full pelagic-gradient-primary hover:opacity-90 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Access Dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}