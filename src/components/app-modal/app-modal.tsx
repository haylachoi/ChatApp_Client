import { ModalElement, useAppModalActions, useCurrentModal, useIsModalOpen } from '@/stores/modalStore'
import React from 'react'
import Modal from '../ui/modal/modal';
import AddUser from '../addUser/add-user';
import GroupManager from '../group-manager/group-manager';

const AppModal = () => {
    const isOpen = useIsModalOpen();
    const current = useCurrentModal();
    const {closeModal} = useAppModalActions();
    
  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
     <div>
     {current === ModalElement.addUser && (
        <AddUser/>
      )}
       {current === ModalElement.groupManager && (
        <GroupManager/>
      )}
     </div>
     
    </Modal>
  )
}

export default AppModal
