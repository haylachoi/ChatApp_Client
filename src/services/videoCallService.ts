import { RoomIdType, User, UserIdType } from "@/libs/types";
import { generatePublisher } from "@/libs/utils";
import { chatHub, clientHub } from "./hubConnection";

const connection = chatHub;
const eventListener = clientHub;
const subscribers = {
  callVideo: new Map<string, (roomId: string, peerId: string, caller: User) => void>(),
  acceptVideoCall: new Map<string, (peerId: string) => void>(),
  rejectVideoCall: new Map<string, (peerId: string) => void>(),
  cancelVideoCall: new Map<string, (peerId: string) => void>(),
};

const getUserMedia = async () => {
  return navigator.mediaDevices.getUserMedia({video: true, audio:true});
}

const callVideo = async (roomId: RoomIdType, receiverId: UserIdType ,peerId: string) => {
  return connection.invoke('CallVideo', roomId, receiverId, peerId);
}
const acceptVideoCall = async (callerId: UserIdType, peerId: string) => {
  return connection.invoke('AcceptVideoCall', callerId, peerId);
}

const rejectVideoCall = async (callerId: UserIdType, peerId: string) => {
  return connection.invoke('RejectVideoCall', callerId, peerId);
}

const cancelVideoCall = async (receiverId: UserIdType, peerId: string) => {
  return connection.invoke('CancelVideoCall', receiverId, peerId);
}


const onCallVideo = generatePublisher(subscribers.callVideo);
const onAcceptVideoCall = generatePublisher(subscribers.acceptVideoCall);
const onRejectVideoCall = generatePublisher(subscribers.rejectVideoCall);
const onCancelVideoCall = generatePublisher(subscribers.cancelVideoCall);

eventListener.on('CallVideo', (roomId: string, peerId: string, caller: User) => {
  subscribers.callVideo.forEach((eventHandler) => {
    eventHandler(roomId, peerId, caller);
  });
});

eventListener.on('AcceptVideoCall', (peerId: string) => {
  subscribers.acceptVideoCall.forEach((evenHandler) => {
    evenHandler(peerId);
  })
})

eventListener.on('RejectVideoCall', (peerId: string) => {
  subscribers.rejectVideoCall.forEach((evenHandler) => {
    evenHandler(peerId);
  })
})

eventListener.on('CancelVideoCall', (peerId: string) => {
  subscribers.cancelVideoCall.forEach((evenHandler) => {
    evenHandler(peerId);
  })
})
export const videoCallService = {
  getUserMedia,
  callVideo,
  acceptVideoCall,
  rejectVideoCall,
  cancelVideoCall,

  onAcceptVideoCall,
  onRejectVideoCall,
  onCancelVideoCall,
  onCallVideo,
};