
import { roomService } from "@/services/roomService";
import { useAlertModalActions } from "@/stores/alertModalStore";
import { useAppModalActions } from "@/stores/modalStore";
import { useCurrentRoomId, useRoomActions } from "@/stores/roomStore";
import { useEffect } from "react";


const useLeftRoomEvent = () => {
  const {removeRoom, setCurrentRoom} = useRoomActions();
  const {closeModal, setCurrentModal} = useAppModalActions();
  const {onClose} = useAlertModalActions()
  const currentRoomId = useCurrentRoomId();
  
  useEffect(() => {
    const key = roomService.onLeftRoom.sub((roomId) => {
      if (currentRoomId === roomId) {
        onClose();
        setCurrentModal(undefined);
        closeModal();
        setCurrentRoom(undefined);
      }
      removeRoom(roomId);
    });

    return () => {
      roomService.onLeftRoom.unsub(key);
    };
  }, [currentRoomId]);
}

export default useLeftRoomEvent
