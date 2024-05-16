import {
  ModalElement,
  useAppModalActions,
  useCurrentModal,
  useIsModalOpen,
} from '@/stores/modalStore';
import React from 'react';
import Modal from '../ui/modal/modal';
import AddUser from '../addUser/add-user';
import GroupManager from '../group-manager/group-manager';
import CreateGroup from '../create-group/create-group';
import Profile from '../profile/profile';

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
      </div>
    </Modal>
  );
};

export default AppModal;
