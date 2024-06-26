import { convertRawRoomToRoom } from '@/libs/utils';
import { roomService } from '@/services/roomService';
import { useRoomActions } from '@/stores/roomStore';
import { useCurrentUser } from '@/stores/authStore';
import { useEffect } from 'react';
import { Profile } from '@/libs/types';

const useJoinRoomEvent = () => {
  const currentUser = useCurrentUser() as Profile;
  const { addRoom } = useRoomActions();

  useEffect(() => {
    const key = roomService.onJoinRoom.sub((rawRoom) => {
      const room = convertRawRoomToRoom(rawRoom, currentUser.id);
      console.log('join room', room);
      if (room) {
        addRoom(room);
      }
    });

    return () => {
      roomService.onJoinRoom.unsub(key);
    };
  }, [currentUser]);
};

export default useJoinRoomEvent;
