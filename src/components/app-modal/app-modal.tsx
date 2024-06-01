import {
  ModalElement,
  useAppModalActions,
  useCurrentModal,
  useIsModalOpen,
} from '@/stores/modalStore';
import React from 'react';
import Modal from '../ui/modal/modal';
import AddUser from '../modal-content/addUser/add-user';
import GroupManager from '../modal-content/group-manager/group-manager';
import CreateGroup from '../modal-content/create-group/create-group';
import Profile from '../modal-content/profile/profile';
import AddGroupMember from '../modal-content/add-group-member/add-group-member';

const AppModal = () => {
  const isOpen = useIsModalOpen();
  const current = useCurrentModal();
  const { closeModal } = useAppModalActions();

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <div>
        {current === ModalElement.addUser && <AddUser />}
        {current === ModalElement.groupManager && <GroupManager />}
        {current === ModalElement.createGroup && <CreateGroup />}
        {current === ModalElement.profile && <Profile />}
        {current === ModalElement.addRoomMember && <AddGroupMember />}
      </div>
    </Modal>
  );
};

export default AppModal;
