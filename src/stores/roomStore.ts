import AddGroupMember from "@/components/add-group-member/add-group-member";
import { MessageData, MessageDetail, Room, RoomMemberInfo, User } from "@/libs/types";
import { roomService } from "@/services/roomService";
import { create } from "zustand";


interface useRoomStoreProps {
  currentRoom: Room | undefined;
  roomChats: Room[];
  roomMembers: User[];

  setCurrentRoom: (currentRoom: Room) => void;
  setRoomChats: (roomChats: Room[]) => void;
  fetchRoomChats: (currentUserId: string) => void;
  addRoomChat: (roomChat: Room) => void;
  replaceChats: (roomId: string, chats: MessageData[]) =>void;
  
  addRoomMember: (roomMemberInfo: RoomMemberInfo) => void;
  removeRoomMember: (roomMemberInfo: RoomMemberInfo) => void;
  
  updateSeenMessage: (room: Room, messageDetail: MessageDetail) => void;
  updateReactionMessage:(roomId: string, messageDetail: MessageDetail) => void;
  
  updateCanDisplayRoom: (roomId: string,canDisplay: boolean) => void;
  updateFirstMessageId: (roomId: string, messageId: string) => void;
  updateLastMessage: (roomId: string, message: MessageData) => void;

  addMesageToRoom: (roomId: string, message: MessageData) => void;
  addPreviousMesasges: (roomId: string, chats: MessageData[]) =>void;
  addNextMesasges: (roomId: string, chats: MessageData[]) =>void;
}

