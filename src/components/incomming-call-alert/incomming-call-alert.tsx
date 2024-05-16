import { peer } from '@/services/hubConnection';
import { useVideoCallActions } from '@/stores/videoCallStore';
import React from 'react';

interface IncommingCallAlertProps {}
const IncommingCallAlert: React.FC<IncommingCallAlertProps> = () => {
  const { setIsAlertShow, setIsAccept, setStream } = useVideoCallActions();

  const handleAccept = async () => {
    var stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    var call = peer.call('another-peers-id', stream);
    call.on('stream', (remoteStream) =>{
      // Show stream in some video/canvas element.
      setStream(remoteStream);
    });
    setIsAccept(true);
    setIsAlertShow(false);
  };
  const handleReject = () => {
    setIsAlertShow(false);
  };
  return (
    <div className="call-notification">
      <p>Bạn có một cuộc gọi đến</p>
      <button onClick={handleAccept}>Nghe</button>
      <button onClick={handleReject}>Không nghe</button>
    </div>
  );
};

export default IncommingCallAlert;
