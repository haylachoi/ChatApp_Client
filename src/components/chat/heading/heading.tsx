import { useCurrentRoom } from '@/stores/roomStore'
import React, { useState } from 'react'
import './heading.css'
import { IoPersonAddOutline } from 'react-icons/io5';
import Modal from '@/components/ui/modal/modal';
import AddGroupMember from '@/components/add-group-member/add-group-member';
import { ModalElement, useAppModalActions, useCurrentModal } from '@/stores/modalStore';
const Heading = () => {
    const currentRoom = useCurrentRoom();
    if (!currentRoom) return <></>;
    const [isAddGroupMemberOpen, setIsAddGroupMemberOpen] = useState(false);
   
    const {openModal, setCurrentModal} = useAppModalActions();
    const handleOpenRoomDetail = () => {
      setCurrentModal(ModalElement.groupManager);
      openModal();
    }
  return (
    <div className="top">
        <div className="user">
          <button className="btn-none info-btn" onClick={handleOpenRoomDetail}>
            <img
              src={
                (currentRoom.isGroup
                  ? currentRoom.avatar
                  : currentRoom.otherRoomMemberInfos[0].user.avatar) ||
                './avatar.png'
              }
              alt=""
            />
          </button>
          <div className="texts">
            <span>
              {currentRoom.isGroup
                ? currentRoom.name
                : currentRoom.otherRoomMemberInfos[0].user.fullname}
            </span>
            <p>Lorem ipsum dolor, sit amet.</p>
          </div>
        </div>
        <div className="icons">
          {currentRoom.isGroup && (
             <button className="add-btn" onClick={() => setIsAddGroupMemberOpen((prev) => !prev)}>
             <IoPersonAddOutline className="add-icon" />
           </button>
          )}
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>

        <Modal isOpen={isAddGroupMemberOpen} onClose={() => setIsAddGroupMemberOpen(false)}>
            <AddGroupMember />
        </Modal>
      </div>
  )
}

export default Heading
