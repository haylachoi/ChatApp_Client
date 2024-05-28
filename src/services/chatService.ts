import { generatePublisher } from '@/libs/utils';
import { chatHub, clientHub } from './hubConnection';
import { MessageData, MessageDetail, RawRoom, User } from '@/libs/types';
import { REST_SEGMENT } from '@/libs/constant';
import { httpClient } from '@/libs/httpClient';


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

const sendMessage = async (roomId: string, content: string, quoteId: string | undefined) => {
  return connection.send('SendMessage', roomId, content, quoteId);
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

eventListener.on('ReceiveMessage', (message: MessageData) => {
  // const message = convertRawMessageToMessage(rawMessage) as MessageData;
  subscribers.receiveMessage.forEach((eventHandler) => {
    eventHandler(message);
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
  onUpdateReactionMessage,
};
