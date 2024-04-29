import "./userInfo.css"
import { useUserStore } from "../../../stores/userStore";
import React from "react";

const Userinfo = () => {

  const { currentUser } = useUserStore();

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