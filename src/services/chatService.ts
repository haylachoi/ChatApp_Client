import { generatePublisher } from '@/libs/utils';
import { chatHub } from './hubConnection';
import { HubResponse, MessageData, MessageDetail, RawRoom } from '@/libs/types';
import { REST_SEGMENT } from '@/libs/constant';
import { getAccessToken } from './authService';
import { httpClient } from '@/libs/httpClient';
import Peer from 'peerjs';

const subscribers = {
  receiveMessage: new Map<string, (message: MessageData) => void>(),
  updateSeenMessage: new Map<
    string,
    (message: MessageDetail, room: RawRoom) => void
  >(),
  updateReactionMessage: new Map<string, (roomId: string, messageDetail: MessageDetail) => void>(),
  callVideo: new Map<string, (roomId: string, peerId: string) => void>()
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
  return chatHub.send('SendMessage', roomId, message);
};

const updateIsReaded = async (messageId: string) => {
  return chatHub.send('UpdateIsReaded', messageId);
};

const updateReactionMessage = async (
  messageId: string,
  reactionId: string | undefined,
) => {
  return chatHub.send('updateReactionMessage', messageId, reactionId);
};

const callVideo = async (roomId: string, receiverId: string ,peerId: string) => {
  return chatHub.invoke('CallVideo', roomId, receiverId, peerId);
}

const onCallVideo = generatePublisher(subscribers.callVideo);
const onUpdateReactionMessage = generatePublisher(
  subscribers.updateReactionMessage,
);
const onReceiveMessage = generatePublisher(subscribers.receiveMessage);
const onUpdateIsReaded = generatePublisher(subscribers.updateSeenMessage);

chatHub.on('ReceiveMessage', (message: MessageData) => {
  subscribers.receiveMessage.forEach((eventHandler) => {
    eventHandler( message);
  });
});

chatHub.on('UpdateIsReaded', (messageDetail: MessageDetail, rawRoom: RawRoom) => {
  subscribers.updateSeenMessage.forEach((eventHandler) => {
    eventHandler(messageDetail, rawRoom);
  });
});

chatHub.on('UpdateReactionMessage', (roomId: string, messageDetail: MessageDetail) => {
  subscribers.updateReactionMessage.forEach((eventHandler) => {
    eventHandler(roomId, messageDetail);
  });
});

chatHub.on('CallVideo', (roomId: string, peerId: string) => {
  subscribers.callVideo.forEach((eventHandler) => {
    eventHandler(roomId, peerId);
  });
});


export const chatService = {
  sendMessage,
  sendImageMessage,
  onCallVideo,
  callVideo,
  onReceiveMessage,
  updateIsReaded,
  onUpdateIsReaded,
  updateReactionMessage,
  onUpdateReactionMessage,
};
