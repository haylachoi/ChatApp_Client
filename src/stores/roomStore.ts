import {
  MessageData,
  MessageDetail,
  MessageIdType,
  RoomData,
  RoomIdType,
  RoomMemberInfo,
  User,
  UserIdType,
} from '@/libs/types';
import { roomService } from '@/services/roomService';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow'
interface useRoomStoreProps {
  currentRoom?: RoomData;
  rooms: RoomData[];

  setCurrentRoom: (currentRoom: RoomData | undefined) => void;
  setRooms: (roomChats: RoomData[]) => void;
  fetchRooms: (currentUserId: UserIdType) => void;
  addRoom: (roomChat: RoomData) => void;
  removeRoom: (roomId: RoomIdType) => void;
  replaceChats: (roomId: RoomIdType, chats: MessageData[]) => void;

  addRoomMember: (roomMemberInfo: RoomMemberInfo) => void;
  updateRoomMember: (roomMemberInfo: RoomMemberInfo) => void;
  removeRoomMember: (roomId: RoomIdType, userId: UserIdType) => void;

  changeGroupOwner: (roomId: RoomIdType, owner: User) => void;

  updateReactionMessage: (roomId: RoomIdType, messageDetail: MessageDetail) => void;
  deleteMessageDetail: (roomId: RoomIdType, messageDetail: MessageDetail) => void;

  updateCanDisplayRoom: (roomId: RoomIdType, canDisplay: boolean) => void;
  updateFirstMessageId: (roomId: RoomIdType, messageId: MessageIdType) => void;
  addMessage: (roomId: RoomIdType, message: MessageData) => void;

  addPreviousMesasges: (roomId: RoomIdType, chats: MessageData[]) => void;
  addNextMesasges: (roomId: RoomIdType, chats: MessageData[]) => void;

  setViewportScrollTop: (roomId: RoomIdType, scrollTop: number) => void;
}

