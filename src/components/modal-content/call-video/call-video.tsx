import {
  useHasIncommingCall,
  useVideoCaller,
  useVideoReceiver,
} from '@/stores/videoCallStore';
import React, { useEffect, useRef } from 'react';
import './call-video.css';
import useMediaConnection from '@/hooks/useMediaConnection';
import { PhoneMissed } from 'lucide-react';

const CallVideo = () => {
  const remoteVideoRef: React.LegacyRef<HTMLVideoElement> | undefined =
    useRef(null);

  const hasIncommingCall = useHasIncommingCall();
  const call = useMediaConnection();

  const caller = useVideoCaller();
  const receiver = useVideoReceiver();

  const handleEndCall = () => {
    if (call) {
      call.close();
    }
  };

  useEffect(() => {
    if (!call) return;

    call.on('stream', (remoteStream) => {
      if (!remoteVideoRef.current) return;
      remoteVideoRef.current.srcObject = remoteStream;
    });
  }, [call]);

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
