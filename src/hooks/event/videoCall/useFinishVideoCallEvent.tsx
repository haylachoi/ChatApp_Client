import { videoCallService } from '@/services/videoCallService';
import {
  useCallerPeerId,
  useCurrentPeer,
  useVideoCallActions,
} from '@/stores/videoCallStore';
import { useEffect } from 'react';

const useFinishVideoCallEvent = () => {
  const callerPeerId = useCallerPeerId();
  const peer = useCurrentPeer();
  const {
    setHasIncommingCall,
    setIsAccept,
    setIsMakingCall,
    createCurrentPeer,
  } = useVideoCallActions();

  useEffect(() => {
    const key = videoCallService.onFinishVideoCall.sub((peerId) => {
        setHasIncommingCall(false);
        setIsAccept(false);
        setIsMakingCall(false);
        peer.destroy();
        createCurrentPeer();
    });

    return () => {
      videoCallService.onFinishVideoCall.unsub(key);
    };
  }, [callerPeerId]);
};

export default useFinishVideoCallEvent;
