import {  GroupIdType, RoomIdType, User } from '@/libs/types';
import { userService } from '@/services/userService';
import React, { FormEvent, useState } from 'react'
import './add-group-member.css'
import { groupService } from '@/services/groupService';
import { useCurrentRoomId } from '@/stores/roomStore';

interface FormElements extends HTMLFormControlsCollection {
  searchTerm: HTMLInputElement
}
interface SearchFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

const AddGroupMember = () => {
  const [users, setUsers] = useState<User[]>([]);
  const currentRoomId = useCurrentRoomId() as RoomIdType;
 

  const handleSearch = async (e: React.FormEvent<SearchFormElement>) => {
    e.preventDefault();
    const searchTerm = e.currentTarget.elements.searchTerm.value;

    try {
      const result = await userService.searchUserNotInRoom(currentRoomId, searchTerm);
      if (result.isSuccess) {
        setUsers(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddGroup = async (id: GroupIdType) => {
    try {
       const result = await groupService.addGroupMember(currentRoomId, id);
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
      {/* <div className="separator"></div> */}
      <ul>
      {users && users.map((user) => (
        <li key={user.id} className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.fullname}</span>
          </div>
         <div className="group-btn">
          <button className="add-member-btn" onClick={() => handleAddGroup(user.id)}>Thêm</button>  
         </div>
        </li>
      ))}
      </ul>
      
    </div>
  )
}

export default AddGroupMember
