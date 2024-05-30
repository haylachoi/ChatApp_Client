import { useEffect, useMemo, useState } from 'react';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { IoPersonAddOutline } from 'react-icons/io5';
import './room-list.css';
import React from 'react';

import {  useCurrentUserId } from '@/stores/authStore';
import { useRoomActions, useRooms, useRoomStore } from '@/stores/roomStore';
import {  useAppModalActions } from '@/stores/modalStore';
import useJoinRoomEvent from '@/hooks/useJoinRoomEvent';
import { RoomData } from '@/libs/types';
import Room from './room/room';

const RoomList = () => {
  const currentUserId = useCurrentUserId();
  const { openAddUserModal, openCreateGroupModal } = useAppModalActions();
  const [input, setInput] = useState('');
  const rooms = useRooms();
  const { fetchRooms} = useRoomActions();
  console.log('roomlist')
  
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
  }, [rooms]);

  useJoinRoomEvent();
  
  useEffect(() => {
    if (currentUserId) {
      fetchRooms(currentUserId);
    }
  }, []);
  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
       
        <div className="group-btn">
          <button className="add-btn" onClick={openAddUserModal}>
            <IoPersonAddOutline className="add-icon" />
          </button>
          <button className="add-btn" onClick={openCreateGroupModal}>
            <MdOutlineGroupAdd className="add-icon" />
          </button>
        </div>
      </div>
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