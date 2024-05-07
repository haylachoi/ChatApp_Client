import { Reaction, MessageData } from '@/libs/types'
import { chatService } from '@/services/chatService';
import { useReactionsStore } from '@/stores/reactionStore';
import React from 'react';
import "./reaction-menu-button.css";
import { ReactionIcon } from '../reaction-icon/reaction-icon';
import { useCurrentUser } from '@/stores/userStore';

const ReactionMenuButton = ({ message }: { message: MessageData }) => {
    const currentUser = useCurrentUser();
    if (!currentUser) return <></>;

    const {reactions} = useReactionsStore();

    const reactionArray: Reaction[] = [];
    reactions.forEach((reaction) => reactionArray.push(reaction));
    const firstReactionId =  reactions.entries().next().value[1].id;
    const currentMessageDetail = message.messageDetails.find(md => md.userId === currentUser?.id);
    
    const handleSendReaction = (message: MessageData, reactionId: string | undefined) => {
      if (currentMessageDetail && currentMessageDetail.reactionId === reactionId){
        reactionId = undefined;
      }
      chatService.updateReactionMessage(message.id, reactionId);
    }
  return (
    <div className={`reaction-menu-bar-btn ${!!currentMessageDetail?.reactionId ? 'reaction-show' : ''}`}>
       <button onClick={() => handleSendReaction(message, firstReactionId)}>
        <ReactionIcon id={undefined}/>
       </button>
      <div className="reaction-system-bar">
        {reactionArray.map(({ id, icon: Icon }) => (
          <button key={id} onClick={() => handleSendReaction(message, id)}>
            <Icon className="reaction-btn-icon" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ReactionMenuButton

