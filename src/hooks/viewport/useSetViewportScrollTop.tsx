import { currentViewPortStore } from "@/stores/chatViewportStore";
import { useCurrentRoomId } from "@/stores/roomStore";
import { useEffect } from "react";


const useSetViewportScrollTop = () => {
  const currentRoomId = useCurrentRoomId();

  useEffect (() => {
    const viewport = currentViewPortStore.chatViewport;
    if (viewport) {
      const scrollTop = currentViewPortStore.scrollTopCache.find(c => c.roomId === currentRoomId)?.scrollTop;
      if (scrollTop)
        viewport.scrollTop = scrollTop;
    }

  }, [currentRoomId])
}

export default useSetViewportScrollTop
