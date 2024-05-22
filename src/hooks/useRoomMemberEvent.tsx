import { groupService } from '@/services/groupService';
import { useRoomActions } from '@/stores/roomStore';
import { useEffect } from 'react'

const useRoomMemberEvent = () => {
    const {addRoomMember, removeRoomMember} = useRoomActions();
    useEffect(() => {
        const addRoomMemberEventId = groupService.onAddRoomMember.sub((roomMember) => {
          addRoomMember(roomMember);    
        })
        const removeRoomMemberEventId = groupService.onRemoveRoomMember.sub((roomMember) => {
          removeRoomMember(roomMember);    
        })
        return () => {
          groupService.onAddRoomMember.unsub(addRoomMemberEventId);
          groupService.onRemoveRoomMember.unsub(removeRoomMemberEventId);
        }
      }, [])
}

export default useRoomMemberEvent
