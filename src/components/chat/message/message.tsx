import React from 'react';
import { format } from 'timeago.js';
import './message.css';
import { useReactionsStore } from '@/stores/reactionStore';
import { Reaction, MessageData, User, Profile } from '@/libs/types';
import ReactionMenuButton from './reaction/reaction-menu-button';
import { ReactionIcon } from './reaction-icon/reaction-icon';
import { useCurrentUser } from '@/stores/authStore';
import { RoomMemberDetail, useCurrentChats, useCurrentRoomInfo, useCurrentRoomMembers, useIsCurrentRoomGroup } from '@/stores/roomStore';

interface MessageProps {
  index: number;
  message: MessageData;
  messagesRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
  lastMessageRef: React.MutableRefObject<HTMLDivElement | null>;
  lastSeenMessageRef: React.MutableRefObject<HTMLDivElement | null>;
}

const Message: React.FC<MessageProps> = ({
  index,
  message,
  messagesRef,
  lastSeenMessageRef,
  lastMessageRef,
}) => {
  const {currentMember, otherMembers} = useCurrentRoomMembers() as RoomMemberDetail;
  const currentUser = useCurrentUser() as Profile;
  const currentChats = useCurrentChats() as MessageData[];
  const isGroup = useIsCurrentRoomGroup() as boolean;

  const { reactions } = useReactionsStore();
  const reactionArray: Reaction[] = [];
  reactions.forEach((reaction) => reactionArray.push(reaction));

  const messageOwner = otherMembers.find(
    (info) => info.user.id === message.senderId,
  )?.user;
  const initReactionData: { id: string; users: string[] }[] = [];
  const messageReactionData = message.messageDetails.reduce((acc, md) => {
    if (md.reactionId) {
      const pair = acc.find((pair) => pair.id === md.reactionId);
      if (pair) {
        pair.users.push(md.userId);
      } else {
        acc.push({ id: md.reactionId, users: [md.userId] });
      }
    }
    return acc;
  }, initReactionData);

  const handleRef: React.LegacyRef<HTMLDivElement> | undefined = (el) => {
    if (
      !message.messageDetails.find((md) => md.userId == currentUser.id) &&
      message.senderId !== currentUser?.id &&
      !messagesRef.current.find((e) => e?.dataset.id == message.id)
    ) {
      messagesRef.current.push(el);
    }
    if (message.id ==currentMember.lastSeenMessageId) {
      lastSeenMessageRef.current = el;
    }

    if (currentChats && index == currentChats?.length - 1)
      lastMessageRef.current = el;
  };
  return (
    <div
      id={`private_message_${message.id}`}
      ref={handleRef}
      data-id={message.id}
      className={
        message.senderId === currentUser?.id ? 'message-box own' : 'message-box'
      }
      key={message?.id}>
      {messageOwner && (
        <img
          className="message-avatar"
          src={messageOwner.avatar ?? '/avatar.png'}
        />
      )}
      <div className="message-wrapper">
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
            <p>
              {message.content} {message.id}
            </p>
          )}
        </div>
        {messageReactionData.length > 0 && (
          <div className="reaction-tray">
            {messageReactionData.map((data) => (
              <ReactionIcon key={data.id} id={data.id} />
            ))}
          </div>
        )}
        {currentUser && message.senderId != currentUser.id && (
          <div className="reaction-menu">
            <ReactionMenuButton message={message} />
          </div>
        )}
        <div className="message-status">
          {/* <span>{message.isReaded ? 'Đã xem' : 'Chưa xem'}</span> */}
          <span>{format(new Date(message.createdAt!))}</span>
        </div>
      </div>
    </div>
  );
};

export default Message;
