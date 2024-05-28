import { Profile, User } from "@/libs/types";
import { clearToken } from "@/services/authService";
import { chatHub, clientHub, roomHub, userHub } from "@/services/hubConnection";
import { create } from "zustand";


interface useAuthStoreProps {
  isLogin: boolean;
  isConnected: boolean;
  currentUser: Profile | undefined;
  isLoginPage: boolean;
  
  updateAvatar: (avatar: string) => void;
  logout: () => void;
  setIsLogin: (isLogin: boolean) => void;
  setIsConnected: (isLogin: boolean) => void;
  setCurrentUser: (currentUser: Profile) => void;
  setIsLoginPage: (isLoginPage: boolean) => void;
}

const useAuthStore = create<useAuthStoreProps>()((set) => ({
  isLogin: false,
  isConnected: false,
  currentUser: undefined,
  isLoginPage: true,
  
  updateAvatar: (avatar) => set((state) => ({currentUser: {...state.currentUser,avatar} as Profile})),
  // logout: () => set(() => {
  //   clearToken();
  //   chatHub.stop();
  //   roomHub.stop();
  //   userHub.stop();
  //   clientHub.stop();
  //   return {isLogin: false, isConnected: false, currentUser: undefined};
  // }),

  logout: () => {
    clearToken();
    location.reload();
  },
  setIsLogin: (isLogin) => set({isLogin}),
  setIsConnected: (isConnected) => set({isConnected}),
  setCurrentUser: (currentUser) => set({currentUser, isLogin: true}),
  setIsLoginPage: (isLoginPage) => set({isLoginPage})
}));


export const useIsLogin = () =>  useAuthStore(state => state.isLogin);
export const useIsConnected = () =>  useAuthStore(state => state.isConnected);
export const useCurrentUser = () => useAuthStore(state => state.currentUser);

export const useAuthActions = () => useAuthStore(state => {
  const {isLogin, currentUser, isConnected, ...rest} = state;
  return {...rest};
});
