import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { GoogleContact } from '../firebase';
import { X, Users, Search, Plus, UserCheck, AlertCircle, Check, Loader2, LogIn } from 'lucide-react';

interface GoogleContactsPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (contact: { name: string; phone: string; email: string }) => void;
}

export const GoogleContactsPickerModal: React.FC<GoogleContactsPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectContact,
}) => {
  const {
    user,
    accessToken,
    googleContacts,
    contactsLoading,
    fetchContacts,
    addContact,
    signInGoogle,
  } = useFirebase();

  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New Contact Form State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Confirmation Modal State (MANDATORY for mutating operations)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    name: string;
    phone: string;
    email: string;
  }>({ open: false, name: '', phone: '', email: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoad = async () => {
    setErrorMsg(null);
    try {
      if (!user || !accessToken) {
        await signInGoogle();
      }
      await fetchContacts();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error fetching contacts');
    }
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setConfirmDialog({
      open: true,
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim(),
    });
  };

  const handleConfirmCreateContact = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const created = await addContact({
        name: confirmDialog.name,
        phone: confirmDialog.phone,
        email: confirmDialog.email,
      });
      setConfirmDialog({ open: false, name: '', phone: '', email: '' });
      setIsAddingNew(false);
      setNewName('');
      setNewPhone('');
      setNewEmail('');
      setSuccessMsg(`Created contact "${created.name}" in Google Contacts!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to create contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredContacts = googleContacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-xl border border-zinc-200/80 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">Google Contacts</h3>
              <p className="text-xs text-zinc-500">Import customers directly from your Google account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="overflow-y-auto space-y-4 pr-1 flex-1">
          {!user || !accessToken ? (
            <div className="text-center py-8 space-y-4 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 p-6">
              <Users className="w-10 h-10 text-zinc-400 mx-auto" />
              <div>
                <p className="text-sm font-semibold text-zinc-900">Google Account Required</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Sign in with Google to import your contacts for review requests.
                </p>
              </div>
              <button
                onClick={handleLoad}
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Connect Google Contacts</span>
              </button>
            </div>
          ) : (
            <>
              {/* Actions Header */}
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={handleLoad}
                  disabled={contactsLoading}
                  className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {contactsLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Users className="w-3.5 h-3.5" />
                  )}
                  <span>{googleContacts.length > 0 ? 'Refresh Contacts' : 'Fetch Google Contacts'}</span>
                </button>

                <button
                  onClick={() => setIsAddingNew(!isAddingNew)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingNew ? 'Cancel New Contact' : 'Add to Google Contacts'}</span>
                </button>
              </div>

              {/* Add New Contact Inline Form */}
              {isAddingNew && (
                <form onSubmit={handleOpenConfirm} className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-blue-900">Create New Google Contact</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Save Contact to Google
                  </button>
                </form>
              )}

              {/* Search Bar */}
              {googleContacts.length > 0 && (
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, email, or phone..."
                    className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              )}

              {/* Contacts List */}
              <div className="space-y-2">
                {googleContacts.length === 0 && !contactsLoading && (
                  <div className="text-center py-6 text-zinc-400 text-xs">
                    Click "Fetch Google Contacts" above to view your address book.
                  </div>
                )}

                {contactsLoading && (
                  <div className="text-center py-8 text-zinc-500 text-xs flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-600" />
                    <span>Loading Google Contacts...</span>
                  </div>
                )}

                {filteredContacts.map((contact) => (
                  <div
                    key={contact.resourceName}
                    className="p-3 bg-zinc-50/80 hover:bg-zinc-100 rounded-2xl border border-zinc-200/60 flex items-center justify-between transition-colors text-xs"
                  >
                    <div className="space-y-0.5">
                      <p className="font-semibold text-zinc-900">{contact.name}</p>
                      <p className="text-[11px] text-zinc-500">
                        {contact.phone && <span>{contact.phone}</span>}
                        {contact.phone && contact.email && <span> · </span>}
                        {contact.email && <span>{contact.email}</span>}
                        {!contact.phone && !contact.email && <span className="italic text-zinc-400">No contact info</span>}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onSelectContact({
                          name: contact.name,
                          phone: contact.phone,
                          email: contact.email,
                        });
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    >
                      <UserCheck className="w-3 h-3" />
                      <span>Select</span>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mandatory User Confirmation Dialog for Destructive / Mutating Operations */}
      {confirmDialog.open && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-blue-600">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-zinc-900">Confirm New Contact</h4>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Are you sure you want to create a new contact in your Google Account for{' '}
              <strong className="text-zinc-900">{confirmDialog.name}</strong>?
              {confirmDialog.phone && (
                <> Phone: <span className="font-mono text-zinc-900">{confirmDialog.phone}</span>.</>
              )}
              {confirmDialog.email && (
                <> Email: <span className="font-mono text-zinc-900">{confirmDialog.email}</span>.</>
              )}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setConfirmDialog({ open: false, name: '', phone: '', email: '' })}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCreateContact}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Yes, Create Contact</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
