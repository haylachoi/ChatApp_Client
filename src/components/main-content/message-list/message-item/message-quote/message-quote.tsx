import { currentViewPortStore } from '@/stores/chatViewportStore';
import './message-quote.css';
import { MessageData, RoomIdType } from '@/libs/types';
import { useQuoteStore } from '@/stores/quoteStore';
import {
  useCurrentRoomId,
  useRoomActions,
  useRoomStore,
} from '@/stores/roomStore';
import { X } from 'lucide-react';
import React from 'react';
import { roomService } from '@/services/roomService';

interface MessageQuoteProps {
  quote: MessageData;
  isShowDeleteBtn?: boolean;
}
const MessageQuote: React.FC<MessageQuoteProps> = ({
  quote,
  isShowDeleteBtn,
}) => {
  const members = useRoomStore(({ currentRoom }) => ({
    others: currentRoom?.otherRoomMemberInfos,
    current: currentRoom?.currentRoomMemberInfo,
  }));
  const currentRoomId = useCurrentRoomId() as RoomIdType;
  const firstMessageId = useRoomStore((state) =>
    state.currentRoom?.chats && state.currentRoom.chats.length > 0
      ? state.currentRoom.chats[0].id
      : undefined,
  );

  const { addPreviousMesasges } = useRoomActions();
  const { setQuote } = useQuoteStore();
  const sender =
    quote.senderId == members.current?.user.id
      ? members.current.user
      : members.others?.find((m) => m.user.id === quote.senderId)?.user;

  const displayName =
    quote.senderId == members.current?.user.id
      ? 'Bạn'
      : sender?.fullname ?? 'Vô danh';
          

  const handleScrollIntoView: React.MouseEventHandler<HTMLButtonElement> | undefined = async (e) => {
    // e.stopPropagation();
    
    const viewport = currentViewPortStore.chatViewport;
    if (!viewport) return;
    const quoteId = +quote.id;
    const element = viewport.querySelector(`[data-id="${quote.id}"]`);

    if (element) {
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!firstMessageId) return;

    // fromId -10 to avoid fetch more data from infinite-scroll component when auto scroll to 'from element' (because it's first element)
    const result = await roomService.getMessagesFromTo(
      currentRoomId,
      quoteId - 10,
      firstMessageId,
    );
    if (!result.isSuccess || result.data.length === 0) return;
    addPreviousMesasges(currentRoomId, result.data);
    setTimeout(() => {
      const element = viewport?.querySelector(`[data-id="${quoteId}"]`);
      if (element) {
        // use { behavior: 'smooth' } may be end up with wrong element due to infinite-scroll component fetch more data.
        // To avoid this error, fetch more data ealier or use { behavior: 'instant' }

        // element?.scrollIntoView({ behavior: 'instant' });
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 0);
  };
  return (
    <div className="message-quote">
      <button className="card" onClick={handleScrollIntoView}>
        <h4
          // style={
          //   {
          //     '--name-color': sender?.fullname.toHSL(),
          //   } as React.CSSProperties
          // }
          className="owner">
          {displayName}
        </h4>
        {quote.isImage && (
          <img className="quote-img" src={quote.content}/>
        )}
        {!quote.isImage && (
          <pre className="quote-text">{quote.content}</pre>
        )}
      </button>
      {isShowDeleteBtn && (
        <button
          className="delete-btn btn-none"
          onClick={() => setQuote(undefined)}>
          <X />
        </button>
      )}
    </div>
  );
};

export default MessageQuote;
