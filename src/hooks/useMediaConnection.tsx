import { useCurrentPeer, useHasIncommingCall, useCallerPeerId, useVideoCallActions } from '@/stores/videoCallStore';
import { MediaConnection } from 'peerjs';
import React, { useEffect, useState } from 'react'

const useMediaConnection = () => {
  const [localCall, setLocalCall] = useState<MediaConnection>();
  const [stream, setStream] = useState<MediaStream>();

  const peer = useCurrentPeer();
  const hasIncommingCall = useHasIncommingCall();
  const callerPeerId = useCallerPeerId();
  const {
    setIsAccept,
    setHasIncommingCall,
    setIsMakingCall,
    createCurrentPeer,
  } = useVideoCallActions();

  useEffect(() => {
    if (hasIncommingCall) {
      const videoElement: any = document.createElement('video');
      videoElement.src = '/video_test.mp4';
      videoElement.autoplay = true;
      videoElement.oncanplay = () => {
        if (!callerPeerId) return;
        const stream = videoElement.captureStream({ video: true, audio: true });
        // console.log('current peerId', peer.id);
        // console.log('caller peerId', callerPeerId);
        var call = peer.call(callerPeerId, stream);      
        setLocalCall(call);
        setStream(stream);
        call.on('close',() => {
          videoElement.pause();
        })
      };
    } else {
      peer.on('call', async (call) => {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });      
        call.answer(stream);
        setLocalCall(call);
        setStream(stream);
      });
    }
  }, []);

  useEffect(() => {
    if (localCall && stream) {
      localCall.on('close', () => {
        stream.getTracks().forEach((track) => track.stop());
        peer.destroy();
        setIsAccept(false);
        setHasIncommingCall(false);
        setIsMakingCall(false);
        createCurrentPeer();
      })
    }
  }, [localCall, stream])

  return localCall;
}

export default useMediaConnection
