import { groupService } from '@/services/groupService';
import { useRoomActions } from '@/stores/roomStore';
import React, { useEffect } from 'react'

const useRoomMemberEvent = () => {
    const {addRoomMember, removeRoomMember} = useRoomActions();
    useEffect(() => {
        const addRoomMemberEventId = groupService.onAddRoomMember.sub((roomMember) => {
          console.log(roomMember);
          addRoomMember(roomMember);    
        })
        const removeRoomMemberEventId = groupService.onRemoveRoomMember.sub((roomMember) => {
          console.log(roomMember);
          removeRoomMember(roomMember);    
        })
        return () => {
          groupService.onAddRoomMember.unsub(addRoomMemberEventId);
          groupService.onRemoveRoomMember.unsub(removeRoomMemberEventId);
        }
      }, [])
}

export default useRoomMemberEvent
