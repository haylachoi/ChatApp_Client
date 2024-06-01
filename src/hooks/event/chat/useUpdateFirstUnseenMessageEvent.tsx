import { roomService } from "@/services/roomService"
import { useRoomActions } from "@/stores/roomStore"
import { useEffect } from "react"


const useUpdateFirstUnseenMessageEvent = () => {
  const {updateRoomMember} = useRoomActions();
  useEffect(() => {
    const key = roomService.onUpdateFirstUnseenMessage.sub((roomMember) => {   
      updateRoomMember(roomMember);
    });

    return () => {
      roomService.onUpdateFirstUnseenMessage.unsub(key);
    }
  }, [])
}

export default useUpdateFirstUnseenMessageEvent
