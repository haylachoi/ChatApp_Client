
import { roomService } from "@/services/roomService";
import { useAlertModalActions } from "@/stores/alertModalStore";
import { useAppModalActions } from "@/stores/modalStore";
import { useCurrentRoom, useRoomActions } from "@/stores/roomStore";
import { useEffect } from "react";


const useLeftRoomEvent = () => {
  const {removeRoomChat, setCurrentRoom} = useRoomActions();
  const {closeModal, setCurrentModal} = useAppModalActions();
  const {onClose} = useAlertModalActions()
  const currentRoom = useCurrentRoom();
  
  useEffect(() => {
    const key = roomService.onLeftRoom.sub((roomId) => {
      if (currentRoom && currentRoom.id === roomId) {
        onClose();
        setCurrentModal(undefined);
        closeModal();
        setCurrentRoom(undefined);
      }
      removeRoomChat(roomId);
    });

    return () => {
      roomService.onLeftRoom.unsub(key);
    };
  }, [currentRoom]);
}

export default useLeftRoomEvent
