import { videoCallService } from '@/services/videoCallService'
import { useCurrentPeer, useIsVideoCallAccept, useVideoCallActions } from '@/stores/videoCallStore'
import { useEffect } from 'react'

const useRejectVideoCallEvent = () => {
 const peer = useCurrentPeer();
 const isAccept = useIsVideoCallAccept();
 const {setIsMakingCall} = useVideoCallActions();
 useEffect(() => {
  const key = videoCallService.onRejectVideoCall.sub((peerId) => {
    if (peer.id === peerId && !isAccept) {
      setIsMakingCall(false);
    }
  })
  return () => {
    videoCallService.onRejectVideoCall.unsub(key);
  }
 },[peer])
}

export default useRejectVideoCallEvent
