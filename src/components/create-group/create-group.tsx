import React from 'react'
import "./create-group.css"
import { groupService } from '@/services/groupService';
import { useCurrentUser } from '@/stores/authStore';
import { Profile } from '@/libs/types';

interface FormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement
}
interface GroupFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

const CreateGroup = () => {
    const currentUser = useCurrentUser() as Profile;
    
    const handleCreateGroup: React.FormEventHandler<GroupFormElement> | undefined = (e) => {
        e.preventDefault();      
        // const element = e.currentTarget;
        // const formData = new FormData(element);
        // formData.append('groupOwnerId', currentUser.id);
        const name = e.currentTarget.elements.name.value;
        groupService.createGroup(name, currentUser.id).then((result) => {

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
