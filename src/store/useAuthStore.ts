import { create } from 'zustand';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export type UserRole = 'client' | 'freelancer' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  walletBalance?: number;
  bio?: string;
  skills?: string[];
  country?: string;
  createdAt: any;
  updatedAt: any;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isInitializing: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  initializeAuth: () => void;
  fetchProfile: (uid: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: false,
  isInitializing: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  fetchProfile: async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        set({ profile: userDoc.data() as UserProfile });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    }
  },
  initializeAuth: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        set({ user, isLoading: true });
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            set({ profile: userDoc.data() as UserProfile });
          } else {
            set({ profile: null });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        } finally {
          set({ isLoading: false, isInitializing: false });
        }
      } else {
        set({ user: null, profile: null, isLoading: false, isInitializing: false });
      }
    });
  },
}));
