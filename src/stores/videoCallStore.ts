import { User } from "@/libs/types";
import Peer from "peerjs";
import { v4 } from "uuid";
import { create } from "zustand";

interface videoCallStoreProps {
  hasIncommingCall: boolean;
  isMakingCall: boolean;
  isAccept: boolean;
  stream?: MediaStream;
  caller?: User;
  receiver?: User;
  currentPeer: Peer;
  callerPeerId?: string;

  setHasIncommingCall: (hasIncommingCall: boolean) => void;
  setIsMakingCall: (isMakingCall: boolean) => void;
  setIsAccept: (isAccept: boolean) => void;
  setStream: (stearm: MediaStream) => void;
  setCaller: (caller: User) => void;
  setReceiver: (receiver: User) => void;
  createCurrentPeer: () => Peer;
  setCallerPeerId: (callerPeerId: string) => void;
}

const useVideoCall = create<videoCallStoreProps>()((set) => ({
  hasIncommingCall: false,
  isAccept: false,
  isMakingCall: false,
  currentPeer: new Peer(v4()),
  
  setHasIncommingCall: (hasIncommingCall) => set({hasIncommingCall}),
  setIsMakingCall: (isMakingCall) => set({isMakingCall}),
  setIsAccept: (isAccept) => set({isAccept}),
  setStream: (stream) => set({stream}),
  setCaller: (caller) => set({caller}),
  setReceiver: (receiver) => set({receiver}),
  createCurrentPeer: () => {
    const peer = new Peer(v4());
    set({currentPeer: peer});
    return peer;
  },
  setCallerPeerId: (callerPeerId) => set({callerPeerId}),
}));

export const useVideoCallStream = () => useVideoCall((state) => state.stream);
export const useHasIncommingCall = () => useVideoCall((state) => state.hasIncommingCall);
export const useIsMakingCall = () => useVideoCall((state) => state.isMakingCall);
export const useIsVideoCallAccept = () => useVideoCall((state) => state.isAccept);
export const useVideoCaller = () => useVideoCall((state) => state.caller);
export const useVideoReceiver = () => useVideoCall((state) => state.receiver);
export const useCurrentPeer = () => useVideoCall((state) => state.currentPeer);
export const useCallerPeerId = () => useVideoCall((state) => state.callerPeerId);

export const useVideoCallActions = () => useVideoCall((state) => {
  const {isAccept, hasIncommingCall, stream, caller, isMakingCall, currentPeer, callerPeerId, ...rest} = state;
  return rest;
});