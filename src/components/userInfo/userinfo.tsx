import { useCurrentUser } from "@/stores/userStore";
import "./userInfo.css"
import React from "react";

const Userinfo = () => {

  const  currentUser  = useCurrentUser();

  return (
    <div className='userInfo'>
      <div className="user">
        <img src={currentUser?.avatar || "./avatar.png"} alt="" />
        <h2>{currentUser?.fullname}</h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt="" />
        <img src="./video.png" alt="" />
        <img src="./edit.png" alt="" />
      </div>
    </div>
  )
}

export default Userinfo