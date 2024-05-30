import { MessageData, RoomIdType } from "@/libs/types";
import { create } from "zustand";


// interface RoomChat {
//   id: RoomIdType,
//   chat: MessageData[];
// }
// interface useChatStoreProps {  
//   currentRoomChat?: RoomChat;
//   rooms: RoomChat[];
//   setCurrentChats: (currentChats: RoomChat) => void;
//   addMessage: (roomId: RoomIdType,chat: MessageData) => void;
// }

// const useChatStore = create<useChatStoreProps>((set) => ({
//   rooms: [],
//   setCurrentChats: (chats) => set({currentRoomChat: chats}),
//   addMessage: (roomId, message) =>
    
// }));

// export const useCurrentChats = () => useChatStore(state => state.currentRoomChat);
// export const useSetCurrentChats = () => useChatStore(state => state.setCurrentChats);
// // export const useAddChat = () => useChatStore(state => state.addMessage);
