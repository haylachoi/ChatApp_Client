import { useEffect } from 'react';
import { User } from '@/libs/types';
import {
  useCurrentPeer,
  useHasIncommingCall,
  useCallerPeerId,
} from '@/stores/videoCallStore';

type UseMediaConnectionOptions = {
  onRemoteStream: (stream: MediaStream) => void;
  onError: () => void;
  caller?: User;
  receiver?: User;
};

const useMediaConnection = ({
  onRemoteStream,
  onError,
  caller,
  receiver,
}: UseMediaConnectionOptions) => {
  const peer = useCurrentPeer();
  const hasIncommingCall = useHasIncommingCall();
  const callerPeerId = useCallerPeerId();

  useEffect(() => {
    if (!peer) return;

    let localStream: MediaStream | null = null;
    const callHandlers: (() => void)[] = [];

    const stopLocalStream = () => {
      localStream?.getTracks().forEach((track) => track.stop());
      localStream = null;
    };

    const handleOutgoingCall = async () => {
      if (!callerPeerId) return;

      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        const call = peer.call(callerPeerId, localStream, {
          metadata: { caller, receiver },
        });

        if (!call) throw new Error('Failed to initiate call');

        call.on('stream', onRemoteStream);
        call.on('close', stopLocalStream);

        callHandlers.push(() => call.close());
      } catch (err) {
        console.error('[OutgoingCall Error]', err);
        stopLocalStream();
        onError();
      }
    };

    const handleIncomingCall = () => {
      const listener = async (call: any) => {
        try {
          localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          call.answer(localStream);
          call.on('stream', onRemoteStream);
          call.on('close', stopLocalStream);

          callHandlers.push(() => call.close());
        } catch (err) {
          console.error('[IncomingCall Error]', err);
          stopLocalStream();
          onError();
        }
      };

      peer.on('call', listener);
      callHandlers.push(() => peer.off('call', listener));
    };

    if (hasIncommingCall) {
      handleOutgoingCall();
    } else {
      handleIncomingCall();
    }

    return () => {
      stopLocalStream();
      callHandlers.forEach((dispose) => dispose());
    };
  }, []);
};

export default useMediaConnection;