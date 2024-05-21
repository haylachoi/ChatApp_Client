import { HubResponse, NoDataHubResponse } from './../libs/types';
import { REST_SEGMENT } from '@/libs/constant';
import { chatHub, clientHub, roomHub } from './hubConnection';
import { getAccessToken } from './authService';
import { RoomMemberInfo } from '@/libs/types';
import { generatePublisher } from '@/libs/utils';
import { httpClient } from '@/libs/httpClient';

const connection = roomHub;
const eventListener = clientHub;
const subscribers = {
  deleteGroup: new Map<string, (groupId: string) => void>(),
  addRoomMember: new Map<string, (roomMember: RoomMemberInfo) => void>(),
  removeRoomMember: new Map<string, (roomMember: RoomMemberInfo) => void>(),
};

const createGroup = async (formData: FormData) => {
  const pathname = `${REST_SEGMENT.GROUP}`;
  return httpClient.post(pathname, formData);
};

const deleteGroup = async (groupId: string) => {
  return connection.send('DeleteGroup', groupId);
}
const removeGroupMember = (roomId: string, userId: string): Promise<NoDataHubResponse> => {
  return connection.invoke('RemoveGroupMember', roomId, userId);
};

const addGroupMember = async (groupId: string, userId: string): Promise<NoDataHubResponse> => {
  return connection.invoke('AddGroupMember', groupId, userId);
};
const onAddRoomMember = generatePublisher(subscribers.addRoomMember);
const onRemoveRoomMember = generatePublisher(subscribers.removeRoomMember);
const onDeleteGroup = generatePublisher(subscribers.deleteGroup);


eventListener.on('DeleteGroup', (groupId: string) => {
    subscribers.deleteGroup.forEach((eventHandler) => {
      eventHandler(groupId);
    });
});

eventListener.on('AddGroupMember', (roomMember: RoomMemberInfo) => {
    subscribers.addRoomMember.forEach((eventHandler) => {
      eventHandler(roomMember);
    });
});

eventListener.on('RemoveGroupMember', (roomMember: RoomMemberInfo) => {
  subscribers.removeRoomMember.forEach((eventHandler) => {
    eventHandler(roomMember);
  });
});

export const groupService = {
  createGroup,
  deleteGroup,
  removeGroupMember,
  addGroupMember,

  onDeleteGroup,
  onAddRoomMember,
  onRemoveRoomMember
};
