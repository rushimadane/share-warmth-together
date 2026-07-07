import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "@/context/AuthProvider";

/** Read the current auth state. Must be used inside <AuthProvider>. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
