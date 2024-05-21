import Sidebar from '@/components/sidebar/sidebar'
import { Reaction } from '@/libs/types'
import { userService } from '@/services/userService'
import { useReactionsStore } from '@/stores/reactionStore'
import { LucideIcon, ThumbsDown, ThumbsUp } from 'lucide-react'
import React, { useEffect } from 'react'
import "./main.css";
import { useCurrentRoom } from '@/stores/roomStore'
import { useCurrentUser } from '@/stores/authStore'
import Chat from '@/components/chat/chat'
import AppModal from '@/components/app-modal/app-modal'
import useRoomMemberEvent from '@/hooks/useRoomMemberEvent'
import useSeenEvent from '@/hooks/useSeenEvent'
import useReactionEvent from '@/hooks/useReactionEvent'
import useUpdateLastMessageEvent from '@/hooks/useUpdateLastMessageEvent'
import CallVideo from '@/components/call-video/call-video'
import { useHasIncommingCall, useIsMakingCall, useIsVideoCallAccept } from '@/stores/videoCallStore'
import IncommingCallAlert from '@/components/incomming-call-alert/incomming-call-alert'
import CallAlert from '@/components/call-alert/call-alert'
import useVideoCallAcceptEvent from '@/hooks/useVideoCallAcceptEvent'

import useRejectVideoCallEvent from '@/hooks/useRejectVideoCallEvent'
import useCancelVideoCall from '@/hooks/useCancelVideoCall'
import useCallVideoEvent from '@/hooks/useCallVideoEvent'
import AlertModal from '@/components/ui/alert-modal/alert-modal'
import useDeleteGroupEvent from '@/hooks/useDeleteGroupEvent'
import useJoinRoomEvent from '@/hooks/useJoinRoomEvent'
import useLeftRoomEvent from '@/hooks/useLeftRoomEvent'

const Main = () => {
  const currentUser = useCurrentUser();
  if (!currentUser ) return <></>;
  const currentRoom = useCurrentRoom();
  const hasIncommingCall = useHasIncommingCall();
  const isMakingCall = useIsMakingCall();

  const isVideoCallAccept = useIsVideoCallAccept();
  
  const { setReactions } = useReactionsStore();
  useVideoCallAcceptEvent();
  useRoomMemberEvent();
  useSeenEvent();
  useReactionEvent();
  useUpdateLastMessageEvent();
  useDeleteGroupEvent();
  useJoinRoomEvent();
  useLeftRoomEvent();
  // useConnectedUserEvent();

  useCallVideoEvent();
  useRejectVideoCallEvent();
  useCancelVideoCall();
  const reactionIconMapping = {
    Like: ThumbsUp,
    Hate: ThumbsDown
  }
  useEffect(() => {
    userService
      .getReactions()
      .then((result) => {
        const map = new Map<string,Reaction>();
        result.data.forEach((reaction: Reaction) => {       
          reaction.icon = reactionIconMapping[reaction.name as keyof {Like: LucideIcon, Hate: LucideIcon}];
          map.set(reaction.id, reaction);
        });
        setReactions(map);
      })
      .catch((error) => {})

  }, [])

 
 
  return (
    <>
     <div className="side-bar">
      <Sidebar />
     </div>
     {/* <CallVideo/> */}
     <div className="main-content">
     {currentRoom && <Chat />}
      {/* <Detail/> */}
     </div>
     <AppModal/>
     <AlertModal/>
     {hasIncommingCall && !isVideoCallAccept && <IncommingCallAlert/>}
     {isVideoCallAccept && <CallVideo/>}
    
     {isMakingCall && !isVideoCallAccept && <CallAlert/>}
    </>
  )
}

export default Main
