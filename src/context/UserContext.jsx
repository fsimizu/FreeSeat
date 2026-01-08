// src/context/UserContext.jsx
import {
  createContext,
  useEffect,
  useMemo,
  useState,
  useContext,
  useCallback,
} from "react";
import {
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession,
  signOut as amplifySignOut,
} from "@aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [attributes, setAttributes] = useState(null);
  const [loading, setLoading] = useState(true);

  // Optional convenience flag
  const isAuthenticated = !!user;

  const refreshAttributes = useCallback(
    async (opts = { force: false }) => {
      try {
        if (opts.force) {
          // force-refresh tokens before reading attributes
          await fetchAuthSession({ forceRefresh: true });
        }
        const attrs = await fetchUserAttributes();
        setAttributes(attrs);
        return attrs;
      } catch (e) {
        console.error("refreshAttributes failed", e);
        return null;
      }
    },
    []
  );

  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser(); // throws if not signed in
      setUser(currentUser);
      await refreshAttributes(); // reads and sets attributes
    } catch {
      setUser(null);
      setAttributes(null);
    } finally {
      setLoading(false);
    }
  }, [refreshAttributes]);

  useEffect(() => {
    // Initial load
    loadUser();

    // Auth hub events
    const cancel = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
        case "tokenRefresh":
        case "autoSignIn":
          loadUser();
          break;
        case "signedOut":
        case "userDeleted":
        case "tokenRefresh_failure":
          setUser(null);
          setAttributes(null);
          setLoading(false);
          break;
        default:
          break;
      }
    });

    return () => cancel();
  }, [loadUser]);

  const signOut = useCallback(async () => {
    await amplifySignOut();
    // Hub will fire `signedOut` and clear state
  }, []);

  const value = useMemo(
    () => ({
      user,
      attributes,
      loading,
      isAuthenticated,
      refreshAttributes,
      signOut,
    }),
    [user, attributes, loading, isAuthenticated, refreshAttributes, signOut]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useAuth must be used within <UserProvider>");
  return ctx;
}
