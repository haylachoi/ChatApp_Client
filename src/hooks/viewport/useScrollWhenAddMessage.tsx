import { chatService } from '@/services/chatService';
import { useEffect, useRef } from 'react';
import useInView from '../useIsInView';
import { MessageIdType, Profile, RoomIdType } from '@/libs/types';
import { useCurrentUser } from '@/stores/authStore';
import { useRoomStore } from '@/stores/roomStore';
import { currentViewPortStore } from '@/stores/chatViewportStore';

function isChildVisibleInParent(
  child: HTMLElement,
  parent: HTMLElement,
  threshold = 0.3,
): boolean {
  const childRect = child.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  // Tính phần giao nhau giữa child và parent
  const intersectionTop = Math.max(childRect.top, parentRect.top);
  const intersectionBottom = Math.min(childRect.bottom, parentRect.bottom);

  const visibleHeight = intersectionBottom - intersectionTop;
  const childHeight = childRect.height;

  // Nếu không có giao nhau (ẩn hoàn toàn)
  if (visibleHeight <= 0) return false;

  // So sánh tỷ lệ phần tử con hiển thị với threshold
  const visibleRatio = visibleHeight / childHeight;
  return visibleRatio >= threshold;
}

const useScrollWhenAddMessage = () => {
  const currentRoom = useRoomStore(({ currentRoom: room }) => ({
    roomId: room?.id as RoomIdType,
    chats: room?.chats,
    firstUnseenMessageId: room?.currentRoomMemberInfo.firstUnseenMessageId,
  }));
  const viewport = currentViewPortStore.chatViewport;
  const lastMessage = currentViewPortStore.lastMessage;
  const isLastMessageInViewRef = useInView(viewport, lastMessage);
  const receicedMessageRef = useRef<MessageIdType>();

  useEffect(() => {
    if (
      currentRoom.chats &&
      receicedMessageRef.current &&
      currentViewPortStore.lastMessage?.dataset.id &&
      receicedMessageRef.current ==
        +currentViewPortStore.lastMessage?.dataset.id
    ) {
      // const lastMessage = currentRoom.chats[currentRoom.chats.length - 1];
      if (isLastMessageInViewRef.current) {
        lastMessage?.scrollIntoView({
          behavior: 'smooth',
        });
      } else if (currentRoom.chats.length > 1) {
        const secondLastMessage =
          currentRoom.chats[currentRoom.chats.length - 2];
        const lastMessageElement = viewport?.querySelector(
          `[data-id='${secondLastMessage.id}']`,
        ) as HTMLElement | null;
        if (lastMessageElement && viewport) {
          const visible = isChildVisibleInParent(lastMessageElement, viewport);
          if (visible) {
            lastMessageElement.scrollIntoView({
              behavior: 'smooth',
            });
          }
        }
      }
    }
  }, [currentRoom.chats]);
  useEffect(() => {
    const key = chatService.onReceiveMessage.sub((message) => {
      if (
        currentRoom.chats &&
        currentRoom.chats.length > 0 &&
        message.roomId == currentRoom.roomId
      ) {
        receicedMessageRef.current = message.id;
      }
    });

    return () => chatService.onReceiveMessage.unsub(key);
  }, [currentRoom.roomId, currentRoom.chats]);
};

export default useScrollWhenAddMessage;
