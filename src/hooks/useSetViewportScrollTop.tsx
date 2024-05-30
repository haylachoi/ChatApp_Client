import { RoomIdType } from "@/libs/types";
import { currentViewPortStore } from "@/stores/chatViewportStore";
import { useRoomStore } from "@/stores/roomStore";
import { useEffect } from "react";


const useSetViewportScrollTop = (viewport: HTMLDivElement | undefined) => {
  const currentRoom = useRoomStore(({currentRoom : room}) => ({
    roomId: room?.id as RoomIdType,
    scrollTop: room?.viewportTop,
  }));

  useEffect (() => {
    if (viewport) {
      viewport.scrollTop = currentRoom.scrollTop ?? 0;
    }

  }, [currentRoom.roomId])
}

export default useSetViewportScrollTop
