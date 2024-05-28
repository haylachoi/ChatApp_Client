import { useRoomStore } from "@/stores/roomStore";
import { useEffect } from "react";


const useSetViewportScrollTop = (chatViewportRef: React.MutableRefObject<HTMLDivElement | null>) => {
  const currentRoom = useRoomStore(({currentRoom : room}) => ({
    roomId: room?.id as string,
    scrollTop: room?.viewportTop,
  }));

  useEffect (() => {
    if (chatViewportRef.current) {
      chatViewportRef.current.scrollTop = currentRoom.scrollTop ?? 0;
    }

  }, [currentRoom.roomId])
}

export default useSetViewportScrollTop
