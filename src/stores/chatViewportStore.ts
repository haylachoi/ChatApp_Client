import { create } from "zustand"

interface useChatViewportStoreProps {
  currentViewportRef?: React.MutableRefObject<HTMLDivElement | null>;
  
  scrollTops: {
    roomId: string,
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
  setCurrentViewportRef: state.setCurrentViewportRef
}));