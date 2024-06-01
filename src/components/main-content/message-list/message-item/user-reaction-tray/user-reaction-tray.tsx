import './user-reaction-tray.css';
import { MessageData, ReactionIdType, UserIdType } from '@/libs/types';
import React from 'react';
import { ReactionIcon } from '../reaction-icon/reaction-icon';
interface UserReactionTrayProps {
  message: MessageData;
}
const UserReactionTray: React.FC<UserReactionTrayProps> = ({ message }) => {
  const usersGroupByReactionId = message.messageDetails.reduce((acc, md) => {
    if (md.reactionId) {
      const pair = acc.find((pair) => pair.id === md.reactionId);
      if (pair) {
        pair.users.push(md.userId);
      } else {
        acc.push({ id: md.reactionId, users: [md.userId] });
      }
    }
    return acc;
  }, [] as { id: ReactionIdType; users: UserIdType[] }[]);
  return (
    <div className="reaction-tray fade-in">
      {usersGroupByReactionId.map((data) => (
        <ReactionIcon key={data.id} id={data.id} />
      ))}
    </div>
  );
};

export default UserReactionTray;
