import React from 'react'
import "./create-group.css"
import { roomService } from '@/services/roomService';
import { groupService } from '@/services/groupService';
import { useCurrentUser } from '@/stores/authStore';

const CreateGroup = () => {
    const currentUser = useCurrentUser();
    const handleCreateGroup: React.FormEventHandler<HTMLFormElement> | undefined = (e) => {
        e.preventDefault();
        if (!currentUser) return;
        const element = e.currentTarget;
        const formData = new FormData(element);
        formData.append('groupOwnerId', currentUser.id);
        groupService.createGroup(formData).then((result) => {

        }).catch((error) => {
            console.log(error);
        });
    }
  return (
    <div className='create-group'>
      <form onSubmit={handleCreateGroup}>   
        <div className="group">
         <input name="name" placeholder="Tên nhóm"/>
         <button type="submit">Tạo</button>     
        </div>
      </form>
    </div>
  )
}

export default CreateGroup
