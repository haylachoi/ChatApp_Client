// import { MessageData } from "@/libs/types";
// import { create } from "zustand";


// interface useChatStoreProps {  
//   currentChats: MessageData[];
//   setCurrentChats: (currentChats: MessageData[]) => void;
//   addChat: (chat: MessageData) => void;
// }

// const useChatStore = create<useChatStoreProps>((set) => ({
//   currentChats: [],
//   setCurrentChats: (chats) => set({currentChats: chats}),
//   addChat: (chat) => set((state) => ({ currentChats: [...state.currentChats, chat]}))
// }));

// export const useCurrentChats = () => useChatStore(state => state.currentChats);
// export const useSetCurrentChats = () => useChatStore(state => state.setCurrentChats);
// export const useAddChat = () => useChatStore(state => state.addChat);
