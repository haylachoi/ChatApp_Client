import './message-content.css';
import MessageQuote from '@/components/message-quote/message-quote'
import { MessageData, RoomMemberInfo, User } from '@/libs/types'
import { useQuoteStore } from '@/stores/quoteStore';
import { useIsCurrentRoomGroup, useRoomStore } from '@/stores/roomStore';
import React, { useMemo } from 'react'

interface MessageContentProps {
  message: MessageData,
  // isGroup:boolean,
  // messageOwner: User | undefined,
}
const MessageContent: React.FC<MessageContentProps> = ({message}) => {
  const isGroup = useIsCurrentRoomGroup() as boolean;
  const otherMembers = useRoomStore(
    (state) => state.currentRoom?.otherRoomMemberInfos,
  ) as RoomMemberInfo[];

  const messageOwner = useMemo(
    () => otherMembers.find((info) => info.user.id === message.senderId)?.user,
    [message.senderId],
  );
  return (
    <div className="message-content">
    {isGroup && (
      <p
        className="message-owner"
        style={
          {
            '--name-color': messageOwner?.fullname.toHSL(),
          } as React.CSSProperties
        }>
        {messageOwner?.fullname}
      </p>
    )}
    {message.isImage && <img src={message.content} alt="" />}
    {!message.isImage && (           
      <>
        {message.quote && (
          <MessageQuote quote={message.quote}/>
        )}
        <pre>
          {message.content} {message.id}
        </pre>
      </>
    )}
  </div>
  )
}

export default MessageContent
