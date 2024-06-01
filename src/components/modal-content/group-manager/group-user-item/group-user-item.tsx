import './group-user-item.css';
import { User, UserIdType } from '@/libs/types';
import { groupService } from '@/services/groupService';
import { useCurrentRoomId } from '@/stores/roomStore';
import { LoaderCircle } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import { toast } from 'react-toastify';

interface GroupUserItemprops {
  user: User;
  isCurrentUserOwnGroup: boolean;
}
const GroupUserItem: React.FC<GroupUserItemprops> = ({
  user,
  isCurrentUserOwnGroup,
}) => {
  const [isKicking, setIsKicking] = useState(false);
  const currentRoomId = useCurrentRoomId() as number;
  const handleSetGroupOwner = (userId: UserIdType) => {
    groupService
      .changeGroupOnwer(currentRoomId, userId)
      .then((result) => {})
      .catch((error) => {});
  };
  const handleKick = async (id: UserIdType) => {
    try {
      setIsKicking(true);
      const result = await groupService.removeGroupMember(currentRoomId, id);
      if (result.isSuccess) {
        toast.done('Kích thành viên thành công')
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsKicking(false);
      console.log(isKicking)
    }
  };
  return (
    <div className="group-user-item">
      <div className="detail">
        <img src={user.avatar || './avatar.png'} alt="" />
        <span>{user.fullname}</span>
      </div>
      {isCurrentUserOwnGroup && (
        <div className="group-btn">
          <button
            className="left-btn"
            onClick={() => handleSetGroupOwner(user.id)}>
            Chủ Nhóm
          </button>
          <button
            className="right-btn"
            disabled={isKicking}
            onClick={() => handleKick(user.id)}>
            {isKicking ? <LoaderCircle size={16} className="spinner" /> : "Đuổi"}
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupUserItem;
