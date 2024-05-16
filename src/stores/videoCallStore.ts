import { create } from "zustand";

interface videoCallStoreProps {
  isAlertShow: boolean;
  isAccept: boolean;
  stream?: MediaStream

  setIsAlertShow: (isAlertShow: boolean) => void;
  setIsAccept: (isAccept: boolean) => void;
  setStream: (stearm: MediaStream) => void;
}

const useVideoCall = create<videoCallStoreProps>()((set) => ({
  isAlertShow: false,
  isAccept: false,

  setIsAlertShow: (isAlertShow) => set({isAlertShow}),
  setIsAccept: (isAccept) => set({isAccept}),
  setStream: (stream) => set({stream})
}));

export const useVideoCallStream = () => useVideoCall((state) => state.stream);;
export const useIsVideoCallAlertShow = () => useVideoCall((state) => state.isAlertShow);
export const useIsVideoCallAccept = () => useVideoCall((state) => state.isAccept);
export const useVideoCallActions = () => useVideoCall((state) => {
  const {isAccept, isAlertShow, ...rest} = state;
  return rest;
});