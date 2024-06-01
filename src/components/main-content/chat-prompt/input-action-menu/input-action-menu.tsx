import './input-action-menu.css';
import React from 'react';
import SendImgButton from './send-img-button/send-img-button';

const InputActionMenu = () => {
  
  return (
    <div className="input-action-menu">
      <SendImgButton />
      <img className="size-m" src="./camera.png" alt="" />
      <img className="size-m" src="./mic.png" alt="" />
    </div>
  );
};

export default InputActionMenu;
