import './emoji.css';
import React, { useEffect, useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiProps {
  onOk: (e: any) => void;
}
const Emoji: React.FC<EmojiProps> = ({ onOk }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="emoji">
      <button
        className="btn-none"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((pre) => !pre);
        }}>
        <img className="size-m" src="./emoji.png" alt="" />
      </button>
      <div className="picker">
        {isOpen && (
          <Picker
            data={data}
            onEmojiSelect={(e: any) => {
              onOk(e);
              setIsOpen(false);
            }}
            onClickOutside={() => {
              setIsOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Emoji;
