import React, { useEffect } from 'react'
import "./group-manager.css"
import { FormEvent, useState } from "react";
import { useCurrentUser } from "@/stores/authStore";
import { useCurrentRoom, useRoomActions } from '@/stores/roomStore';
import { groupService } from '@/services/groupService';
import { useAlertModal } from '@/stores/alertModalStore';
import { useAppModalActions } from '@/stores/modalStore';

const GroupManager = () => {
  const currentRoom = useCurrentRoom();
  const currentUser = useCurrentUser();
  const {closeModal} = useAppModalActions();
  if (!currentRoom || !currentUser) {
    closeModal();
  return <></>;
  }

  const {onOpen, setOnOk} = useAlertModal();
  const [users, setUsers] = useState(currentRoom.otherRoomMemberInfos.map((info) => info.user));

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchTerm = formData.get("searchTerm") as string;
    if(!searchTerm) return;
   
    setUsers(currentRoom.otherRoomMemberInfos.filter((info) => info.user.fullname.toLowerCase().includes(searchTerm.toLowerCase())).map((info) => info.user));
  };

  const handleDeleteGroup = () => {
    setOnOk(() => groupService.deleteGroup(currentRoom.id));
    onOpen();
  }
  const handleSetGroupOwner = (id: string) => {
    
  }
  const handleKick = async (id: string) => {
    try {
        var result = groupService.removeGroupMember(currentRoom.id, id);        
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    const newUsers = currentRoom?.otherRoomMemberInfos.map((info) => info.user);
    setUsers(newUsers);
  }, [currentRoom.otherRoomMemberInfos.length])
  return (
    <div className="group-manager">
      <button onClick={handleDeleteGroup}>Xóa nhóm</button>
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Nhập để tìm kiếm" name="searchTerm" />
        <button>Tìm kiếm</button>
      </form>
      <ul>
      {users && users.map((user) => (
        <div key={user.id} className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.fullname}</span>
          </div>
         <div className="group-btn">
          <button className="left-btn" onClick={() => handleSetGroupOwner(user.id)}>Chủ Nhóm</button>
          <button className="right-btn" onClick={() => handleKick(user.id)}>Đuổi</button>
         </div>
        </div>
      ))}
      {users && users.length === 0 && (
        <p>Không tìm thấy kết quả</p>
      )}
      </ul>
      
    </div>
  )
}

export default GroupManager
