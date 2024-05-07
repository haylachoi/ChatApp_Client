import React from 'react'
import "./group-manager.css"
import { FormEvent, useState } from "react";


import { User } from "@/libs/types";
import { useCurrentUser } from "@/stores/userStore";
import { useCurrentRoom } from '@/stores/roomStore';
import { groupService } from '@/services/groupService';

const GroupManager = () => {
  const currentRoom = useCurrentRoom();
  const currentUser = useCurrentUser();
  if (!currentRoom || !currentUser) return <></>;

  const [users, setUsers] = useState(currentRoom?.otherRoomMemberInfos.map((info) => info.user));
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchTerm = formData.get("searchTerm") as string;
    
    setUsers(currentRoom.otherRoomMemberInfos.filter((info) => info.user.fullname?.includes(searchTerm)).map((info) => info.user));
  };

  const handleKick = async (id: string) => {
    try {
        var result =groupService.removeGroupMember(currentRoom.id, id);
    } catch (error) {
        console.log(error);
    }
  }
  return (
    <div className="group-manager">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="name" name="Nhập tên" />
        <button>Tìm kiếm</button>
      </form>
      {users && users.map((user) => (
        <div key={user.id} className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.fullname}</span>
          </div>
         <div className="group-btn">
          <button className="left-btn" onClick={() => handleKick(user.id)}>Đuổi</button>
        
         </div>
        </div>
      ))}
      
    </div>
  )
}

export default GroupManager
