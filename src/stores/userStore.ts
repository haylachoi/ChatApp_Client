import { User } from "@/libs/types";
import { create } from "zustand";


interface useUserStoreProps {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  currentUser: User | undefined;
  setCurrentUser: (currentUser: User) => void;
}

export const useUserStore = create<useUserStoreProps>((set) => ({
  isLogin: false,
  setIsLogin: (isLogin) => set({isLogin}),
  currentUser: undefined,
  setCurrentUser: (currentUser) => set({currentUser})
}));
