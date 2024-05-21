import { useVideoCaller, useVideoCallActions, useCallerPeerId, useCurrentPeer } from '@/stores/videoCallStore';
import React, { useEffect } from 'react';
import './incomming-call-alert.css';
import { videoCallService } from '@/services/videoCallService';


interface IncommingCallAlertProps {}
const IncommingCallAlert: React.FC<IncommingCallAlertProps> = () => {
  const caller = useVideoCaller();
  const { setHasIncommingCall, setIsAccept} = useVideoCallActions();
  const callerPeerId = useCallerPeerId();

  const handleAccept = async () => {
    if (!caller || !callerPeerId) return;
    videoCallService.acceptVideoCall(caller.id, callerPeerId);
    setIsAccept(true);
  
  };
  const handleReject = () => {
    if (!caller || !callerPeerId) return;
    videoCallService.rejectVideoCall(caller.id, callerPeerId);
    setHasIncommingCall(false);
  };

  useEffect(() => {
    var key = setTimeout(() => {
      handleReject();
    }, 60000);

    return () => {
      clearTimeout(key);
    }
  }, [caller, callerPeerId])
  return (
    <div className="call-notification">
      <p>Bạn có một cuộc gọi đến từ {caller?.fullname}</p>
      <div className="space-x-2">
        <button className='btn-none text-green' onClick={handleAccept}>Nghe</button>
        <button className='btn-none text-orange' onClick={handleReject}>Không nghe</button>
      </div>
    </div>
  );
};

export default IncommingCallAlert;
