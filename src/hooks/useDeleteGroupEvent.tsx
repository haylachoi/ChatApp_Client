import { groupService } from '@/services/groupService';
import { useAlertModalActions } from '@/stores/alertModalStore';
import { useAppModalActions } from '@/stores/modalStore';
import { useCurrentRoom, useRoomActions } from '@/stores/roomStore'
import { useEffect } from 'react'

const useDeleteGroupEvent = () => {
  const {removeRoomChat, setCurrentRoom} = useRoomActions();
  const {closeModal, setCurrentModal} = useAppModalActions();
  const {onClose} = useAlertModalActions()
  const currentRoom = useCurrentRoom();
  useEffect(() => {
  const key = groupService.onDeleteGroup.sub((roomId) => {
    if (currentRoom && currentRoom.id === roomId) {
      onClose();
      setCurrentModal(undefined);
      closeModal();
      setCurrentRoom(undefined);
    }
    removeRoomChat(roomId);
  })

  return () => {
    groupService.onDeleteGroup.unsub(key);
  }
 },[currentRoom])
}

export default useDeleteGroupEvent
