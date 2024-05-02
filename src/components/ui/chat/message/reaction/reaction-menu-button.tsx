import { Reaction, Message } from '@/libs/types'
import { chatService } from '@/services/chatService';
import { useReactionsStore } from '@/stores/reactionStore';
import React from 'react';
import "./reaction-menu-button.css";
import { useUserStore } from '@/stores/userStore';
import { ReactionIcon } from '../reaction-icon/reaction-icon';

const ReactionMenuButton = ({ message }: { message: Message }) => {
    const {reactions} = useReactionsStore();
    const { currentUser} = useUserStore();
    const reactionArray: Reaction[] = [];
    reactions.forEach((reaction) => reactionArray.push(reaction));
    const firstReactionId =  reactions.entries().next().value[1].id;
    
    const handleSendReaction = (message: Message, reactionId: number) => {
      chatService.updateReactionMessage(message.id, message.reactionId == reactionId ? null : reactionId);
    }
  return (
    <div className={`reaction-menu-bar-btn ${!!message.reactionId ? 'reaction-show' : ''}`}>
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

