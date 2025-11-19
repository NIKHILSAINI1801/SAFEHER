import React, { useEffect, useState } from 'react';
import { Contact, LocationData } from '../types';
import { getCurrentLocation, generateGoogleMapsLink, generateWhatsAppLink } from '../services/locationService';
import { DEFAULT_SOS_MESSAGE } from '../constants';
import { AlertTriangle, MapPin, Send, XCircle, Loader2, CheckCircle2 } from 'lucide-react';

interface SOSViewProps {
  contacts: Contact[];
  onCancel: () => void;
}

export const SOSView: React.FC<SOSViewProps> = ({ contacts, onCancel }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchLocation = async () => {
      try {
        const loc = await getCurrentLocation();
        if (mounted) {
          setLocation(loc);
          setLoading(false);
        }
      } catch (err: any) {
        if (mounted) {
          console.error(err);
          setError("Could not get accurate location. Sending last known or empty location.");
          // Fallback to empty location to allow sending message anyway
          setLocation({ latitude: 0, longitude: 0, accuracy: 0, timestamp: Date.now() });
          setLoading(false);
        }
      }
    };

    fetchLocation();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSend = (contact: Contact) => {
    if (!location) return;
    const mapsLink = location.latitude !== 0 ? generateGoogleMapsLink(location) : "[Location Unavailable]";
    const link = generateWhatsAppLink(contact.phone, DEFAULT_SOS_MESSAGE, mapsLink);
    window.open(link, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col animate-in fade-in duration-300">
      <div className="p-6 bg-red-900/20 border-b border-red-900/50 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 rounded-lg animate-pulse">
                <AlertTriangle className="text-white" size={24}/>
            </div>
            <div>
                <h1 className="text-2xl font-bold text-red-500">EMERGENCY MODE</h1>
                <p className="text-red-300 text-sm">Broadcast your location</p>
            </div>
         </div>
         <button onClick={onCancel} className="text-slate-400 hover:text-white">
            <XCircle size={32} />
         </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        
        <div className="mb-8 bg-slate-900 rounded-xl p-6 border border-slate-800 text-center">
            {loading ? (
                <div className="flex flex-col items-center gap-3 py-4">
                    <Loader2 size={40} className="animate-spin text-rose-500"/>
                    <p className="text-slate-300">Acquiring GPS Satellite Lock...</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2">
                    {location && location.latitude !== 0 ? (
                        <>
                            <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-2">
                                <MapPin size={24} />
                            </div>
                            <h3 className="text-lg font-medium text-green-400">Location Acquired</h3>
                            <p className="text-slate-400 text-sm">
                                Lat: {location.latitude.toFixed(5)}, Long: {location.longitude.toFixed(5)}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">Accuracy: ~{location.accuracy.toFixed(0)} meters</p>
                            <iframe
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.01},${location.latitude - 0.01},${location.longitude + 0.01},${location.latitude + 0.01}&layer=mapnik&marker=${location.latitude},${location.longitude}`}
                                width="100%"
                                height="200"
                                style={{ border: 'none', borderRadius: '8px', marginTop: '10px' }}
                                title="Location Map"
                            ></iframe>
                        </>
                    ) : (
                         <>
                            <div className="w-12 h-12 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center mb-2">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-lg font-medium text-yellow-400">GPS Unavailable</h3>
                            <p className="text-slate-400 text-sm">Messages will be sent without precise coordinates.</p>
                            <button
                                onClick={() => {
                                    setLoading(true);
                                    setError(null);
                                    getCurrentLocation()
                                        .then(loc => {
                                            setLocation(loc);
                                            setLoading(false);
                                        })
                                        .catch(err => {
                                            console.error(err);
                                            setError("Could not get accurate location. Sending last known or empty location.");
                                            setLocation({ latitude: 0, longitude: 0, accuracy: 0, timestamp: Date.now() });
                                            setLoading(false);
                                        });
                                }}
                                className="mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Retry Location
                            </button>
                         </>
                    )}
                </div>
            )}
        </div>

        <h2 className="text-xl font-semibold text-white mb-4">Send SOS to:</h2>
        
        <div className="space-y-3">
            {contacts.length === 0 ? (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-center text-slate-500">
                    No contacts configured. Please add contacts in the main menu.
                </div>
            ) : (
                contacts.map(contact => (
                    <button
                        key={contact.id}
                        onClick={() => handleSend(contact)}
                        disabled={loading}
                        className="w-full flex items-center justify-between bg-slate-800 hover:bg-slate-700 p-4 rounded-xl border border-slate-700 group transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-xl font-bold text-rose-500">
                                {contact.name.charAt(0)}
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-lg text-white">{contact.name}</div>
                                <div className="text-slate-400 text-sm">{contact.phone}</div>
                            </div>
                        </div>
                        <div className="bg-rose-600 p-3 rounded-full text-white group-hover:bg-rose-500 shadow-lg shadow-rose-900/20">
                            <Send size={20} className="ml-1" />
                        </div>
                    </button>
                ))
            )}
        </div>
      </div>
      
      <div className="p-6 bg-slate-900 border-t border-slate-800">
          <p className="text-center text-slate-500 text-xs">
              This tool constructs a WhatsApp message. You must press "Send" in the WhatsApp app to complete the alert.
          </p>
      </div>
    </div>
  );
};