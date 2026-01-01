import { create } from "zustand";
import { api, setAuth } from "../lib/api";

export const useAuth = create((set, get) => ({
  user: null,
  token: null,
  loading: false,

  // -------------------------
  // Init auth from localStorage (SAFE)
  // -------------------------
  initFromStorage: () => {
    try {
      const rawToken = localStorage.getItem("token");
      const rawUser = localStorage.getItem("user");

      // ❌ half-auth or corrupted storage
      if (
        !rawToken ||
        !rawUser ||
        rawUser === "undefined" ||
        rawUser === "null"
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ token: null, user: null });
        return;
      }

      const parsedUser = JSON.parse(rawUser);

      setAuth(rawToken);
      set({
        token: rawToken,
        user: parsedUser,
      });
    } catch (err) {
      console.error("Auth hydration failed:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ token: null, user: null });
    }
  },

  // -------------------------
  // Signup
  // -------------------------
  signup: async (payload) => {
    set({ loading: true });
    try {
      const { data } = await api.post("/auth/signup", payload);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setAuth(data.token);
      set({ user: data.user, token: data.token, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  // -------------------------
  // Login
  // -------------------------
  login: async (payload) => {
    set({ loading: true });
    try {
      const { data } = await api.post("/auth/login", payload);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setAuth(data.token);
      set({ user: data.user, token: data.token, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  // -------------------------
  // Logout (FULL CLEANUP)
  // -------------------------
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth(null);
    set({ user: null, token: null });
  },

  // -------------------------
  // Safe user updater (NO undefined)
  // -------------------------
  setUser: (updater) => {
    set((state) => {
      const nextUser =
        typeof updater === "function"
          ? updater(state.user)
          : updater;

      if (nextUser) {
        localStorage.setItem("user", JSON.stringify(nextUser));
      } else {
        localStorage.removeItem("user");
      }

      return { user: nextUser };
    });
  },
}));