export const useRoomStore = create<useRoomStoreProps>()((set, get) => ({
  rooms: [],

  setCurrentRoom: (currentRoom) => set({ currentRoom }),
  fetchRooms: async (currentUserId) => {
    try {
      const rooms = await roomService.getRooms(currentUserId);
      console.log(rooms);

      set({ rooms: rooms });
    } catch (error) {
      console.log(error);
    }
  },

  setRooms: (roomChats) => set({ rooms: roomChats }),
  addRoom: (roomchat) =>
    set((state) => ({ rooms: [...state.rooms, roomchat] })),
  removeRoom: (roomId) =>
    set((state) => ({
      rooms: state.rooms.filter((room) => room.id !== roomId),
    })),

  replaceChats: (roomId, chats) =>
    set((state) => {
      let room = state.rooms.find((room) => room.id === roomId);
      if (!room) return state;
      room.isFetched = true;
      room.chats = chats;
      return { rooms: [...state.rooms] };
    }),

  addRoomMember: (roomMemberInfo) =>
    set((state) => {
      let room = state.rooms.find((room) => room.id == roomMemberInfo.roomId);
      if (!room) return state;

      const existedRoomMember = room.otherRoomMemberInfos.find(
        (info) => info.user.id === roomMemberInfo.user.id,
      );
      if (existedRoomMember) {
        return state;
      }

      room.otherRoomMemberInfos = [
        ...room.otherRoomMemberInfos,
        roomMemberInfo,
      ];
      return { ...state, rooms: [...state.rooms] };
    }),
  updateRoomMember: (roomMemberInfo) =>
    set((state) => {
     
      
      const roomIndex = state.rooms.findIndex(r => r.id === roomMemberInfo.roomId);
      if (roomIndex < 0)
        return state;

      const room = {...state.rooms[roomIndex]};

      if (room.currentRoomMemberInfo.user.id === roomMemberInfo.user.id) {
        room.currentRoomMemberInfo = roomMemberInfo;
      } else {
        let existedRoomMember = room.otherRoomMemberInfos.find(
          (info) => info.user.id === roomMemberInfo.user.id,
        );
        if (!existedRoomMember) {
          return state;
        }
        existedRoomMember = roomMemberInfo;
      }
      state.rooms[roomIndex] = room;
      return { rooms: [...state.rooms] };
    }),
  removeRoomMember: (roomId, userId) =>
    set((state) => {
      let room = state.rooms.find((room) => room.id == roomId);
      if (!room) return state;

      const existedRoomMember = room.otherRoomMemberInfos.find(
        (info) => info.user.id === userId,
      );
      if (!existedRoomMember) {
        return state;
      }
      room.otherRoomMemberInfos = room.otherRoomMemberInfos.filter(
        (info) => info.user.id !== userId,
      );
      return { rooms: [...state.rooms] };
    }),

  changeGroupOwner: (roomId, owner) =>
    set((state) => {
      let room = state.rooms.find((room) => room.id == roomId);
      if (!room || !room.groupInfo) return state;

      room.groupInfo.groupOwner = owner;
      return { rooms: [...state.rooms] };
    }),

  updateCanDisplayRoom: (roomId, canDisplay) =>
    set((state) => {
      let room = state.rooms.find((room) => room.id == roomId);
      if (!room) return state;

      room.currentRoomMemberInfo.canDisplayRoom = canDisplay;
      return { rooms: [...state.rooms] };
    }),
  updateReactionMessage: (roomId, newMessageDetail) =>
    set((state) => {
      let room = state.rooms.find((room) => room.id == roomId);
      if (!room || !room.chats) return state;

      let messageIndex = room.chats.findIndex(m => m.id == newMessageDetail.messageId);
      if (messageIndex && messageIndex < 0) {
        return state;
      }
      let newMessage = {...room.chats[messageIndex]};
      newMessage.messageDetails = [...newMessage.messageDetails];
      var messageDetail = newMessage.messageDetails.find(
        (md) => md.id == newMessageDetail.id,
      );
      if (!messageDetail) {
        newMessage.messageDetails.push(newMessageDetail);
      } else {
        messageDetail.reactionId = newMessageDetail.reactionId;
      }
      room.chats[messageIndex] = newMessage;
      return {};

    }),
  deleteMessageDetail: (roomId, newMessageDetail) =>
    set((state) => {
      let room = state.rooms.find((room) => room.id == roomId);
      if (!room || !room.chats) return state;

      let messageIndex = room.chats.findIndex(m => m.id == newMessageDetail.messageId);
      if (messageIndex < 0) {
        return state;
      }
      const newMessage = {...room.chats[messageIndex]};
      newMessage.messageDetails =  newMessage.messageDetails.filter(md => md.messageId !== newMessageDetail.messageId && md.userId !== newMessageDetail.userId);

      room.chats[messageIndex] = newMessage;
      return {rooms: state.rooms};
    }),

  updateFirstMessageId: (roomId, messageId) =>
    set((state) => {
      let room = state.rooms.find((room) => room.id == roomId);
      if (!room) return state;

      room.firstMessageId = messageId;
      return { rooms: [...state.rooms] };
    }),

  addMessage: (roomId, message) =>
    set((state) => {
      const roomIndex = state.rooms.findIndex(r => r.id === roomId);
      if (roomIndex < 0) 
        return state;

      const room = {...state.rooms[roomIndex]};
     
      room.previousLastMessageId = room.lastMessage?.id;
      room.lastMessage = message;
      const currentUserId = room.currentRoomMemberInfo.user.id;
      
      if (message.senderId !== currentUserId) {
        room.currentRoomMemberInfo.unseenMessageCount =
        room.currentRoomMemberInfo.unseenMessageCount + 1;
        
        if (!room.currentRoomMemberInfo.firstUnseenMessageId) {
          room.currentRoomMemberInfo.firstUnseenMessageId = message.id;
        }
      }
      if (room.isFetched) {
        if (
          room.chats &&
          room.chats.length > 0 &&
          room.chats[room.chats.length - 1].id === room.previousLastMessageId
        ) {
          room.chats = [...room.chats, message];
        }
        if (!room.chats || room.chats.length === 0) {
          room.chats = [message];
        }
      }
      state.rooms[roomIndex] = room;
      if (state.currentRoom?.id === room.id) {
        return {rooms: [...state.rooms], currentRoom: room};
      }
      return {rooms: [...state.rooms]};
    }),

  addPreviousMesasges: (roomId, messages) =>
    set((state) => {
      let room = state.rooms.find((room) => room.id == roomId);
      if (!room) return state;

      if (!room.chats) room.chats = messages;
      else room.chats = [...messages, ...room?.chats];
      return { rooms: [...state.rooms] };
    }),
  addNextMesasges: (roomId, messages) =>
    set((state) => {
      let room = state.rooms.find((room) => room.id == roomId);
      if (!room) return state;

      if (!room.chats) room!.chats = messages;
      else room!.chats = [...room?.chats, ...messages];

      return { rooms: [...state.rooms] };
    }),

  setViewportScrollTop: (roomId, scrollTop) =>
    set((state) => {
      let room = state.rooms.find((room) => room.id == roomId);
      if (!room) return state;

      room.viewportTop = scrollTop;
      return state;
    }),
}));

// export const useCurrentRoom = () => useRoomStore(state => state.currentRoom);
export const useRooms = () => useRoomStore((state) => state.rooms);

export const useCurrentChats = () =>
  useRoomStore((state) => state.currentRoom?.chats);

export const useCurrentRoomId = () =>
  useRoomStore((state) => state.currentRoom?.id);

export const useIsCurrentRoomGroup = () =>
  useRoomStore((state) => state.currentRoom?.isGroup);

export const useRoomActions = () =>
  useRoomStore(useShallow((state) => ({
    // setCurrentViewportRef: state.setCurrentViewportRef,
    setCurrentRoom: state.setCurrentRoom,
    setRooms: state.setRooms,
    fetchRooms: state.fetchRooms,
    addRoom: state.addRoom,
    removeRoom: state.removeRoom,
    replaceChats: state.replaceChats,

    addRoomMember: state.addRoomMember,
    updateRoomMember: state.updateRoomMember,
    removeRoomMember: state.removeRoomMember,

    changeGroupOnwer: state.changeGroupOwner,

    updateReactionMessage: state.updateReactionMessage,
    deleteMessageDetail: state.deleteMessageDetail,

    updateCanDisplayRoom: state.updateCanDisplayRoom,
    updateFirstMessageId: state.updateFirstMessageId,
    addMessage: state.addMessage,

    addPreviousMesasges: state.addPreviousMesasges,
    addNextMesasges: state.addNextMesasges,

    setViewportScrollTop: state.setViewportScrollTop,
  })));
