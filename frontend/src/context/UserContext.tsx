"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { apiClient } from "@/lib/apiClient";

type SupabaseUserLike = {
  id: string;
  email: string | null | undefined;
  user_metadata?: Record<string, unknown>;
};

export type UserRole = "pasient" | "personell";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthReady: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = "hjertefrisk:user";

function readStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function writeStoredUser(next: User | null) {
  if (typeof window === "undefined") return;
  try {
    if (!next) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => readStoredUser());
  const [isAuthReady, setIsAuthReady] = useState(false);

  const setUser = (next: User | null) => {
    setUserState(next);
    writeStoredUser(next);
  };

  const hydrateUser = async (supabaseUser: SupabaseUserLike | null) => {
    if (!supabaseUser) {
      setUser(null);
      return;
    }

    const metadataRole = supabaseUser.user_metadata?.role;
    const role: UserRole =
      metadataRole === "personnel" ? "personell" : "pasient";

    const metadataFullName = supabaseUser.user_metadata?.fullName;
    const fullName =
      typeof metadataFullName === "string" ? metadataFullName : undefined;
    const fallbackName: string = fullName ?? supabaseUser.email ?? "Bruker";

    try {
      if (role === "personell") {
        const local = await apiClient.get<{
          id: number;
          supabaseUserId: string;
          name: string;
          email: string;
        }>(`/api/Personnel/by-supabase/${supabaseUser.id}`);

        setUser({
          id: String(local.id),
          name: local.name,
          email: local.email,
          role,
        });
        return;
      }

      const local = await apiClient.get<{
        id: number;
        supabaseUserId: string;
        name: string;
        email: string;
      }>(`/api/Patients/by-supabase/${supabaseUser.id}`);

      setUser({
        id: String(local.id),
        name: local.name,
        email: local.email,
        role,
      });
    } catch {
      // Fallback hvis backend-oppslag feiler (f.eks. bruker finnes ikke lokalt enda)
      setUser({
        id: supabaseUser.id,
        name: fallbackName,
        email: supabaseUser.email ?? "",
        role,
      });
    }
  };

  const logout = () => setUser(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!isMounted) return;
        await hydrateUser(data.user as unknown as SupabaseUserLike | null);
      } finally {
        if (isMounted) setIsAuthReady(true);
      }
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      await hydrateUser((session?.user as unknown as SupabaseUserLike) ?? null);
      if (isMounted) setIsAuthReady(true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logout, isAuthReady }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
