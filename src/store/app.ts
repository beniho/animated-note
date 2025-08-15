import { create } from "zustand";
import type { Article } from "@/types/article";

interface EditorConfig {
  autoSave: boolean;
}

interface AppStore {
  user: { id: string; name?: string | null; image?: string | null } | null;
  isAuthenticated: boolean;

  currentArticle: Article | null;
  editorConfig: EditorConfig;

  theme: "light" | "dark";
  sidebarOpen: boolean;

  setUser: (user: AppStore["user"]) => void;
  updateArticle: (article: Article | null) => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  isAuthenticated: false,
  currentArticle: null,
  editorConfig: { autoSave: true },
  theme: "light",
  sidebarOpen: false,

  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
  updateArticle: (article) => set({ currentArticle: article }),
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
