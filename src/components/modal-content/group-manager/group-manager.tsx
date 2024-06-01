import React, { useEffect } from 'react'
import "./group-manager.css"
import { useState } from "react";
import { groupService } from '@/services/groupService';
import { useAlertModal } from '@/stores/alertModalStore';
import {  useCurrentRoomId, useRoomStore } from '@/stores/roomStore';
import { RoomIdType, RoomMemberInfo, UserIdType } from '@/libs/types';
import { useCurrentUser } from '@/stores/authStore';
import useDebounce from '@/hooks/useDebouce';
import GroupUserItem from './group-user-item/group-user-item';


const GroupManager = () => {
  const currentUser = useCurrentUser();
  const otherMembers = useRoomStore((state) => state.currentRoom?.otherRoomMemberInfos) as RoomMemberInfo[];
  const groupOwner = useRoomStore((state) => state.currentRoom?.groupInfo?.groupOwner);
  const currentRoomId = useCurrentRoomId() as RoomIdType;
  const {onOpen, setOnOk, setTitle} = useAlertModal();
  const [users, setUsers] = useState(otherMembers.map((info) => info.user));
  
  console.log('group-manager', otherMembers.length)
  const handleSearch = (searchTerm: string) => {
    setUsers(otherMembers.filter((info) => info.user.fullname.toLowerCase().includes(searchTerm.toLowerCase())).map((info) => info.user));
  }

  const handleSearchDebouce = useDebounce(handleSearch, 300)

  const handleDeleteGroup = () => {
    setOnOk(() => groupService.deleteGroup(currentRoomId));
    setTitle('Bạn có muốn xóa group này không?');
    onOpen();
  }

  const handleLeaveGroup = () => {
    setOnOk(() => groupService.leaveGroup(currentRoomId));
    setTitle('Bạn có muốn rời group này không?');
    onOpen();
  }


  useEffect(() => {
    const newUsers = otherMembers.map((info) => info.user);
    setUsers(newUsers);
  }, [otherMembers.length])
  return (
    <div className="group-manager bg-darker">
      <div className="top">
        <div>
          Chủ nhóm: {groupOwner?.fullname}
        </div>
        { groupOwner?.id === currentUser?.id &&
          <button className="btn-delete-group btn-none" onClick={handleDeleteGroup}>Xóa nhóm</button>
        }
         { groupOwner?.id !== currentUser?.id &&
          <button className="btn-delete-group btn-none" onClick={handleLeaveGroup}>Rời nhóm</button>
        }
      </div>
      <form>
        <input type="text" placeholder="Nhập để tìm kiếm" name="searchTerm" onChange={(e) => {handleSearchDebouce(e.currentTarget.value)}}/>
      </form>
      <ul>
      {users && users.map((user) => (
        <GroupUserItem key={user.id} user={user} isCurrentUserOwnGroup={groupOwner?.id === currentUser?.id}/>
      ))}
      {users && users.length === 0 && (
        <p>Không tìm thấy kết quả</p>
      )}
      </ul>
      
    </div>
  )
}

export default GroupManager
