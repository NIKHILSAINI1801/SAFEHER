import React, { useState } from 'react';
import { Contact } from '../types';
import { UserPlus, Trash2, Phone, AlertCircle, Users } from 'lucide-react';

interface ContactManagerProps {
  contacts: Contact[];
  onAdd: (name: string, phone: string) => void;
  onRemove: (id: string) => void;
}

export const ContactManager: React.FC<ContactManagerProps> = ({ contacts, onAdd, onRemove }) => {
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    // Simple validation
    if (newPhone.length < 10) {
        setError("Please enter a valid phone number with country code.");
        return;
    }

    onAdd(newName, newPhone);
    setNewName('');
    setNewPhone('');
    setError('');
  };

  return (
    <div className="p-6 pb-24 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Users className="text-rose-500" />
        Emergency Contacts
      </h2>

      <form onSubmit={handleSubmit} className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g., Mom, Partner"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">WhatsApp Number</label>
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="e.g., 15551234567 (Include Country Code)"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">Enter full number with country code (no +)</p>
          </div>
          
          {error && (
             <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-2 rounded">
                 <AlertCircle size={16}/> {error}
             </div>
          )}

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus size={20} />
            Add Contact
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-300 mb-2">Your Circle ({contacts.length})</h3>
        {contacts.length === 0 ? (
            <div className="text-slate-500 text-center py-8 italic">
                No contacts added yet. Add trusted people to alert them in emergencies.
            </div>
        ) : (
            contacts.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-rose-400 font-bold">
                    {contact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-medium text-white">{contact.name}</p>
                    <p className="text-sm text-slate-400 flex items-center gap-1">
                        <Phone size={12}/> {contact.phone}
                    </p>
                </div>
                </div>
                <button
                onClick={() => onRemove(contact.id)}
                className="text-slate-500 hover:text-red-400 p-2 transition-colors"
                aria-label="Remove contact"
                >
                <Trash2 size={20} />
                </button>
            </div>
            ))
        )}
      </div>
    </div>
  );
};