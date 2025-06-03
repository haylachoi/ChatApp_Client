import {
  useVideoCaller,
  useVideoReceiver,
  useHasIncommingCall,
  useVideoCallActions,
  useCurrentPeer,
} from '@/stores/videoCallStore';
import React, { useRef } from 'react';
import { PhoneMissed } from 'lucide-react';
import './call-video.css';
import useMediaConnection from '@/hooks/useMediaConnection';
import { videoCallService } from '@/services/videoCallService';

const CallVideo = () => {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const caller = useVideoCaller();
  const receiver = useVideoReceiver();
  const hasIncommingCall = useHasIncommingCall();
  const peer = useCurrentPeer();
  const {
    setIsAccept,
    setHasIncommingCall,
    setIsMakingCall,
    createCurrentPeer,
  } = useVideoCallActions();
  
  const onError= () => {
    const target = hasIncommingCall ? caller : receiver;
    if (target) {
      videoCallService.finishVideoCall(target.id, peer.id);
    }
    setIsAccept(false);
    setHasIncommingCall(false);
    setIsMakingCall(false);
    peer.destroy();
    createCurrentPeer();
  }

   useMediaConnection({
    onRemoteStream: (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    },
    onError,
    caller,
    receiver
  });

  const handleEndCall = () => {
    onError();
  };

  return (
    <div className="call-video-area bg-darker">
      <h1 className="title">
        {hasIncommingCall ? caller?.fullname : receiver?.fullname}
      </h1>
      <video
        className="remote-video"
        ref={remoteVideoRef}
        autoPlay
        playsInline
        controls
      />
      <button className="end-btn btn-none" onClick={handleEndCall}>
        <PhoneMissed className="end-btn-icon" />
      </button>
    </div>
  );
};

export default CallVideo;
