import React from 'react';
import { Home, Users, Shield } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  const navItemClass = (view: AppView) =>
    `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
      currentView === view ? 'text-rose-500' : 'text-slate-400 hover:text-slate-200'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 z-50">
      <div className="grid grid-cols-3 h-full max-w-md mx-auto">
        <button onClick={() => onChangeView(AppView.HOME)} className={navItemClass(AppView.HOME)}>
          <Home size={24} />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button onClick={() => onChangeView(AppView.CONTACTS)} className={navItemClass(AppView.CONTACTS)}>
          <Users size={24} />
          <span className="text-xs font-medium">Contacts</span>
        </button>
        <button onClick={() => onChangeView(AppView.ASSISTANT)} className={navItemClass(AppView.ASSISTANT)}>
          <Shield size={24} />
          <span className="text-xs font-medium">Assistant</span>
        </button>
      </div>
    </nav>
  );
};