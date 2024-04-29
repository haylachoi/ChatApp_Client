import { create } from "zustand";


interface usePrivateChatStoreProps {
  chats: Message[];
  setChats: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
}

export const usePrivateChatStore = create<usePrivateChatStoreProps>((set) => ({
  chats: [],
  setChats: (messages) => set({chats: messages}),
  addMessage: (message) => set((state) => ({ chats: [...state.chats, message]}))
}));
