import { convertRawRoomToRoom } from '@/libs/utils';
import { roomService } from '@/services/roomService';
import {
  useRoomActions,
} from '@/stores/roomStore';
import { useCurrentUser } from '@/stores/authStore';
import { useEffect } from 'react';

const useJoinRoomEvent = () => {
  const currentUser = useCurrentUser();

  const { addRoomChat } = useRoomActions();
  useEffect(() => {
    const key = roomService.onJoinRoom.sub((rawRoom) => {
      if (!currentUser) return;
      const room = convertRawRoomToRoom(rawRoom, currentUser.id);
      if (room) {
        addRoomChat(room);
      }
    });

    return () => {
      roomService.onJoinRoom.unsub(key);
    };
  }, [currentUser]);
};

export default useJoinRoomEvent;
