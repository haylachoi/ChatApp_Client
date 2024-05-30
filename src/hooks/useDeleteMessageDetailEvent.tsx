import { chatService } from "@/services/chatService"
import { useRoomActions } from "@/stores/roomStore"
import { useEffect } from "react"

const useDeleteMessageDetailEvent = () => {
  const {deleteMessageDetail} = useRoomActions();
  useEffect(() => {
    const key = chatService.onDeleteMessageDetail.sub((roomId, messageDetail) => {
      deleteMessageDetail(roomId, messageDetail);
    })

    return () => chatService.onDeleteMessageDetail.unsub(key);
  },[])
}

export default useDeleteMessageDetailEvent
