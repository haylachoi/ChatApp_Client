import React from 'react'
import "./create-group.css"
import { roomService } from '@/services/roomService';

const CreateGroup = () => {

    const handleCreateGroup: React.FormEventHandler<HTMLFormElement> | undefined = (e) => {
        e.preventDefault();

        const element = e.currentTarget;
        const formData = new FormData(element);
        console.log(formData, formData.get("groupName"));
        roomService.createGroup(formData).then((result) => {

        }).catch((error) => {
            console.log(error);
        });
    }
  return (
    <div className='create-group'>
      <form onSubmit={handleCreateGroup}>   
        <div className="group">
         <input name="groupName" placeholder="Tên nhóm"/>
         <button type="submit">Tạo</button>     
        </div>
      </form>
    </div>
  )
}

export default CreateGroup
