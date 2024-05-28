import { groupService } from "@/services/groupService"
import { useRoomActions } from "@/stores/roomStore"
import { useEffect } from "react"

const useChangeGroupOwnerEvent = () => {

  const {changeGroupOnwer} = useRoomActions();
  useEffect(() => {
    const key = groupService.onChangeGroupOwner.sub((roomId, owner) => {
      changeGroupOnwer(roomId, owner);
    })

    return () => groupService.onChangeGroupOwner.unsub(key);
  },[])
}

export default useChangeGroupOwnerEvent
