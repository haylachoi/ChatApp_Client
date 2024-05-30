import { GroupIdType, NoDataHubResponse, RoomIdType, User, UserIdType } from '@/libs/types';
import { REST_SEGMENT } from '@/libs/constant';
import {  clientHub, roomHub } from './hubConnection';

import { RoomMemberInfo } from '@/libs/types';
import { generatePublisher } from '@/libs/utils';
import { httpClient } from '@/libs/httpClient';

const connection = roomHub;
const eventListener = clientHub;
const subscribers = {
  deleteGroup: new Map<string, (groupId: GroupIdType) => void>(),
  addRoomMember: new Map<string, (roomMember: RoomMemberInfo) => void>(),
  removeRoomMember: new Map<string, (groupId: GroupIdType, userId: UserIdType) => void>(),
  changeGroupOwner: new Map<string, (groupId: GroupIdType, owner: User) => void>()
};

const createGroup = async (name: string, groupOwnerId: UserIdType) => {
  const pathname = `${REST_SEGMENT.GROUP}`;
  const formData = new FormData();
  formData.append('name', name);
  formData.append('groupOwnerId', groupOwnerId.toString());
  return httpClient.post(pathname, formData);
};

const leaveGroup = async (groupId: GroupIdType): Promise<NoDataHubResponse> => {
  return connection.invoke('LeaveGroup', groupId);
}

const deleteGroup = async (groupId: GroupIdType) => {
  return connection.send('DeleteGroup', groupId);
}
const removeGroupMember = (groupId: GroupIdType, userId: UserIdType): Promise<NoDataHubResponse> => {
  return connection.invoke('RemoveGroupMember', groupId, userId);
};

const addGroupMember = async (groupId: GroupIdType, userId: UserIdType): Promise<NoDataHubResponse> => {
  return connection.invoke('AddGroupMember', groupId, userId);
};

const changeGroupOnwer = async (groupId: GroupIdType, userId: UserIdType): Promise<NoDataHubResponse> => {
  return connection.invoke('SetGroupOwner', {groupId, userId});
}
const onAddRoomMember = generatePublisher(subscribers.addRoomMember);
const onRemoveRoomMember = generatePublisher(subscribers.removeRoomMember);
const onDeleteGroup = generatePublisher(subscribers.deleteGroup);
const onChangeGroupOwner = generatePublisher(subscribers.changeGroupOwner);


eventListener.on('DeleteGroup', (groupId: GroupIdType) => {
    subscribers.deleteGroup.forEach((eventHandler) => {
      eventHandler(groupId);
    });
});

eventListener.on('AddGroupMember', (roomMember: RoomMemberInfo) => {
    subscribers.addRoomMember.forEach((eventHandler) => {
      eventHandler(roomMember);
    });
});

eventListener.on('RemoveGroupMember', (groupId: GroupIdType, userId: UserIdType) => {
  subscribers.removeRoomMember.forEach((eventHandler) => {
    eventHandler(groupId, userId);
  });
});

eventListener.on('ChangeGroupOwner', (groupId: GroupIdType, owner: User) => {
  subscribers.changeGroupOwner.forEach((eventHandler) => {
    eventHandler(groupId, owner);
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
