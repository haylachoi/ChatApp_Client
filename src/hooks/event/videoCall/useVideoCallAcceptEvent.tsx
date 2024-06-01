import { videoCallService } from '@/services/videoCallService';
import { useVideoCallActions } from '@/stores/videoCallStore'
import { useEffect } from 'react'

const useVideoCallAcceptEvent = () => {
 const {setIsAccept, setIsMakingCall, setHasIncommingCall} = useVideoCallActions();
 useEffect(() => {
  const key = videoCallService.onAcceptVideoCall.sub((peerId) => { 
    setIsAccept(true);
    setIsMakingCall(false);
    setHasIncommingCall(false);
  })

  return () => {
    videoCallService.onAcceptVideoCall.unsub(key);
  }
 },[])
}

export default useVideoCallAcceptEvent
