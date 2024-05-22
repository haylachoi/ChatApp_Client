import { chatService } from '@/services/chatService';
import { useRoomActions } from '@/stores/roomStore';
import { useEffect } from 'react'

const useReactionEvent = () => {
    const {updateReactionMessage} = useRoomActions();
    useEffect(() => {
        const reactionMessageEventId = chatService.onUpdateReactionMessage.sub((roomId, messageDetail) => {
          updateReactionMessage(roomId, messageDetail);
        })
        
        return () => {
          chatService.onUpdateIsReaded.unsub(reactionMessageEventId);
        }
      }, [])
    
}

export default useReactionEvent
