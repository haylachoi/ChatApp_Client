import { chatService } from '@/services/chatService';
import React, {
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import './chat-prompt.css';
import { useCurrentRoomId } from '@/stores/roomStore';
import { useQuoteStore } from '@/stores/quoteStore';
import MessageQuote from '@/components/message-quote/message-quote';

const ChatPrompt = () => {
  const currentRoomId = useCurrentRoomId() as string;

  const isReceiverBlocked = false;
  const isCurrentUserBlocked = false;
  const [open, setOpen] = useState(false);
  const { quote, setQuote } = useQuoteStore();

  const inputRef: React.LegacyRef<HTMLTextAreaElement> | undefined =
    useRef(null);
  const handleImg: React.ChangeEventHandler<HTMLInputElement> | undefined = (
    e,
  ) => {
    const files = e.currentTarget.files;
    if (!files) return;

    chatService
      .sendImageMessage(files, currentRoomId)
      .then((result) => {})
      .catch((error: any) => {
        console.log(error);
      });
  };
  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> | undefined = (
    e,
  ) => {
    if (!e.altKey && !e.shiftKey && e.key == 'Enter') {
      handleSend();
    }
  };
  const handleEmoji = (e: any) => {
    if (inputRef.current) {
      inputRef.current.value = inputRef.current?.value + e.native;
    }
    setOpen(false);
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

  const handleTextChange:
    | React.ChangeEventHandler<HTMLTextAreaElement>
    | undefined = (e) => {
    const textarea = e.currentTarget;
    if (textarea.value == '\n') {
      textarea.value = '';
    }

    if (textarea.scrollHeight < 300) {
      textarea.style.height = 'auto'; // Reset the height
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = '';
    if (quote) setQuote(undefined);
  }, [currentRoomId]);
  return (
    <div className="chat-prompt" onClick={() => inputRef.current?.focus()}>
      <div className="icons">
        <label htmlFor="file">
          <img src="./img.png" alt="" />
        </label>
        <input
          type="file"
          multiple
          id="file"
          style={{ display: 'none' }}
          onChange={handleImg}
        />
        <img src="./camera.png" alt="" />
        <img src="./mic.png" alt="" />
      </div>
      <div className="chat-input">
        {quote && (        
          <MessageQuote quote={quote} isShowDeleteBtn />
        )}
        <textarea
          className="text-input"
          ref={inputRef}
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? 'You cannot send a message'
              : 'Type a message...'
          }
          rows={1}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
      </div>
      <div className="emoji">
        <img
          src="./emoji.png"
          alt=""
          onClick={() => setOpen((prev) => !prev)}
        />
        <div className="picker">
          {open && (
            <Picker
              data={data}
              onEmojiSelect={handleEmoji}
              onClickOutside={() => {
                setOpen(false);
              }}
            />
          )}
          
        </div>
      </div>
      <button
        className="sendButton"
        onClick={handleSend}
        disabled={isCurrentUserBlocked || isReceiverBlocked}>
        Send
      </button>
    </div>
  );
};

export default ChatPrompt;
