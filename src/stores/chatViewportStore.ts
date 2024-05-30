import { RoomIdType } from "@/libs/types";
import { create } from "zustand"

interface useChatViewportStoreProps {
  currentViewportRef?: React.MutableRefObject<HTMLDivElement | null>;

  scrollTops: {
    roomId: RoomIdType,
    scrollTop: number;
  }[];
  setCurrentViewportRef: (
    ref: React.MutableRefObject<HTMLDivElement | null>,
  ) => void;
}

export const useChatViewportStore = create<useChatViewportStoreProps>()((set) => ({
  scrollTops: [],
  setCurrentViewportRef: (ref) => set({ currentViewportRef: ref }),

}))

export const useChatViewportActions = () => useChatViewportStore((state) => ({
  setCurrentViewportRef: state.setCurrentViewportRef,
}));


interface CurrentViewPortStoreProps {
  chatViewport?: HTMLDivElement;
  firstUnseenMessage?: HTMLDivElement;
  lastMessage?: HTMLDivElement;
  unseenMessages: HTMLDivElement[];
}
export const currentViewPortStore: CurrentViewPortStoreProps = {
  unseenMessages: [],
}

export const resetCurrentViewPortStore = () => {
  currentViewPortStore.chatViewport= undefined;
  currentViewPortStore.firstUnseenMessage = undefined;
  currentViewPortStore.lastMessage = undefined;
  currentViewPortStore.unseenMessages = [];
}
