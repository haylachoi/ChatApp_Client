import { videoCallService } from '@/services/videoCallService'
import { useCallerPeerId, useVideoCallActions } from '@/stores/videoCallStore'
import React, { useEffect } from 'react'

const useCancelVideoCall = () => {
 const callerPeerId = useCallerPeerId();
  const {setHasIncommingCall} = useVideoCallActions();

 useEffect(() => {
  const key = videoCallService.onCancelVideoCall.sub((peerId) => {
    console.log(peerId)
    console.log(callerPeerId)
    if (callerPeerId === peerId) {
      setHasIncommingCall(false);
    }
  })

  return () => {
    videoCallService.onCancelVideoCall.unsub(key);
  }

 }, [callerPeerId])
}

export default useCancelVideoCall
