import { convertRawRoomToRoom } from '@/libs/utils';
import { roomService } from '@/services/roomService';
import {
  useRoomActions,
} from '@/stores/roomStore';
import { useCurrentUser } from '@/stores/authStore';
import { useEffect } from 'react';

const useCreateRoomEvent = () => {
  const currentUser = useCurrentUser();

  const { addRoomChat } = useRoomActions();
  useEffect(() => {
    const createRoomEventId = roomService.onCreateRoom.sub((rawRoom) => {
      if (!currentUser) return;
      const room = convertRawRoomToRoom(rawRoom, currentUser.id);
      console.log(room);
      if (room) {
        addRoomChat(room);
      }
    });

    return () => {
      roomService.onCreateRoom.unsub(createRoomEventId);
    };
  }, []);
};

export default useCreateRoomEvent;
