import React from 'react';
import Logo from '../Logo';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <div className="relative overflow-hidden  resort-gradient-primary p-8 shadow-2xl mb-8">
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative">
        <div className="flex items-center space-x-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="scale-75">
              <div className="leading-tight inline-block text-white text-[1em]">
                <strong className="ethnocentric block text-[1em]">
                  VILLA PEREZ
                </strong>
                <span className="poppins font-semibold block text-right text-[0.3em]">
                  R E S O R T
                </span>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {title}
            </h1>
            <p className="text-white/80 text-lg">
              Here’s what’s happening at Villa Perez Resort today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}