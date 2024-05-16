import { useCurrentUser } from "@/stores/authStore";
import "./userInfo.css"
import React from "react";
import { ModalElement, useAppModalActions } from "@/stores/modalStore";

const Userinfo = () => {
  const {setCurrentModal, openModal} = useAppModalActions();
  const  currentUser  = useCurrentUser();
  const handleOpenProfile = () => {
    setCurrentModal(ModalElement.profile);
    openModal();
  }
  return (
    <div className='userInfo'>
      <div className="user">
        <button className="btn-none" onClick={handleOpenProfile}>
        <img src={currentUser?.avatar || "./avatar.png"} alt="" />
        </button>
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