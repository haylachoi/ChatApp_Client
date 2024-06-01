import { chatService } from '@/services/chatService';
import { roomService } from '@/services/roomService';
import { useRoomActions, useRooms } from '@/stores/roomStore';
import { useEffect } from 'react';

const useReceiveMessageEvent = () => {
  const { addMessage, updateCanDisplayRoom } =
    useRoomActions();
  const roomChats = useRooms();
  
  useEffect(() => {
    const key = chatService.onReceiveMessage.sub((message) => {
      addMessage(message.roomId, message);
      let room = roomChats.find((room) => room.id == message.roomId);
      if (room && !room.currentRoomMemberInfo.canDisplayRoom) {
        roomService.updateCanMessageDisplay(room.id, true).then((result) => {
          if (result.isSuccess) {
            const roomInfo = result.data;
            updateCanDisplayRoom(room.id, roomInfo.canDisplayRoom);
          }
        });
      }
    });

    return () => {
      chatService.onReceiveMessage.unsub(key);
    };
  }, [roomChats]);
};

export default useReceiveMessageEvent;
