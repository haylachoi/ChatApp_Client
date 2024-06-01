import Sidebar from '@/components/sidebar/sidebar';
import { Reaction, ReactionIdType } from '@/libs/types';
import { userService } from '@/services/userService';
import { useReactionsStore } from '@/stores/reactionStore';
import { Heart, LucideIcon, ThumbsDown, ThumbsUp } from 'lucide-react';
import React, { useEffect } from 'react';
import './main.css';

import AppModal from '@/components/app-modal/app-modal';
import useRoomMemberEvent from '@/hooks/event/room/useRoomMemberEvent';
import CallVideo from '@/components/modal-content/call-video/call-video';
import {
  useHasIncommingCall,
  useIsMakingCall,
  useIsVideoCallAccept,
} from '@/stores/videoCallStore';
import IncommingCallAlert from '@/components/modal-content/incomming-call-alert/incomming-call-alert';
import CallAlert from '@/components/modal-content/call-alert/call-alert';
import useVideoCallAcceptEvent from '@/hooks/event/videoCall/useVideoCallAcceptEvent';
import useRejectVideoCallEvent from '@/hooks/event/videoCall/useRejectVideoCallEvent';
import useCancelVideoCallEvent from '@/hooks/event/videoCall/useCancelVideoCallEvent';
import AlertModal from '@/components/ui/alert-modal/alert-modal';
import useDeleteGroupEvent from '@/hooks/event/room/useDeleteGroupEvent';
import useJoinRoomEvent from '@/hooks/event/room/useJoinRoomEvent';
import useLeftRoomEvent from '@/hooks/event/room/useLeftRoomEvent';
import { useCurrentRoomId } from '@/stores/roomStore';
import useUpdateFirstUnseenMessageEvent from '@/hooks/event/chat/useUpdateFirstUnseenMessageEvent';
import useReceiveMessageEvent from '@/hooks/event/chat/useReceiveMessageEvent';
import useChangeGroupOwnerEvent from '@/hooks/event/room/useChangeGroupOwnerEvent';
import useDeleteMessageDetailEvent from '@/hooks/event/chat/useDeleteMessageDetailEvent';
import MainContent from '@/components/main-content/main-content';
import useCallVideoEvent from '@/hooks/event/videoCall/useCallVideoEvent';
import useReactionEvent from '@/hooks/event/chat/useReactionEvent';

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
  useCancelVideoCallEvent();
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
      <div className="main-content-area">
        {currentRoomId && <MainContent/>}
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