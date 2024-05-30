import { generatePublisher } from '@/libs/utils';
import { chatHub, clientHub } from './hubConnection';
import { MessageData, MessageDetail, MessageIdType, RawRoom, Reaction, ReactionIdType, RoomData, RoomIdType, User } from '@/libs/types';
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
  updateReactionMessage: new Map<string, (roomId: RoomIdType, messageDetail: MessageDetail) => void>(),
  deleteMessageDetail: new Map<string, (roomId: RoomIdType, messageDetail: MessageDetail) => void>(),
  callVideo: new Map<string, (roomId: string, peerId: string, caller: User) => void>(),
  acceptVideoCall: new Map<string, (peerId: string) => void>(),
  rejectVideoCall: new Map<string, (peerId: string) => void>(),
  cancelVideoCall: new Map<string, (peerId: string) => void>(),

};

const sendImageMessage = async (files: FileList, roomId: RoomIdType): Promise<void> => {
  const pathname = `${REST_SEGMENT.CHAT}`;
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }
  formData.append('roomId', roomId.toString());

  await httpClient.post(pathname, formData);
};

const sendMessage = async (roomId: RoomIdType, content: string, quoteId: MessageIdType | undefined) => {
  return connection.send('SendMessage', roomId, content, quoteId);
};

const updateIsReaded = async (messageId: MessageIdType) => {
  return connection.send('UpdateIsReaded', messageId);
};

const updateReactionMessage = async (
  messageId: MessageIdType,
  reactionId: ReactionIdType | undefined,
) => {
  return connection.send('updateReactionMessage', messageId, reactionId);
};


const onUpdateReactionMessage = generatePublisher(
  subscribers.updateReactionMessage,
);

const onDeleteMessageDetail = generatePublisher(subscribers.deleteMessageDetail);

const onReceiveMessage = generatePublisher(subscribers.receiveMessage);

eventListener.on('ReceiveMessage', (message: MessageData) => {
  subscribers.receiveMessage.forEach((eventHandler) => {
    eventHandler(message);
  });
});


eventListener.on('UpdateReactionMessage', (roomId: RoomIdType, messageDetail: MessageDetail) => {
  subscribers.updateReactionMessage.forEach((eventHandler) => {
    eventHandler(roomId, messageDetail);
  });
});

eventListener.on('DeleteMessageDetail', (roomId: RoomIdType, messageDetail: MessageDetail) => {
  subscribers.deleteMessageDetail.forEach((eventHandler) => {
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
  onDeleteMessageDetail
};
