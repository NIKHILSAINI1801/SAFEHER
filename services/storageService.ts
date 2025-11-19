import { Contact } from '../types';

const CONTACTS_KEY = 'safeher_contacts';

export const getStoredContacts = (): Contact[] => {
  try {
    const stored = localStorage.getItem(CONTACTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load contacts", e);
    return [];
  }
};

export const saveContacts = (contacts: Contact[]): void => {
  try {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  } catch (e) {
    console.error("Failed to save contacts", e);
  }
};

export const addContact = (contact: Contact): Contact[] => {
  const contacts = getStoredContacts();
  const updated = [...contacts, contact];
  saveContacts(updated);
  return updated;
};

export const removeContact = (id: string): Contact[] => {
  const contacts = getStoredContacts();
  const updated = contacts.filter(c => c.id !== id);
  saveContacts(updated);
  return updated;
};