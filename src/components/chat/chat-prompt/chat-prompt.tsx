import { chatService } from '@/services/chatService';
import { useCurrentRoom } from '@/stores/roomStore';
import { useCurrentUser } from '@/stores/authStore';
import React, { KeyboardEventHandler, useRef, useState } from 'react';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import './chat-prompt.css';

const ChatPrompt = () => {
  const currentUser = useCurrentUser();
  const currentRoom = useCurrentRoom();
  if (!currentRoom) return <></>;
  const isReceiverBlocked = false;
  const isCurrentUserBlocked = false;
  const [open, setOpen] = useState(false);

 const inputRef: React.LegacyRef<HTMLInputElement> | undefined = useRef(null);
  const handleImg: React.ChangeEventHandler<HTMLInputElement> | undefined = (
    e,
  ) => {
    const files = e.currentTarget.files;
    if (!files) return;

    chatService
      .sendImageMessage(files, currentRoom.id)
      .then((result) => {})
      .catch((error: any) => {
        console.log(error);
      });
  };
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> | undefined = (
    e,
  ) => {
    if (e.key == 'Enter') {
      handleSend();
    }
  };
  const handleEmoji = (e: any) => {
    if (inputRef.current) {
      inputRef.current.value = inputRef.current?.value + e.native
    }
    setOpen(false);
    inputRef.current?.focus();
  };
  const handleSend = async () => {
    const text = inputRef.current?.value;
    if (!text) {
      return;
    }
    try {
      await chatService.sendMessage(currentRoom.id, text);
    } catch (err) {
      console.log(err);
    } finally {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };
  return (
    <div className="bottom">
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
      <input
        type="text"
        ref={inputRef}
        placeholder={
          isCurrentUserBlocked || isReceiverBlocked
            ? 'You cannot send a message'
            : 'Type a message...'
        }
        onKeyDown={handleKeyDown}
        disabled={isCurrentUserBlocked || isReceiverBlocked}
      />
      <div className="emoji">
        <img
          src="./emoji.png"
          alt=""
          onClick={() => setOpen((prev) => !prev)}
        />
        <div className="picker">
         
          {open && (
            <Picker data={data} onEmojiSelect={handleEmoji} onClickOutside={() => {setOpen(false); setOpen(false);}}/>
          )}
        </div>
      </div>
      <button
        className="sendButton"
        onClick={handleSend}
        disabled={isCurrentUserBlocked || isReceiverBlocked}>
        Send
      </button>
      ,
    </div>
  );
};

export default ChatPrompt;
