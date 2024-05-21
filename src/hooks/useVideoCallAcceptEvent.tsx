import { videoCallService } from '@/services/videoCallService';
import { useVideoCallActions } from '@/stores/videoCallStore'
import React, { useEffect } from 'react'

const useVideoCallAcceptEvent = () => {
 const {setIsAccept, setIsMakingCall, setHasIncommingCall} = useVideoCallActions();
 useEffect(() => {
  const key = videoCallService.onAcceptVideoCall.sub((peerId) => {
    console.log('accept')
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
