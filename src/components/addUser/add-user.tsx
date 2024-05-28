import "./add-user.css";
import { FormEvent, useState } from "react";
import React from "react";
import { userService } from "@/services/userService";
import { roomService } from "@/services/roomService";
import { User } from "@/libs/types";

interface FormElements extends HTMLFormControlsCollection {
  searchTerm: HTMLInputElement
}
interface SearchFormElement extends HTMLFormElement {
  readonly elements: FormElements
}


const AddUser = () => {
  const [users, setUsers] = useState<User[]>([]);

  const handleSearch = async (e: FormEvent<SearchFormElement>) => {
    e.preventDefault();
    const searchTerm = e.currentTarget.elements.searchTerm.value;
    

    try {
      const result = await userService.searchUser(searchTerm);
      if (result.isSuccess) {
        setUsers(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async (id: string) => {
    try {
      const result = await roomService.createRoom(id)
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" name="searchTerm" placeholder="Nhập tên" />
        <button>Tìm kiếm</button>
      </form>
      <div className="separator"></div>
      <ul>
      {users && users.map((user) => (
        <li key={user.id} className="user">
          <div className="detail">
            <img src={user?.avatar || "./avatar.png"} alt="" />
            <span>{user?.fullname}</span>
          </div>
         <div className="group-btn">
          <button className="left-btn" onClick={() => handleAdd(user.id!)}>Nhắn tin</button>
          <button className="right-btn" onClick={() => handleAdd(user.id!)}>Kết bạn</button>
         </div>
        </li>
      ))}
      </ul>
      
    </div>
  );
};

export default AddUser;
