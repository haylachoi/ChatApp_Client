import { RoomIdType } from '@/libs/types';
import { roomService } from '@/services/roomService';
import { currentViewPortStore } from '@/stores/chatViewportStore';
import { useRoomActions, useRoomStore } from '@/stores/roomStore';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

const useInitChat = () => {
  const currentRoom = useRoomStore(
    useShallow(({ currentRoom: room }) => ({
      roomId: room?.id as RoomIdType,
      firstMessageId: room?.firstMessageId,
      firstUnseenMessageId: room?.currentRoomMemberInfo.firstUnseenMessageId,
      chats: room?.chats,
    })),
  );
  const { replaceChats, updateFirstMessageId } = useRoomActions();

  useEffect(() => {
    const initChat = async () => {
      try {
        // update first message id
        if (currentRoom.firstMessageId === undefined) {
          const result = await roomService.getFirstMessage(currentRoom.roomId);
          const message = result.data;
          if (message) {
            updateFirstMessageId(currentRoom.roomId, message.id);
          }
        }
        // load some message
        if (currentRoom.roomId && !currentRoom.chats) {
          const result = await roomService.getSomeMessages(currentRoom.roomId);
          const messages = result.data;
          replaceChats(currentRoom.roomId, messages);

          // scroll into view
          setTimeout(() => {
            if (currentRoom.firstUnseenMessageId) {
              currentViewPortStore.firstUnseenMessage?.scrollIntoView({
                behavior: 'instant',
                block: 'center',
              });
            } else if (currentViewPortStore.lastMessage) {
              currentViewPortStore.lastMessage.scrollIntoView({
                behavior: 'instant',
                block: 'end',
              });
            }
          }, 0);
        }
      } catch (error) {
        console.log(error);
      }
    };

    initChat();
  }, [currentRoom.roomId]);
};

export default useInitChat;
