import './send-img-button.css';
import { RoomIdType } from '@/libs/types';
import { chatService } from '@/services/chatService';
import { useCurrentRoomId } from '@/stores/roomStore';
import React from 'react';

const SendImgButton = () => {
  const currentRoomId = useCurrentRoomId() as RoomIdType;

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
  return (
    <button className="send-img-btn">
        <label htmlFor="file">
          <img className="size-m" src="./img.png" alt="" />
        </label>
        <input
          type="file"
          multiple
          id="file"
          style={{ display: 'none' }}
          onChange={handleImg}
        />
      </button>
  )
}

export default SendImgButton
