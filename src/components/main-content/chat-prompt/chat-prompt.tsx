import { chatService } from '@/services/chatService';
import React, {
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';

import './chat-prompt.css';
import { useCurrentRoomId } from '@/stores/roomStore';
import { useQuoteStore } from '@/stores/quoteStore';
import MessageQuote from '@/components/main-content/message-list/message-item/message-quote/message-quote';
import { RoomIdType } from '@/libs/types';
import SendButton from './send-button/send-button';
import Emoji from './emoji/emoji';
import ChatInput from './chat-input/chat-input';
import InputActionMenu from './input-action-menu/input-action-menu';

const ChatPrompt = () => {
  const currentRoomId = useCurrentRoomId() as RoomIdType;
  const { quote, setQuote } = useQuoteStore();

  const inputRef: React.LegacyRef<HTMLTextAreaElement> | undefined =
    useRef(null);
  

  const handleEmoji = (e: any) => {
    if (inputRef.current) {
      inputRef.current.value = inputRef.current?.value + e.native;
    }
    inputRef.current?.focus();
  };
  const handleSend = async () => {
    const text = inputRef.current?.value.trim();
    if (!text) {
      return;
    }
    try {
      await chatService.sendMessage(currentRoomId, text, quote?.id);
    } catch (err) {
      console.log(err);
    } finally {
      if (inputRef.current) {
        inputRef.current.value = '';
        if (quote) setQuote(undefined);
      }
    }
  };


  return (
    <div className="chat-prompt" onClick={() => inputRef.current?.focus()}>
      <InputActionMenu />
      <ChatInput ref={inputRef} onSend={handleSend}/>
      <Emoji onOk={handleEmoji} />
      <SendButton onclick={handleSend} />
    </div>
  );
};

export default ChatPrompt;
