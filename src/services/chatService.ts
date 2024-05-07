import { generatePublisher } from '@/libs/utils';
import { chatConnection } from './hubConnection';
import { MessageData, MessageDetail, RawRoom } from '@/libs/types';
import { REST_SEGMENT } from '@/libs/constant';
import { getAccessToken } from './authService';

const subscribers = {
  receiveMessage: new Map<string, (message: MessageData) => void>(),
  updateSeenMessage: new Map<
    string,
    (message: MessageDetail, room: RawRoom) => void
  >(),
  updateReactionMessage: new Map<string, (roomId: string, messageDetail: MessageDetail) => void>(),
};

const sendImageMessage = async (files: FileList, roomId: string) => {
  const pathname = `${REST_SEGMENT.CHAT}`;
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }
  formData.append('roomId', roomId);

  return fetch(pathname, {
    method: 'POST',
    body: formData,
    headers: {
      authorization: `Bearer ${getAccessToken()}`,
    },
  });
};

const sendMessage = async (roomId: string, message: string) => {
  return chatConnection.send('SendMessage', roomId, message);
};

const updateIsReaded = async (messageId: string) => {
  return chatConnection.send('UpdateIsReaded', messageId);
};

const updateReactionMessage = async (
  messageId: string,
  reactionId: string | undefined,
) => {
  return chatConnection.send('updateReactionMessage', messageId, reactionId);
};

const onUpdateReactionMessage = generatePublisher(
  subscribers.updateReactionMessage,
);
const onReceiveMessage = generatePublisher(subscribers.receiveMessage);
const onUpdateIsReaded = generatePublisher(subscribers.updateSeenMessage);

chatConnection.on('ReceiveMessage', (message: MessageData) => {
  subscribers.receiveMessage.forEach((eventHandler) => {
    eventHandler( message);
  });
});

chatConnection.on('UpdateIsReaded', (messageDetail: MessageDetail, rawRoom: RawRoom) => {
  subscribers.updateSeenMessage.forEach((eventHandler) => {
    eventHandler(messageDetail, rawRoom);
  });
});

chatConnection.on('UpdateReactionMessage', (roomId: string, messageDetail: MessageDetail) => {
  subscribers.updateReactionMessage.forEach((eventHandler) => {
    eventHandler(roomId, messageDetail);
  });
});

export const chatService = {
  sendMessage,
  sendImageMessage,
  onReceiveMessage,
  updateIsReaded,
  onUpdateIsReaded,
  updateReactionMessage,
  onUpdateReactionMessage,
};
