import { roomService } from "@/services/roomService";
import { useRoomActions, useRoomStore } from "@/stores/roomStore";

const useFetchChat = () => {
  const currentRoom = useRoomStore(({currentRoom: room}) => ({
    roomId: room?.id as string,
    firstMessageId: room?.firstMessageId,
    lastMessageId: room?.lastMessage?.id,
    chats: room?.chats,
  }));
  const {
    addPreviousMesasges,
    addNextMesasges,
  } = useRoomActions();
  const canFetchPrevious =
    currentRoom.chats == undefined ||
    currentRoom.firstMessageId == undefined ||
    currentRoom.chats.length == 0
      ? undefined
      : +currentRoom.chats[0].id > +currentRoom.firstMessageId;

  const canFetchNext =
    currentRoom.chats == undefined ||
    currentRoom.lastMessageId == undefined ||
    currentRoom.chats.length == 0
      ? undefined
      : +currentRoom.chats[currentRoom.chats.length - 1].id < +currentRoom.lastMessageId;

  const fetchPrevious = async () => {
    if (!currentRoom.chats) return;

    var result = await roomService.getPreviousMessages(
      currentRoom.roomId,
      currentRoom.chats[0].id,
    );
    if (result.isSuccess) {
      addPreviousMesasges(currentRoom.roomId, result.data);
    }
  };
  const fetchNext = async () => {
    if (!currentRoom.chats) return;

    var result = await roomService.getNextMessages(
      currentRoom.roomId,
      currentRoom.chats[currentRoom.chats.length - 1].id,
    );
    addNextMesasges(currentRoom.roomId, result.data);
  };
  
  return { canFetchPrevious: !!canFetchPrevious, canFetchNext: !!canFetchNext, fetchPrevious, fetchNext}
}

export default useFetchChat
