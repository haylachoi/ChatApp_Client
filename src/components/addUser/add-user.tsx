import "./add-user.css";

import { FormEvent, useState } from "react";
import React from "react";
import { userService } from "@/services/userService";
import { roomService } from "@/services/roomService";
import { User } from "@/libs/types";
import { useCurrentUser } from "@/stores/userStore";

const AddUser = () => {
  const [users, setUsers] = useState<User[]>([]);

  const currentUser = useCurrentUser();

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchTerm = formData.get("searchTerm") as string;
    

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
      console.log("add room",result);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="name" name="Nhập tên" />
        <button>Tìm kiếm</button>
      </form>
      {users && users.map((user) => (
        <div key={user.id} className="user">
          <div className="detail">
            <img src={user?.avatar || "./avatar.png"} alt="" />
            <span>{user?.fullname}</span>
          </div>
         <div className="group-btn">
          <button className="left-btn" onClick={() => handleAdd(user.id!)}>Nhắn tin</button>
          <button className="right-btn" onClick={() => handleAdd(user.id!)}>Kết bạn</button>
         </div>
        </div>
      ))}
      
    </div>
  );
};

export default AddUser;
