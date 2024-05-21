import { generatePublisher } from '@/libs/utils';
import { chatHub, clientHub } from './hubConnection';
import { HubResponse, MessageData, MessageDetail, RawRoom, User } from '@/libs/types';
import { REST_SEGMENT } from '@/libs/constant';
import { getAccessToken } from './authService';
import { httpClient } from '@/libs/httpClient';
import Peer from 'peerjs';

const connection = chatHub;
const eventListener = clientHub;

const subscribers = {
  receiveMessage: new Map<string, (message: MessageData) => void>(),
  updateSeenMessage: new Map<
    string,
    (message: MessageDetail, room: RawRoom) => void
  >(),
  updateReactionMessage: new Map<string, (roomId: string, messageDetail: MessageDetail) => void>(),
  callVideo: new Map<string, (roomId: string, peerId: string, caller: User) => void>(),
  acceptVideoCall: new Map<string, (peerId: string) => void>(),
  rejectVideoCall: new Map<string, (peerId: string) => void>(),
  cancelVideoCall: new Map<string, (peerId: string) => void>(),

};

const sendImageMessage = async (files: FileList, roomId: string): Promise<void> => {
  const pathname = `${REST_SEGMENT.CHAT}`;
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }
  formData.append('roomId', roomId);

  await httpClient.post(pathname, formData);
};

const sendMessage = async (roomId: string, message: string) => {
  return connection.send('SendMessage', roomId, message);
};

const updateIsReaded = async (messageId: string) => {
  return connection.send('UpdateIsReaded', messageId);
};

const updateReactionMessage = async (
  messageId: string,
  reactionId: string | undefined,
) => {
  return connection.send('updateReactionMessage', messageId, reactionId);
};


const onUpdateReactionMessage = generatePublisher(
  subscribers.updateReactionMessage,
);
const onReceiveMessage = generatePublisher(subscribers.receiveMessage);
const onUpdateIsReaded = generatePublisher(subscribers.updateSeenMessage);

eventListener.on('ReceiveMessage', (message: MessageData) => {
  subscribers.receiveMessage.forEach((eventHandler) => {
    eventHandler( message);
  });
});

eventListener.on('UpdateIsReaded', (messageDetail: MessageDetail, rawRoom: RawRoom) => {
  subscribers.updateSeenMessage.forEach((eventHandler) => {
    eventHandler(messageDetail, rawRoom);
  });
});

eventListener.on('UpdateReactionMessage', (roomId: string, messageDetail: MessageDetail) => {
  subscribers.updateReactionMessage.forEach((eventHandler) => {
    eventHandler(roomId, messageDetail);
  });
});


export const chatService = {
  sendMessage,
  sendImageMessage,
  updateIsReaded,
  updateReactionMessage,
 
  onReceiveMessage,
  onUpdateIsReaded,
  onUpdateReactionMessage,
};
