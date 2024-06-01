import { useEffect, useMemo, useState } from 'react';
import './room-list.css';
import React from 'react';

import {  useCurrentUserId } from '@/stores/authStore';
import { useRoomActions, useRooms } from '@/stores/roomStore';
import useJoinRoomEvent from '@/hooks/event/room/useJoinRoomEvent';
import { RoomData } from '@/libs/types';
import Room from './room/room';
import SearchBar from './search-bar/search-bar';

const RoomList = () => {
  const currentUserId = useCurrentUserId();
  const [input, setInput] = useState('');
  const rooms = useRooms();
  const { fetchRooms} = useRoomActions();

  useJoinRoomEvent();

  let filtedRooms: RoomData[] = useMemo(() => {
    let filter = rooms.filter((room) => {
      if (room.isGroup) {
        return room.name?.toLowerCase().includes(input.toLowerCase());
      } else {
        return room.otherRoomMemberInfos[0].user.fullname
          .toLowerCase()
          .includes(input.toLowerCase());
      }
    });

    filter.sort((a, b) => {
      if (a.lastMessage && b.lastMessage) {
        return +b.lastMessage.id - +a.lastMessage.id;
      }
      if (a.lastMessage) return -1;
      return 1;
    });
    return filter;
  }, [input, rooms]);

  
  useEffect(() => {
    if (currentUserId) {
      fetchRooms(currentUserId);
    }
  }, []);

  return (
    <div className="room-list">
      <SearchBar setInput={setInput}/>
      {filtedRooms &&
        filtedRooms.map((room) => {
          if (!room.currentRoomMemberInfo.canDisplayRoom) return;
          return (
            <Room key={room.id} room={room}/>    
          );
        })}
    </div>
  );
};

export default RoomList;