import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// CRITICAL: Must pass firestoreDatabaseId
export const db = (firebaseConfig as any).firestoreDatabaseId
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/contacts');
googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/contacts.other.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/directory.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/user.phonenumbers.read');
googleProvider.addScope('https://www.googleapis.com/auth/user.emails.read');

export let cachedAccessToken: string | null = null;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

testFirestoreConnection();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
    }
    return { user: result.user, accessToken: credential?.accessToken };
  } catch (err) {
    console.error('Google Sign-In Error:', err);
    throw err;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    cachedAccessToken = null;
  } catch (err) {
    console.error('Sign-Out Error:', err);
  }
};

export interface GoogleContact {
  resourceName: string;
  name: string;
  email: string;
  phone: string;
}

export async function fetchGoogleContacts(token: string): Promise<GoogleContact[]> {
  const response = await fetch(
    'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers&pageSize=100',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    const errText = await response.text();
    console.error('Failed to fetch contacts:', errText);
    throw new Error('Failed to fetch Google Contacts');
  }
  const data = await response.json();
  const connections = data.connections || [];
  return connections.map((c: any) => {
    const name = c.names?.[0]?.displayName || 'Unbenannter Kontakt';
    const email = c.emailAddresses?.[0]?.value || '';
    const phone = c.phoneNumbers?.[0]?.value || '';
    return {
      resourceName: c.resourceName,
      name,
      email,
      phone,
    };
  });
}

export async function createGoogleContact(
  token: string,
  contact: { name: string; email?: string; phone?: string }
): Promise<GoogleContact> {
  const body: any = {
    names: [{ givenName: contact.name }],
  };
  if (contact.email) {
    body.emailAddresses = [{ value: contact.email }];
  }
  if (contact.phone) {
    body.phoneNumbers = [{ value: contact.phone }];
  }

  const response = await fetch('https://people.googleapis.com/v1/people:createContact', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Failed to create contact:', errText);
    throw new Error('Failed to create contact in Google Contacts');
  }

  const data = await response.json();
  return {
    resourceName: data.resourceName,
    name: data.names?.[0]?.displayName || contact.name,
    email: data.emailAddresses?.[0]?.value || contact.email || '',
    phone: data.phoneNumbers?.[0]?.value || contact.phone || '',
  };
}
