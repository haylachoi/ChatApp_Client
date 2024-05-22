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
  // roomMembers: User[];

  setCurrentRoom: (currentRoom: Room | undefined) => void;
  setRooms: (roomChats: Room[]) => void;
  fetchRooms: (currentUserId: string) => void;
  addRoom: (roomChat: Room) => void;
  removeRoom: (roomId: string) => void;
  replaceChats: (roomId: string, chats: MessageData[]) => void;

  addRoomMember: (roomMemberInfo: RoomMemberInfo) => void;
  removeRoomMember: (roomMemberInfo: RoomMemberInfo) => void;

  updateSeenMessage: (room: Room, messageDetail: MessageDetail) => void;
  updateReactionMessage: (roomId: string, messageDetail: MessageDetail) => void;

  updateCanDisplayRoom: (roomId: string, canDisplay: boolean) => void;
  updateFirstMessageId: (roomId: string, messageId: string) => void;
  updateLastMessage: (roomId: string, message: MessageData) => void;

  addMesageToRoom: (roomId: string, message: MessageData) => void;
  addPreviousMesasges: (roomId: string, chats: MessageData[]) => void;
  addNextMesasges: (roomId: string, chats: MessageData[]) => void;
}

const useRoomStore = create<useRoomStoreProps>()((set) => ({
  setCurrentRoom: (currentRoom) => set({ currentRoom }),
  fetchRooms: async (currentUserId) => {
    try {
      const roomChats = await roomService.getRooms(currentUserId);
      console.log(roomChats);

      set({ rooms: roomChats });
    } catch (error) {
      console.log(error);
    }
  },
  rooms: [],
  // roomMembers: [],
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

      room.otherRoomMemberInfos.push(roomMemberInfo);
      return { ...state, rooms: [...state.rooms] };
    }),
  removeRoomMember: (roomMemberInfo) =>
    set((state) => {
      let room = state.rooms.find((room) => room.id == roomMemberInfo.roomId);
      if (!room) return state;

      if (room.currentRoomMemberInfo.user.id === roomMemberInfo.user.id) {
        return {
          rooms: state.rooms.filter((r) => r.id !== roomMemberInfo.roomId),
        };
      }

      const existedRoomMember = room.otherRoomMemberInfos.find(
        (info) => info.user.id === roomMemberInfo.user.id,
      );
      if (!existedRoomMember) {
        return state;
      }
      room.otherRoomMemberInfos = room.otherRoomMemberInfos.filter(
        (info) => info.user.id !== roomMemberInfo.user.id,
      );
      return { ...state, rooms: [...state.rooms] };
    }),

  updateCanDisplayRoom: (roomId, canDisplay) =>
    set((state) => {
      let room = state.rooms.find((room) => room.id == roomId);
      if (!room) return state;

      room.currentRoomMemberInfo.canDisplayRoom = canDisplay;
      return { ...state, rooms: [...state.rooms] };
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
        message.messageDetails.push(newMessageDetail);
      } else {
        messageDetail.reactionId = newMessageDetail.reactionId;
      }
      return { ...state, rooms: [...state.rooms] };
    }),

  updateFirstMessageId: (roomId, messageId) =>
    set((state) => {
      let room = state.rooms.find((room) => room.id == roomId);
      if (!room) return state;

      room.firstMessageId = messageId;
      return { ...state, rooms: [...state.rooms] };
    }),

  updateLastMessage: (roomId, message) =>
    set((state) => {
      let room = state.rooms.find((room) => room.id == roomId);
      if (!room) return state;

      room.previousLastMessageId = room.lastMessage?.id;
      room.lastMessage = message;

      const currentUserId = room.currentRoomMemberInfo.user.id;
      if (
        !message.messageDetails.find((md) => md.user.id === currentUserId) &&
        message.senderId !== currentUserId
      ) {
        room.currentRoomMemberInfo.unseenMessageCount =
          room.currentRoomMemberInfo.unseenMessageCount + 1;
      }
      return { ...state, rooms: [...state.rooms] };
    }),
  updateSeenMessage: (newRoom, messageDetail) =>
    set((state) => {
      let room = state.rooms.find((r) => r.id == newRoom.id);
      if (!room || !newRoom) return state;
      room.currentRoomMemberInfo.unseenMessageCount =
        newRoom.currentRoomMemberInfo.unseenMessageCount;
      room.currentRoomMemberInfo.lastSeenMessageId =
        newRoom.currentRoomMemberInfo.lastSeenMessageId;

      let message = room.chats?.find((m) => m.id == messageDetail.messageId);
      if (!message) return { rooms: [...state.rooms] };

      if (
        !message.messageDetails.find(
          (md) =>
            md.messageId == messageDetail.messageId &&
            md.user.id === messageDetail.user.id,
        )
      ) {
        message.messageDetails.push(messageDetail);
      }
      return { rooms: [...state.rooms] };
    }),
  addMesageToRoom: (roomId, message) =>
    set((state) => {
      let room = state.rooms.find((r) => r.id == roomId);
      if (!room) return state;
      if (!room.chats) {
        room.chats = [];
      }
      room.chats.push(message);
      // room.lastMessage= message;
      return { rooms: [...state.rooms] };
    }),
  addPreviousMesasges: (roomId, messages) =>
    set((state) => {
      let room = state.rooms.find((room) => room.id == roomId);
      if (!room) return state;

      if (!room.chats) room.chats = messages;
      else room.chats = [...messages, ...room?.chats];
      return { ...state, rooms: [...state.rooms] };
    }),
  addNextMesasges: (roomId, messages) =>
    set((state) => {
      let room = state.rooms.find((room) => room.id == roomId);
      if (!room) return state;

      if (!room.chats) room!.chats = messages;
      else room!.chats = [...room?.chats, ...messages];

      return { ...state, rooms: [...state.rooms] };
    }),
}));

