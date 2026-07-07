import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile } from "@/services/users.service";
import type { UserProfile, UserType } from "@/types/models";

export interface AuthContextValue {
  /** The raw Firebase auth user, or null when signed out. */
  user: User | null;
  /** The user's Firestore profile (donor or recipient), or null. */
  profile: UserProfile | null;
  /** Convenience accessor derived from the profile. */
  userType: UserType | null;
  /** True until Firebase has restored the session AND the profile is loaded. */
  loading: boolean;
  /** Re-fetch the profile (e.g. after updating the user's saved location). */
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

/**
 * The single place that subscribes to Firebase auth. Everything else reads
 * from this context via useAuth(), which removes the duplicated
 * onAuthStateChanged blocks and the refresh race condition they caused.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (current: User | null) => {
    if (!current) {
      setProfile(null);
      setUserType(null);
      return;
    }
    const resolved = await getUserProfile(current.uid);
    setProfile(resolved?.profile ?? null);
    setUserType(resolved?.userType ?? null);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (current) => {
      setUser(current);
      await loadProfile(current);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [loadProfile]);

  const refreshProfile = useCallback(
    () => loadProfile(user),
    [loadProfile, user]
  );

  return (
    <AuthContext.Provider
      value={{ user, profile, userType, loading, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
