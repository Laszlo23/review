import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import {
  auth,
  db,
  loginWithGoogle,
  logoutUser,
  OperationType,
  handleFirestoreError,
  fetchGoogleContacts,
  createGoogleContact,
  cachedAccessToken,
  GoogleContact,
} from '../firebase';
import { BusinessProfile, ReviewItem, CustomerRequest } from '../types';
import {
  initialBusinessProfile,
  initialReviews,
  initialCustomerRequests,
} from '../data/initialData';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  business: BusinessProfile;
  reviews: ReviewItem[];
  customerRequests: CustomerRequest[];
  googleContacts: GoogleContact[];
  contactsLoading: boolean;
  accessToken: string | null;
  updateBusiness: (updated: Partial<BusinessProfile>) => Promise<void>;
  updateReviewReply: (reviewId: string, replyText: string) => Promise<void>;
  logCustomerRequest: (
    customerName: string,
    phone: string,
    channel: 'whatsapp' | 'sms' | 'link' | 'qr'
  ) => Promise<void>;
  fetchContacts: () => Promise<GoogleContact[]>;
  addContact: (contact: { name: string; email?: string; phone?: string }) => Promise<GoogleContact>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [business, setBusiness] = useState<BusinessProfile>(initialBusinessProfile);
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [customerRequests, setCustomerRequests] = useState<CustomerRequest[]>(
    initialCustomerRequests
  );

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Auth is ready - sync business profile
        const bizRef = doc(db, 'businesses', currentUser.uid);
        try {
          const snap = await getDoc(bizRef);
          if (snap.exists()) {
            setBusiness(snap.data() as BusinessProfile);
          } else {
            // Seed initial profile in Firestore
            const newBiz: BusinessProfile = {
              ...initialBusinessProfile,
            };
            await setDoc(bizRef, {
              ...newBiz,
              userId: currentUser.uid,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            setBusiness(newBiz);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `businesses/${currentUser.uid}`);
        }

        // Attach snapshot listeners for reviews
        const reviewsQ = query(
          collection(db, 'reviews'),
          where('userId', '==', currentUser.uid)
        );
        const unsubReviews = onSnapshot(
          reviewsQ,
          (snapshot) => {
            if (!snapshot.empty) {
              const loaded = snapshot.docs.map(
                (d) => ({ id: d.id, ...d.data() } as ReviewItem)
              );
              setReviews(loaded);
            } else {
              // Seed initial reviews if empty
              initialReviews.forEach(async (r) => {
                const rDoc = doc(collection(db, 'reviews'));
                await setDoc(rDoc, {
                  ...r,
                  userId: currentUser.uid,
                  createdAt: new Date().toISOString(),
                });
              });
            }
          },
          (err) => {
            handleFirestoreError(err, OperationType.LIST, 'reviews');
          }
        );

        // Attach snapshot listeners for requests
        const requestsQ = query(
          collection(db, 'customer_requests'),
          where('userId', '==', currentUser.uid)
        );
        const unsubRequests = onSnapshot(
          requestsQ,
          (snapshot) => {
            if (!snapshot.empty) {
              const loaded = snapshot.docs.map(
                (d) => ({ id: d.id, ...d.data() } as CustomerRequest)
              );
              setCustomerRequests(loaded);
            }
          },
          (err) => {
            handleFirestoreError(err, OperationType.LIST, 'customer_requests');
          }
        );

        setLoading(false);
        return () => {
          unsubReviews();
          unsubRequests();
        };
      } else {
        // Fallback to initial local state when unauthenticated
        setBusiness(initialBusinessProfile);
        setReviews(initialReviews);
        setCustomerRequests(initialCustomerRequests);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateBusiness = async (updated: Partial<BusinessProfile>) => {
    setBusiness((prev) => ({ ...prev, ...updated }));
    if (user) {
      const bizRef = doc(db, 'businesses', user.uid);
      try {
        await setDoc(
          bizRef,
          {
            ...updated,
            userId: user.uid,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `businesses/${user.uid}`);
      }
    }
  };

  const updateReviewReply = async (reviewId: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              replied: true,
              replyText,
              replyDate: 'Gerade eben',
              isAutoReplied: true,
            }
          : r
      )
    );

    if (user) {
      const rRef = doc(db, 'reviews', reviewId);
      try {
        await setDoc(
          rRef,
          {
            replied: true,
            replyText,
            replyDate: 'Gerade eben',
            isAutoReplied: true,
            userId: user.uid,
          },
          { merge: true }
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `reviews/${reviewId}`);
      }
    }
  };

  const logCustomerRequest = async (
    customerName: string,
    phone: string,
    channel: 'whatsapp' | 'sms' | 'link' | 'qr'
  ) => {
    const newReq: CustomerRequest = {
      id: `req-${Date.now()}`,
      customerName: customerName || 'Neuer Kunde',
      phoneOrEmail: phone || 'Direktlink',
      channel,
      sentAt: 'Gerade eben',
      status: 'sent',
    };

    setCustomerRequests((prev) => [newReq, ...prev]);

    if (user) {
      const reqRef = doc(db, 'customer_requests', newReq.id);
      try {
        await setDoc(reqRef, {
          ...newReq,
          userId: user.uid,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `customer_requests/${newReq.id}`);
      }
    }
  };

  const [googleContacts, setGoogleContacts] = useState<GoogleContact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  const fetchContacts = async (): Promise<GoogleContact[]> => {
    if (!cachedAccessToken) {
      throw new Error('Bitte zuerst mit Google anmelden, um Google Kontakte abzurufen.');
    }
    setContactsLoading(true);
    try {
      const contacts = await fetchGoogleContacts(cachedAccessToken);
      setGoogleContacts(contacts);
      return contacts;
    } catch (err) {
      console.error('Contacts fetch error:', err);
      throw err;
    } finally {
      setContactsLoading(false);
    }
  };

  const addContact = async (contact: { name: string; email?: string; phone?: string }): Promise<GoogleContact> => {
    if (!cachedAccessToken) {
      throw new Error('Bitte zuerst mit Google anmelden, um einen Kontakt hinzuzufügen.');
    }
    const created = await createGoogleContact(cachedAccessToken, contact);
    setGoogleContacts((prev) => [created, ...prev]);
    return created;
  };

  const signInGoogle = async () => {
    await loginWithGoogle();
  };

  const handleSignOut = async () => {
    await logoutUser();
    setGoogleContacts([]);
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        business,
        reviews,
        customerRequests,
        googleContacts,
        contactsLoading,
        accessToken: cachedAccessToken,
        updateBusiness,
        updateReviewReply,
        logCustomerRequest,
        fetchContacts,
        addContact,
        signInGoogle,
        signOut: handleSignOut,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
