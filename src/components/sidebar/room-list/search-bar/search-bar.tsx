import './search-bar.css';
import React, { useState } from 'react';
import { useAppModalActions } from '@/stores/modalStore';
import { IoPersonAddOutline } from 'react-icons/io5';
import { MdOutlineGroupAdd } from 'react-icons/md';

interface SearchBarProps {
  setInput: React.Dispatch<React.SetStateAction<string>>;
}
const SearchBar: React.FC<SearchBarProps> = ({ setInput }) => {
  const { openAddUserModal, openCreateGroupModal } = useAppModalActions();

  return (
    <div className="search-bar">
      <div className="search-input">
        <img src="./search.png" alt="" />
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div className="group-btn">
        <button className="add-btn" onClick={openAddUserModal}>
          <IoPersonAddOutline className="add-icon" />
        </button>
        <button className="add-btn" onClick={openCreateGroupModal}>
          <MdOutlineGroupAdd className="add-icon" />
        </button>
      </div>
    </div>
  );
};

export default React.memo(SearchBar);
