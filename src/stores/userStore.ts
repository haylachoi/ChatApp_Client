import { User } from "@/libs/types";
import { create } from "zustand";


interface useUserStoreProps {
  isLogin: boolean;
  currentUser: User | undefined;

  setIsLogin: (isLogin: boolean) => void;
  setCurrentUser: (currentUser: User) => void;
}

const useUserStore = create<useUserStoreProps>()((set) => ({
  isLogin: false,
  currentUser: undefined,

  setIsLogin: (isLogin) => set({isLogin}),
  setCurrentUser: (currentUser) => set({currentUser})
}));


export const useIsLogin = () =>  useUserStore(state => state.isLogin);
export const useCurrentUser = () => useUserStore(state => state.currentUser);

export const useUserActions = () => useUserStore(state => ({setIsLogin: state.setIsLogin, setCurrentUser: state.setCurrentUser}));