export const useRooms = () => useRoomStore((state) => state.rooms);

export const useCurrentChats = () =>
  useRoomStore((state) => state.currentRoom?.chats);


export const useCurrentRoomId = () =>
  useRoomStore((state) => state.currentRoom?.id);

export const useCurrentRoomMembers = () =>
  useRoomStore((state) => {
    const currentRoom = state.currentRoom;
    if (!currentRoom) return;
    return {
      currentMember: currentRoom.currentRoomMemberInfo,
      otherMembers: currentRoom.otherRoomMemberInfos,
    } as RoomMemberDetail;
  });

export const useCurrentRoomStatus = () =>
  useRoomStore((state) => {
    const currentRoom = state.currentRoom;
    if (!currentRoom) return;
    const {
      lastMessage,
      previousLastMessageId,
      firstMessageId,
      currentRoomMemberInfo: { unseenMessageCount },
    } = currentRoom;
    return {
      lastMessage,
      previousLastMessageId,
      firstMessageId,
      unseenMessageCount,
    } as RoomStatus;
  });
export const useCurrentRoomPreviousLastMessageId = () =>
  useRoomStore((state) => state.currentRoom?.previousLastMessageId);

export const useIsCurrentRoomGroup = () => useRoomStore((state) => state.currentRoom?.isGroup);
export const useCurrentRoomInfo = () =>
  useRoomStore((state) => {
    const currentRoom = state.currentRoom;
    if (!currentRoom) return;
    const { id, name, avatar, isGroup } = currentRoom;
    return { id, name, avatar, isGroup } as RoomInfo;
  });
// export const useRoomMembers = () => useRoomStore((state) => state.roomMembers);

export const useRoomActions = () =>
  useRoomStore((state) => ({
    setCurrentRoom: state.setCurrentRoom,
    setRoomChats: state.setRooms,
    fetchRoomChats: state.fetchRooms,
    addRoomChat: state.addRoom,
    removeRoomChat: state.removeRoom,
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
  }));

export interface RoomInfo {
  id: string;
  name: string | undefined;
  avatar: string | undefined;
  isGroup: boolean;
}

export interface RoomStatus {
  lastMessage: MessageData | undefined;
  previousLastMessageId: string | undefined;
  firstMessageId: string | undefined;
  unseenMessageCount: number;
}

export interface RoomMemberDetail {
  currentMember: RoomMemberInfo;
  otherMembers: RoomMemberInfo[];
}