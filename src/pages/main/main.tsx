import Sidebar from '@/components/sidebar/sidebar'
import { Reaction } from '@/libs/types'
import { chatService } from '@/services/chatService'
import { userService } from '@/services/userService'
import { useReactionsStore } from '@/stores/reactionStore'
import { LucideIcon, ThumbsDown, ThumbsUp } from 'lucide-react'
import React, { useEffect } from 'react'
import "./main.css";
import { useCurrentRoom, useRoomActions, useRoomChats } from '@/stores/roomStore'
import { useCurrentUser } from '@/stores/authStore'
import Chat from '@/components/chat/chat'
import AppModal from '@/components/app-modal/app-modal'
import useRoomMemberEvent from '@/hooks/useRoomMemberEvent'
import useSeenEvent from '@/hooks/useSeenEvent'
import useReactionEvent from '@/hooks/useReactionEvent'
import useUpdateLastMessageEvent from '@/hooks/useUpdateLastMessageEvent'
import useConnectedUserEvent from '@/hooks/useConnectedUserEvent'
import { chatHub, peer } from '@/services/hubConnection'
import CallVideo from '@/components/call-video/call-video'
import { useVideoCallActions } from '@/stores/videoCallStore'

const Main = () => {
  const currentUser = useCurrentUser();
  if (!currentUser ) return <></>;
  const currentRoom = useCurrentRoom();

  const {setStream}= useVideoCallActions();
  const { setReactions } = useReactionsStore();
  useRoomMemberEvent();
  useSeenEvent();
  useReactionEvent();
  useUpdateLastMessageEvent();
  useConnectedUserEvent();
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

  useEffect(() => {     
  
   
    const key = chatService.onCallVideo.sub(async (roomId: string, peerId: string) => {
    
      // const conn = peer.connect(peerId);
      // if (!conn) {return;}
      // console.log('start call video', conn)
      // conn.on('open', () => {
      //     conn.send('hi');
      //     conn.send('are you ok');
      // })

      var stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log('peerId', peerId)
      var call = peer.call(peerId, stream); 
      setStream(stream);
      // call.on('stream', (remoteStream) => {
      //   console.log("start permssion")
      //   // Show stream in some video/canvas element.
      //   setStream(remoteStream);
        
      // });
     
    });

    return () => {
      chatService.onCallVideo.unsub(key);
    }
    
  },[])

  return (
    <>
     <div className="side-bar">
      <Sidebar />
     </div>
     <CallVideo/>
     <div className="main-content">
     {currentRoom && <Chat />}
      {/* <Detail/> */}
     </div>
     <AppModal/>
    </>
  )
}

export default Main
