import {
  ReactionIdType,
  Profile,
  MessageDetail,
  MessageIdType,
} from '@/libs/types';
import { chatService } from '@/services/chatService';
import { useReactionsStore } from '@/stores/reactionStore';
import React, { FC } from 'react';
import './reaction-menu-button.css';
import { useCurrentUser } from '@/stores/authStore';
import { ReactionIcon } from '../reaction-icon/reaction-icon';

interface ReactionMenuButtonProps {
  messageId: MessageIdType;
  messageDetails: MessageDetail[];
}
const ReactionMenuButton: FC<ReactionMenuButtonProps> = ({
  messageId,
  messageDetails,
}) => {
  const currentUser = useCurrentUser() as Profile;
  const { reactionArray } = useReactionsStore((state) => state.reactions);

  const firstReactionId =
    reactionArray.length > 0 ? reactionArray[0].id : undefined;

  const currentMessageDetail = messageDetails.find(
    (md) => md.userId === currentUser.id,
  );

  const handleSendReaction = (
    messageId: MessageIdType,
    reactionId: ReactionIdType | undefined,
  ) => {
    if (currentMessageDetail && currentMessageDetail.reactionId == reactionId) {
      reactionId = undefined;
    }
    chatService.updateReactionMessage(messageId, reactionId);
  };
  return (
    <div
      className={`reaction-menu-bar-btn ${
        !!currentMessageDetail?.reactionId ? 'reaction-show' : ''
      }`}>
      <button onClick={() => handleSendReaction(messageId, firstReactionId)}>
        <ReactionIcon id={undefined} />
      </button>
      <div className="reaction-system-bar">
        {reactionArray.map(({ id, icon: Icon }) => (
          <button key={id} onClick={() => handleSendReaction(messageId, id)}>
            <Icon className="reaction-btn-icon" />
          </button>
        ))}
      </div>
    </div>
  );
};

// export default React.memo(ReactionMenuButton);
export default ReactionMenuButton;
