import { Message, PrivateRoom } from "@/libs/types";
import { create } from "zustand";


interface useRoomStoreProps {
  currentRoom: PrivateRoom | undefined;
  setCurrentRoom: (currentRoom: PrivateRoom) => void;
  roomChats: PrivateRoom[];
  setRoomChats: (roomChats: PrivateRoom[]) => void;
  addRoomChat: (roomChat: PrivateRoom) => void;
  replaceChats: (roomId: string, chats: Message[]) =>void;

  updateCanMessageDisplay: (roomId: string,canDisplay: boolean) => void;
  updateReactionMessage:(message: Message) => void;
  updateLastMessage: (roomId: string, message: Message) => void;
  updateFirstMessageId: (roomId: string, messageId: string) => void;
  addMesageToRoom: (roomId: string, message: Message) => void;
  updateSeenMessage: (roomId: string, message: Message, privateRoom: PrivateRoom | undefined) => void;
  addPreviousMesasges: (roomId: string, chats: Message[]) =>void;
  addNextMesasges: (roomId: string, chats: Message[]) =>void;
}

export const useRoomStore = create<useRoomStoreProps>((set) => ({
  currentRoom: undefined,
  setCurrentRoom: (currentRoom) => set({currentRoom}),
  roomChats: [],
  setRoomChats: (roomChats) => set({roomChats}),
  addRoomChat: (roomchat) => set((state) => ({ roomChats: [...state.roomChats, roomchat]})),
  replaceChats: (roomId, chats) => set((state) => {
    let room = state.roomChats.find(room => room.id == roomId);
    room!.chats= chats;
    return {...state, roomChats: [...state.roomChats]}
  }),
  
  
  addPreviousMesasges: (roomId, messages) => set((state) => {
    let room = state.roomChats.find(room => room.id == roomId);
    if (!room) return state;

    if (!room.chats) room.chats =messages;
      else room.chats = [...messages, ...room?.chats];
    return {...state, roomChats: [...state.roomChats]}
  }),
  addNextMesasges: (roomId, messages) => set((state) => {
    let room = state.roomChats.find(room => room.id == roomId);
    if (!room) return state;

    if (!room?.chats) room!.chats =messages;
      else room!.chats = [...room?.chats, ...messages];

    return {...state, roomChats: [...state.roomChats]}
  }),

  updateCanMessageDisplay: (roomId, canDisplay) => set((state) => {
    let room = state.roomChats.find(room => room.id == roomId);
    if (!room) return state;

    room!.canRoomDisplay = canDisplay;
    return {...state, roomChats: [...state.roomChats]}
  }),

  updateReactionMessage: (newMessage) => set((state) => {
    const room = state.roomChats.find(room => room.id == newMessage.privateRoomId);
    if (!room) return state;

    
    const message = room.chats.find(m => m.id == newMessage.id);
    if (message == undefined) {
      return state;
    }
    message.reactionId = newMessage.reactionId;
    return {...state, roomChats: [...state.roomChats]}
  }),
  updateLastMessage: (roomId, message) => set((state) => {
    let room = state.roomChats.find(room => room.id == roomId);
    if (!room) {
      return state;
    }
    room!.previousLastMessageId = room?.lastMessageId;
    room!.lastMessageId = message.id;
    if(!message.isReaded && message.senderId == room?.friend.id){
      room!.lastUnseenMessage = message;
      room!.unseenMessageCount = room.unseenMessageCount! +1;
    }
    return {...state, roomChats: [...state.roomChats]}
  }),
  updateFirstMessageId: (roomId, messageId) => set((state) => {
    let room = state.roomChats.find(room => room.id == roomId);
    if (!room) return state;

    room!.firstMessageId = messageId;
    return {...state, roomChats: [...state.roomChats]}
  }),
  addMesageToRoom: (roomId, message) => set((state) => {
    let room = state.roomChats.find(r => r.id == roomId);
    if (!room) return state;

    room.chats.push(message);
    room.lastMessageId = message.id;
    return {roomChats: [...state.roomChats]}
  }),
  updateSeenMessage: (roomId, message, privateRoom) => set((state) => {
    let room = state.roomChats.find(r => r.id == roomId);
    if (!room) return state;

    // room.unseenMessageCount = room.unseenMessageCount! -1;
    // if(room.firstUnseenMessageId < message.id){
    //   room.firstUnseenMessageId = message.id;
    // }
    if (privateRoom) {
      room.unseenMessageCount = privateRoom.unseenMessageCount;
      room.lastUnseenMessage = privateRoom.lastUnseenMessage;    
      room.firstUnseenMessageId = privateRoom.firstUnseenMessageId;
    }

    let messageInRoom = room.chats.find(c => c.id == message.id);
    if (messageInRoom == undefined) {
      return state;
    }
    messageInRoom.isReaded = true;

    return {roomChats: [...state.roomChats]};
  })
}));