const useRoomStore = create<useRoomStoreProps>()((set) => ({
  currentRoom: undefined, 
  setCurrentRoom: (currentRoom) => set({currentRoom}),
  fetchRoomChats: async (currentUserId) => { 
    try {
      const roomChats = await roomService.getRooms(currentUserId);
      console.log(roomChats);
         
      set({roomChats});
    } catch (error) {
      console.log(error);
    }
  },
  roomChats: [],
  roomMembers: [],
  setRoomChats: (roomChats) => set({roomChats}),
  addRoomChat: (roomchat) => set((state) => ({ roomChats: [...state.roomChats, roomchat]})),
  replaceChats: (roomId, chats) => set((state) => {
      let room = state.roomChats.find(room => room.id == roomId);
      if (!room) return state;
      
      room.chats= chats;
      return {...state, roomChats: [...state.roomChats]};
  }),

  addRoomMember: (roomMemberInfo) => set((state) => {
    let room = state.roomChats.find(room => room.id == roomMemberInfo.roomId);
    if (!room) return state;
   
    const existedRoomMember = room.otherRoomMemberInfos.find((info) => info.userId === roomMemberInfo.userId);
    if (existedRoomMember){
      return state;
    }
    
    room.otherRoomMemberInfos.push(roomMemberInfo);
    return {...state, roomChats: [...state.roomChats]};
  }),
  removeRoomMember: (roomMemberInfo) => set((state) => {
    let room = state.roomChats.find(room => room.id == roomMemberInfo.roomId);
    if (!room) return state;
    
    if (room.currentRoomMemberInfo.userId === roomMemberInfo.userId){
      return { roomChats: state.roomChats.filter((r) => r.id !== roomMemberInfo.roomId)};
    }

    const existedRoomMember = room.otherRoomMemberInfos.find((info) => info.userId === roomMemberInfo.userId);
    if (!existedRoomMember){
      return state;
    }
    room.otherRoomMemberInfos = room.otherRoomMemberInfos.filter((info) => info.userId !== roomMemberInfo.userId);
    return {...state, roomChats: [...state.roomChats]};
  }),

  updateCanDisplayRoom: (roomId, canDisplay) => set((state) => {
    let room = state.roomChats.find(room => room.id == roomId);
    if (!room) return state;

    room.currentRoomMemberInfo.canDisplayRoom = canDisplay;
    return {...state, roomChats: [...state.roomChats]}
  }),
  updateReactionMessage: (roomId, newMessageDetail) => set((state) => {
    const room = state.roomChats.find(room => room.id == roomId);
    if (!room || !room.chats) return state;
  
    const message = room.chats.find(m => m.id == newMessageDetail.messageId);
    if (!message) {
      return state;
    }
    var messageDetail = message.messageDetails.find(md => md.id == newMessageDetail.id);
    if (!messageDetail) {
      message.messageDetails.push(newMessageDetail);
    } else {
      messageDetail.reactionId = newMessageDetail.reactionId;
    }
    return {...state, roomChats: [...state.roomChats]}
  }),
  
  updateFirstMessageId: (roomId, messageId) => set((state) => {
    let room = state.roomChats.find(room => room.id == roomId);
    if (!room) return state;

    room.firstMessageId = messageId;
    return {...state, roomChats: [...state.roomChats]}
  }),

  updateLastMessage: (roomId, message) => set((state) => {
    let room = state.roomChats.find(room => room.id == roomId);
    if (!room) return state;
   
    room.currentRoomMemberInfo.previousLastMessageId = room.lastMessageId;
    room.lastMessageId = message.id;
    
    const currentUserId = room.currentRoomMemberInfo.userId;
    if(!message.messageDetails.find(md => md.userId === currentUserId)&& message.senderId !== currentUserId){  
      room.currentRoomMemberInfo.lastUnseenMessage = message;
      room.currentRoomMemberInfo.unseenMessageCount= room.currentRoomMemberInfo.unseenMessageCount +1;
    }
    return {...state, roomChats: [...state.roomChats]}
  }),
  updateSeenMessage: ( newRoom, messageDetail) => set((state) => {
    let room = state.roomChats.find(r => r.id == newRoom.id);
    if (!room || !newRoom) return state;
    room.currentRoomMemberInfo.unseenMessageCount = newRoom.currentRoomMemberInfo.unseenMessageCount;
    room.currentRoomMemberInfo.lastUnseenMessage = newRoom.currentRoomMemberInfo.lastUnseenMessage;    
    room.currentRoomMemberInfo.firstUnseenMessageId = newRoom.currentRoomMemberInfo.firstUnseenMessageId;
    
    let message = room.chats?.find(m => m.id == messageDetail.messageId);
    if (!message) return {roomChats: [...state.roomChats]};

    if (!message.messageDetails.find(md => md.messageId == messageDetail.messageId && md.userId === messageDetail.userId)){
      message.messageDetails.push(messageDetail);   
    }
    return {roomChats: [...state.roomChats]};
  }),
  addMesageToRoom: (roomId, message) => set((state) => {
    let room = state.roomChats.find(r => r.id == roomId);
    if (!room || !room.chats) return state;

    room.chats.push(message);
    room.lastMessageId = message.id;
    return {roomChats: [...state.roomChats]}
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

    if (!room.chats) room!.chats =messages;
      else room!.chats = [...room?.chats, ...messages];

    return {...state, roomChats: [...state.roomChats]}
  }),
}));

export const useRoomChats = () => useRoomStore(state => state.roomChats);
export const useCurrentRoom = () =>  useRoomStore((state) => state.currentRoom);
export const useCurrentChats = () => useRoomStore((state) => state.currentRoom?.chats);
export const useRoomMembers = () => useRoomStore((state) => state.roomMembers);

export const useRoomActions = () =>  useRoomStore(state => ({
  setCurrentRoom: state.setCurrentRoom,
  setRoomChats: state.setRoomChats,
  fetchRoomChats: state.fetchRoomChats,
  addRoomChat: state.addRoomChat,
  replaceChats: state.replaceChats,

  addRoomMember: state.addRoomMember,
  removeRoomMember: state.removeRoomMember,

  updateCanDisplayRoom: state.updateCanDisplayRoom,
  updateReactionMessage: state.updateReactionMessage,
  updateFirstMessageId: state.updateFirstMessageId,
  updateLastMessage: state.updateLastMessage,

  updateSeenMessage: state.updateSeenMessage,
  addMesageToRoom: state.addMesageToRoom,
  addPreviousMesasges: state.addPreviousMesasges,
  addNextMesasges: state.addNextMesasges,
}))