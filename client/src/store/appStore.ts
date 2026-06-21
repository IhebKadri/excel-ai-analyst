import { create } from "zustand";
import type { UploadedFile } from "../types";

interface User {
  userId: string;
  email: string;
}

interface AppState {
  user: User | null;
  selectedFile: UploadedFile | null;
  files: UploadedFile[];
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  setSelectedFile: (file: UploadedFile | null) => void;
  setFiles: (files: UploadedFile[]) => void;
  addFile: (file: UploadedFile) => void;
  removeFile: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  selectedFile: null,
  files: [],
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSelectedFile: (selectedFile) => set({ selectedFile }),
  setFiles: (files) => set({ files }),
  addFile: (file) =>
    set((s) => ({
      files: [
        file,
        ...s.files.filter((f) => f.originalName !== file.originalName),
      ],
    })),
  removeFile: (id) =>
    set((s) => ({ files: s.files.filter((f) => f.id !== id) })),
}));
