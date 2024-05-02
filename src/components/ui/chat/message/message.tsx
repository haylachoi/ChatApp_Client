import { useRoomStore } from '@/stores/roomStore'
import { useUserStore } from '@/stores/userStore'
import React from 'react'
import { format } from 'timeago.js'
import './message.css'
import { useReactionsStore } from '@/stores/reactionStore'
import { Reaction, Message as IMessage } from '@/libs/types'
import { chatService } from '@/services/chatService'
import ReactionMenuButton from './reaction/reaction-menu-button'
import { ReactionIcon } from './reaction-icon/reaction-icon'

interface MessageProps {
  index: number
  message: IMessage
  messagesRef: React.MutableRefObject<(HTMLDivElement | null)[]>
  lastMessageRef: React.MutableRefObject<HTMLDivElement | null>
  firstUnseenMessageRef: React.MutableRefObject<HTMLDivElement | null>
}
const Message: React.FC<MessageProps> = ({
  index,
  message,
  messagesRef,
  firstUnseenMessageRef,
  lastMessageRef,
}) => {
  const { currentRoom } = useRoomStore()
  const { currentUser } = useUserStore()
  const { reactions } = useReactionsStore()
  const reactionArray: Reaction[] = []
  reactions.forEach((reaction) => reactionArray.push(reaction))

  const handleSendReaction = (message: IMessage, reactionId: number) => {
    chatService.updateReactionMessage(
      message.id,
      message.reactionId == reactionId ? null : reactionId,
    )
  }
  return (
    <div
      id={`private_message_${message.id}`}
      // ref={index == currentRoom.chats.length -1 ? lastMessageRef : null}
      ref={(el) => {
        if (
          !message.isReaded &&
          message.senderId !== currentUser?.id &&
          !messagesRef.current.find((e) => e?.dataset.id == message.id)
        ) {
          messagesRef.current.push(el)
        }
        if (message.id == currentRoom?.firstUnseenMessageId) {
          firstUnseenMessageRef.current = el
        }

        if (currentRoom?.chats && index == currentRoom?.chats?.length - 1)
          lastMessageRef.current = el
      }}
      data-id={message.id}
      className={
        message.senderId === currentUser?.id ? 'message-box own' : 'message-box'
      }
      key={message?.id}>
     
        <div className="message-content">
          {message.isImage && <img src={message.content} alt="" />}
          <p>
            {message.content} {message.id}
          </p>
        </div>
        {message.reactionId && (
          <div className="reaction-tray">
            <ReactionIcon id={message.reactionId} />
          </div>
        )}
        {currentUser && message.senderId != currentUser.id && (
          <div className="reaction-menu">
            <ReactionMenuButton message={message} />
          </div>
        )}
        <div className="message-status">
          <span>{message.isReaded ? 'Đã xem' : 'Chưa xem'}</span>
          <span>{format(new Date(message.createdAt!))}</span>
        </div>
     
    </div>
  )
}

export default Message



