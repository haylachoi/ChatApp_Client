import { convertRawRoomToRoom } from '@/libs/utils';
import { chatService } from '@/services/chatService';
import { useRoomActions } from '@/stores/roomStore';
import { useCurrentUser } from '@/stores/authStore';
import React, { useEffect } from 'react'

const useSeenEvent = () => {
    const currentUser = useCurrentUser();
    const {updateSeenMessage} = useRoomActions();
    useEffect(() => {
        const seenMessageEventId = chatService.onUpdateIsReaded.sub((messageDetail, rawRoom) => {
          const room = convertRawRoomToRoom(rawRoom, currentUser!.id);
         
          if (!room) return;
          updateSeenMessage(room, messageDetail);
        })
    
        return () => {
          chatService.onUpdateIsReaded.unsub(seenMessageEventId);
        }
      }, [])
}

export default useSeenEvent
