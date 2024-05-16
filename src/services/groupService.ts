import { HubResponse, NoDataHubResponse } from './../libs/types';
import { REST_SEGMENT } from '@/libs/constant';
import { chatHub, roomHub } from './hubConnection';
import { getAccessToken } from './authService';
import { RoomMemberInfo } from '@/libs/types';
import { generatePublisher } from '@/libs/utils';

const connection = roomHub;
const subscribers = {
  addRoomMember: new Map<string, (roomMember: RoomMemberInfo) => void>(),
  removeRoomMember: new Map<string, (roomMember: RoomMemberInfo) => void>(),
};

const createGroup = async (formData: FormData) => {
  const pathname = `${REST_SEGMENT.GROUP}`;
  return fetch(pathname, {
    method: 'POST',
    body: formData,
    headers: {
      authorization: `Bearer ${getAccessToken()}`,
    },
  });
};

const onAddRoomMember = generatePublisher(subscribers.addRoomMember);
const onRemoveRoomMember = generatePublisher(subscribers.removeRoomMember);

const removeGroupMember = (roomId: string, userId: string): Promise<NoDataHubResponse> => {
  return connection.invoke('RemoveGroupMember', roomId, userId);
};

const addGroupMember = async (groupId: string, userId: string): Promise<NoDataHubResponse> => {
  return connection.invoke('AddGroupMember', groupId, userId);
};

chatHub.on('AddGroupMember', (roomMember: RoomMemberInfo) => {
    subscribers.addRoomMember.forEach((eventHandler) => {
      eventHandler(roomMember);
    });
});

chatHub.on('RemoveGroupMember', (roomMember: RoomMemberInfo) => {
  subscribers.removeRoomMember.forEach((eventHandler) => {
    eventHandler(roomMember);
  });
});

export const groupService = {
  createGroup,
  removeGroupMember,
  addGroupMember,
  onAddRoomMember,
  onRemoveRoomMember
};
