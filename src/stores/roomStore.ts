import AddGroupMember from '@/components/add-group-member/add-group-member';
import {
  MessageData,
  MessageDetail,
  Room,
  RoomMemberInfo,
  User,
} from '@/libs/types';
import { roomService } from '@/services/roomService';
import { create } from 'zustand';

interface useRoomStoreProps {
  currentRoom?: Room;
  rooms: Room[];

  setCurrentRoom: (currentRoom: Room | undefined) => void;
  setRooms: (roomChats: Room[]) => void;
  fetchRooms: (currentUserId: string) => void;
  addRoom: (roomChat: Room) => void;
  removeRoom: (roomId: string) => void;
  replaceChats: (roomId: string, chats: MessageData[]) => void;

  addRoomMember: (roomMemberInfo: RoomMemberInfo) => void;
  updateRoomMember: (roomMemberInfo: RoomMemberInfo) => void;
  removeRoomMember: (roomId: string, userId: string) => void;

  changeGroupOwner: (roomId: string, owner: User) => void;

  updateReactionMessage: (roomId: string, messageDetail: MessageDetail) => void;

  updateCanDisplayRoom: (roomId: string, canDisplay: boolean) => void;
  updateFirstMessageId: (roomId: string, messageId: string) => void;
  addMessage: (roomId: string, message: MessageData) => void;

  addPreviousMesasges: (roomId: string, chats: MessageData[]) => void;
  addNextMesasges: (roomId: string, chats: MessageData[]) => void;

  setViewportScrollTop: (roomId: string, scrollTop: number) => void;
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
      let room = state.rooms.find((room) => room.id == roomMemberInfo.roomId);
      if (!room) return state;

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
      const room = state.rooms.find((room) => room.id == roomId);
      if (!room || !room.chats) return state;

      const message = room.chats.find(
        (m) => m.id == newMessageDetail.messageId,
      );
      if (!message) {
        return state;
      }
      var messageDetail = message.messageDetails.find(
        (md) => md.id == newMessageDetail.id,
      );
      if (!messageDetail) {
        message.messageDetails = [...message.messageDetails, newMessageDetail];
      } else {
        messageDetail.reactionId = newMessageDetail.reactionId;
      }
      return { rooms: [...state.rooms] };
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
      let room = state.rooms.find((room) => room.id == roomId);
      if (!room) return state;
      
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
      return { rooms: [...state.rooms] };
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
  useRoomStore((state) => ({
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

    updateCanDisplayRoom: state.updateCanDisplayRoom,
    updateReactionMessage: state.updateReactionMessage,
    updateFirstMessageId: state.updateFirstMessageId,
    addMessage: state.addMessage,

    addPreviousMesasges: state.addPreviousMesasges,
    addNextMesasges: state.addNextMesasges,

    setViewportScrollTop: state.setViewportScrollTop,
  }));
