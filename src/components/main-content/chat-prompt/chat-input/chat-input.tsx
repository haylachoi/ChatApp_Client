import { MessageData, RoomIdType } from '@/libs/types';
import './chat-input.css';
import React, { KeyboardEventHandler, MutableRefObject, useEffect } from 'react';
import MessageQuote from '../../message-list/message-item/message-quote/message-quote';
import { useQuoteStore } from '@/stores/quoteStore';
import { useCurrentRoomId } from '@/stores/roomStore';

const resetHeight = (textarea: HTMLTextAreaElement) => {
  if (textarea.scrollHeight < 300) {
    textarea.style.height = 'auto'; // Reset the height
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
};

interface ChatInputProps {
  onSend: () => void;
}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({onSend }, inputRef) => {
    const currentRoomId = useCurrentRoomId() as RoomIdType;
    const { quote, setQuote } = useQuoteStore();
    
    const handleTextChange:
      | React.ChangeEventHandler<HTMLTextAreaElement>
      | undefined = (e) => {
      resetHeight(e.currentTarget);
    };

    const handleKeyDown:
      | KeyboardEventHandler<HTMLTextAreaElement>
      | undefined = (e) => {
      if (!e.altKey && !e.shiftKey && e.key == 'Enter') {
        e.preventDefault();
        onSend();
        
        e.currentTarget.value = '';
        resetHeight(e.currentTarget);
      }
    };

    useEffect(() => {
      const ref = inputRef as MutableRefObject<HTMLTextAreaElement | null>;
      const element = ref.current;
      if (element) 
        element.value = '';
      if (quote) setQuote(undefined);
    }, [currentRoomId]);
    
    return (
      <div className="chat-input">
        {quote && <MessageQuote quote={quote} isShowDeleteBtn />}
        <textarea
          className="text-input"
          ref={inputRef}
          // placeholder={
          //   isCurrentUserBlocked || isReceiverBlocked
          //     ? 'You cannot send a message'
          //     : 'Type a message...'
          // }
          rows={1}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          // disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
      </div>
    );
  },
);

export default ChatInput;
