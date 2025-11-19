import { LocationData } from '../types';

export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export const generateGoogleMapsLink = (location: LocationData): string => {
  return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
};

export const generateWhatsAppLink = (phone: string, message: string, mapsLink: string): string => {
  const fullMessage = encodeURIComponent(`${message} ${mapsLink}`);
  // Clean phone number: remove non-digits
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${fullMessage}`;
};