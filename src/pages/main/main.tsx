import Sidebar from '@/components/sidebar/sidebar';
import { Reaction, ReactionIdType } from '@/libs/types';
import { userService } from '@/services/userService';
import { useReactionsStore } from '@/stores/reactionStore';
import { Heart, LucideIcon, ThumbsDown, ThumbsUp } from 'lucide-react';
import React, { useEffect } from 'react';
import './main.css';

import Chat from '@/components/chat/chat';
import AppModal from '@/components/app-modal/app-modal';
import useRoomMemberEvent from '@/hooks/useRoomMemberEvent';
import useReactionEvent from '@/hooks/useReactionEvent';
import CallVideo from '@/components/call-video/call-video';
import {
  useHasIncommingCall,
  useIsMakingCall,
  useIsVideoCallAccept,
} from '@/stores/videoCallStore';
import IncommingCallAlert from '@/components/incomming-call-alert/incomming-call-alert';
import CallAlert from '@/components/call-alert/call-alert';
import useVideoCallAcceptEvent from '@/hooks/useVideoCallAcceptEvent';
import useRejectVideoCallEvent from '@/hooks/useRejectVideoCallEvent';
import useCancelVideoCall from '@/hooks/useCancelVideoCall';
import useCallVideoEvent from '@/hooks/useCallVideoEvent';
import AlertModal from '@/components/ui/alert-modal/alert-modal';
import useDeleteGroupEvent from '@/hooks/useDeleteGroupEvent';
import useJoinRoomEvent from '@/hooks/useJoinRoomEvent';
import useLeftRoomEvent from '@/hooks/useLeftRoomEvent';
import { useCurrentRoomId } from '@/stores/roomStore';
import useUpdateFirstUnseenMessageEvent from '@/hooks/useUpdateFirstUnseenMessageEvent';
import useReceiveMessageEvent from '@/hooks/useReceiveMessageEvent';
import useChangeGroupOwnerEvent from '@/hooks/useChangeGroupOwnerEvent';
import useDeleteMessageDetailEvent from '@/hooks/useDeleteMessageDetailEvent';

const Main = () => {
  const currentRoomId = useCurrentRoomId();
  const hasIncommingCall = useHasIncommingCall();
  const isMakingCall = useIsMakingCall();
  const isVideoCallAccept = useIsVideoCallAccept();
  const { setReactions } = useReactionsStore();
  useVideoCallAcceptEvent();
  useRoomMemberEvent();
  useReactionEvent();
  useReceiveMessageEvent();
  useUpdateFirstUnseenMessageEvent();
  useDeleteGroupEvent();
  useJoinRoomEvent();
  useLeftRoomEvent();
  useChangeGroupOwnerEvent();
  useDeleteMessageDetailEvent();
  // useConnectedUserEvent();

  useCallVideoEvent();
  useRejectVideoCallEvent();
  useCancelVideoCall();
  const reactionIconMapping = {
    Heart: Heart,
    Like: ThumbsUp,
    Hate: ThumbsDown,
  };
  useEffect(() => {
    userService
      .getReactions()
      .then((result) => {
        const map = new Map<ReactionIdType, Reaction>();
        result.data.forEach((reaction: Reaction) => {
          reaction.icon =
            reactionIconMapping[
              reaction.name as keyof { Like: LucideIcon; Hate: LucideIcon, Heart: LucideIcon }
            ];
          map.set(reaction.id, reaction);
        });
        setReactions({ reactionMap: map, reactionArray: result.data });
      })
      .catch((error) => {});
  }, []);

  return (
    <>
      <div className="side-bar">
        <Sidebar />
      </div>
      <div className="main-content">
        {currentRoomId && <Chat/>}

        {/* <Detail/> */}
      </div>
      <AppModal />
      <AlertModal />
      {hasIncommingCall && !isVideoCallAccept && <IncommingCallAlert />}
      {isVideoCallAccept && <CallVideo />}

      {isMakingCall && !isVideoCallAccept && <CallAlert />}
    </>
  );
};

export default Main;