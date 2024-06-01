import { IoPersonAddOutline } from 'react-icons/io5';
import React from 'react';
import { useAppModalActions } from '@/stores/modalStore';
import { useRoomStore } from '@/stores/roomStore';

const AddMemberButton = () => {
  const isGroup = useRoomStore((state) => state.currentRoom?.isGroup);
  const { openAddRoomMemberModal } = useAppModalActions();

  const handleOpenAddRoomMember = () => {
    if (!isGroup) return;
    openAddRoomMemberModal();
  };
  return (
    <button className="btn-none" onClick={handleOpenAddRoomMember}>
      <IoPersonAddOutline className="size-m text-white" />
    </button>
  );
};

export default AddMemberButton;
