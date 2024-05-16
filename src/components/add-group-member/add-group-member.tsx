import { User } from '@/libs/types';
import { userService } from '@/services/userService';
import { useCurrentUser } from '@/stores/authStore';
import React, { FormEvent, useState } from 'react'
import './add-group-member.css'
import { useCurrentRoom } from '@/stores/roomStore';
import { groupService } from '@/services/groupService';


const AddGroupMember = () => {
    const [users, setUsers] = useState<User[]>([]);

  const currentUser = useCurrentUser();
  const currentRoom = useCurrentRoom();
  if (!currentRoom || !currentUser) return <></>;

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchTerm = formData.get("searchTerm") as string;
    
    try {
      const result = await userService.searchUserNotInRoom(currentRoom.id, searchTerm);
      if (result.isSuccess) {
        setUsers(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async (id: string) => {
    try {
       const result = await groupService.addGroupMember(currentRoom.id, id);
       if (result.isSuccess){
        setUsers(pre => pre.filter(u => u.id !== id));
       }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="add-group-member">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Nhập tên" name="searchTerm" />
        <button>Tìm kiếm</button>
      </form>
      {users && users.map((user) => (
        <div key={user.id} className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.fullname}</span>
          </div>
         <div className="group-btn">
          <button className="left-btn" onClick={() => handleAdd(user.id)}>Thêm</button>
        
         </div>
        </div>
      ))}
      
    </div>
  )
}

export default AddGroupMember
