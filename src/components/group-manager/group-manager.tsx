import React, { useEffect } from 'react'
import "./group-manager.css"
import { FormEvent, useState } from "react";
import { groupService } from '@/services/groupService';
import { useAlertModal } from '@/stores/alertModalStore';
import { useCurrentRoomMembers, useCurrentRoomId, RoomMemberDetail } from '@/stores/roomStore';


const GroupManager = () => {
  const {otherMembers} = useCurrentRoomMembers() as RoomMemberDetail;
  const currentRoomId = useCurrentRoomId() as string;
  const {onOpen, setOnOk} = useAlertModal();
  const [users, setUsers] = useState(otherMembers.map((info) => info.user));

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchTerm = formData.get("searchTerm") as string;
    if(!searchTerm) return;
   
    setUsers(otherMembers.filter((info) => info.user.fullname.toLowerCase().includes(searchTerm.toLowerCase())).map((info) => info.user));
  };

  const handleDeleteGroup = () => {
    setOnOk(() => groupService.deleteGroup(currentRoomId));
    onOpen();
  }
  const handleSetGroupOwner = (id: string) => {
    
  }
  const handleKick = async (id: string) => {
    try {
        var result = groupService.removeGroupMember(currentRoomId, id);        
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    const newUsers = otherMembers.map((info) => info.user);
    setUsers(newUsers);
  }, [otherMembers.length])
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
