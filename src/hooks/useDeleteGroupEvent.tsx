import { groupService } from '@/services/groupService';
import { useAlertModalActions } from '@/stores/alertModalStore';
import { useAppModalActions } from '@/stores/modalStore';
import { useCurrentRoomId, useRoomActions } from '@/stores/roomStore'
import { useEffect } from 'react'

const useDeleteGroupEvent = () => {
  const {removeRoom: removeRoomChat, setCurrentRoom} = useRoomActions();
  const {closeModal, setCurrentModal} = useAppModalActions();
  const {onClose} = useAlertModalActions()
  const currentRoomId = useCurrentRoomId();
  useEffect(() => {
  const key = groupService.onDeleteGroup.sub((roomId) => {
    if ( currentRoomId === roomId) {
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
 },[currentRoomId])
}

export default useDeleteGroupEvent
