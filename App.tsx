import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { ContactManager } from './components/ContactManager';
import { SafetyAssistant } from './components/SafetyAssistant';
import { SOSView } from './components/SOSView';
import { AppView, Contact } from './types';
import { getStoredContacts, addContact, removeContact } from './services/storageService';
import { ShieldAlert, HeartPulse, Info } from 'lucide-react';
import { SAFETY_TIPS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tipOfTheDay, setTipOfTheDay] = useState('');

  useEffect(() => {
    setContacts(getStoredContacts());
    const randomTip = SAFETY_TIPS[Math.floor(Math.random() * SAFETY_TIPS.length)];
    setTipOfTheDay(randomTip);
  }, []);

  const handleAddContact = (name: string, phone: string) => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name,
      phone,
      isPrimary: contacts.length === 0
    };
    const updated = addContact(newContact);
    setContacts(updated);
  };

  const handleRemoveContact = (id: string) => {
    const updated = removeContact(id);
    setContacts(updated);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.CONTACTS:
        return (
          <ContactManager 
            contacts={contacts} 
            onAdd={handleAddContact} 
            onRemove={handleRemoveContact} 
          />
        );
      case AppView.ASSISTANT:
        return <SafetyAssistant />;
      case AppView.SOS_ACTIVE:
        return (
            <SOSView 
                contacts={contacts} 
                onCancel={() => setCurrentView(AppView.HOME)}
            />
        );
      case AppView.HOME:
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 pb-24 text-center space-y-8">
             
             <div className="space-y-2">
                 <div className="inline-flex items-center justify-center p-3 bg-rose-500/10 rounded-full mb-2">
                     <HeartPulse className="text-rose-500" size={32} />
                 </div>
                 <h1 className="text-4xl font-black text-white tracking-tight">SafeHer</h1>
                 <p className="text-slate-400">Your personal safety companion</p>
             </div>

             {/* SOS BUTTON */}
             <div className="relative group">
                 <div className="absolute inset-0 bg-red-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pulse-ring"></div>
                 <button 
                    onClick={() => setCurrentView(AppView.SOS_ACTIVE)}
                    className="relative w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-rose-700 text-white shadow-[0_0_40px_rgba(225,29,72,0.4)] border-4 border-red-400 flex flex-col items-center justify-center transform transition-all hover:scale-105 active:scale-95 z-10"
                 >
                    <ShieldAlert size={64} className="mb-2" />
                    <span className="text-2xl font-bold tracking-wider">SOS</span>
                    <span className="text-xs opacity-80 font-medium mt-1">TAP FOR HELP</span>
                 </button>
             </div>

             {/* Quick Stats/Info */}
             <div className="w-full max-w-sm bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 text-left">
                <div className="flex items-center gap-2 text-slate-300 mb-2">
                    <Info size={16} className="text-blue-400"/>
                    <span className="text-sm font-semibold uppercase tracking-wide">Safety Tip</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                    "{tipOfTheDay}"
                </p>
             </div>
             
             {contacts.length === 0 && (
                 <div className="text-yellow-500 text-sm bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20 animate-pulse">
                     ⚠ You haven't added any emergency contacts yet. Go to the Contacts tab to set them up.
                 </div>
             )}

          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-rose-500 selection:text-white">
      {/* Render View */}
      <main className="max-w-md mx-auto min-h-screen relative">
        {renderContent()}
      </main>

      {/* Navigation (Hidden if SOS is active) */}
      {currentView !== AppView.SOS_ACTIVE && (
        <Navigation currentView={currentView} onChangeView={setCurrentView} />
      )}
    </div>
  );
};

export default App;