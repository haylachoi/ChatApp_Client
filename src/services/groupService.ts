import { NoDataHubResponse, User } from '@/libs/types';
import { REST_SEGMENT } from '@/libs/constant';
import {  clientHub, roomHub } from './hubConnection';

import { RoomMemberInfo } from '@/libs/types';
import { generatePublisher } from '@/libs/utils';
import { httpClient } from '@/libs/httpClient';

const connection = roomHub;
const eventListener = clientHub;
const subscribers = {
  deleteGroup: new Map<string, (groupId: string) => void>(),
  addRoomMember: new Map<string, (roomMember: RoomMemberInfo) => void>(),
  removeRoomMember: new Map<string, (roomId: string, userId: string) => void>(),
  changeGroupOwner: new Map<string, (roomId: string, owner: User) => void>()
};

const createGroup = async (name: string, groupOwnerId: string) => {
  const pathname = `${REST_SEGMENT.GROUP}`;
  const formData = new FormData();
  formData.append('name', name);
  formData.append('groupOwnerId', groupOwnerId);
  return httpClient.post(pathname, formData);
};

const leaveGroup = async (groupId: string): Promise<NoDataHubResponse> => {
  return connection.invoke('LeaveGroup', groupId);
}

const deleteGroup = async (groupId: string) => {
  return connection.send('DeleteGroup', groupId);
}
const removeGroupMember = (roomId: string, userId: string): Promise<NoDataHubResponse> => {
  return connection.invoke('RemoveGroupMember', roomId, userId);
};

const addGroupMember = async (groupId: string, userId: string): Promise<NoDataHubResponse> => {
  return connection.invoke('AddGroupMember', groupId, userId);
};

const changeGroupOnwer = async (groupId: string, userId: string): Promise<NoDataHubResponse> => {
  return connection.invoke('SetGroupOwner', {groupId, userId});
}
const onAddRoomMember = generatePublisher(subscribers.addRoomMember);
const onRemoveRoomMember = generatePublisher(subscribers.removeRoomMember);
const onDeleteGroup = generatePublisher(subscribers.deleteGroup);
const onChangeGroupOwner = generatePublisher(subscribers.changeGroupOwner);


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

eventListener.on('RemoveGroupMember', (roomId: string, userId: string) => {
  subscribers.removeRoomMember.forEach((eventHandler) => {
    eventHandler(roomId, userId);
  });
});

eventListener.on('ChangeGroupOwner', (roomId: string, owner: User) => {
  subscribers.changeGroupOwner.forEach((eventHandler) => {
    eventHandler(roomId, owner);
  });
});

export const groupService = {
  createGroup,
  leaveGroup,
  deleteGroup,
  removeGroupMember,
  addGroupMember,
  changeGroupOnwer,

  onDeleteGroup,
  onAddRoomMember,
  onRemoveRoomMember,
  onChangeGroupOwner
};
