import React, { useEffect } from 'react';
import './call-alert.css';
import { videoCallService } from '@/services/videoCallService';
import {
  useCurrentPeer,
  useVideoCallActions,
  useVideoReceiver,
} from '@/stores/videoCallStore';
import { PhoneOff, PhoneOutgoing } from 'lucide-react';

const CallAlert = () => {
  const receiver = useVideoReceiver();
  const peer = useCurrentPeer();
  const { setIsMakingCall } = useVideoCallActions();

  const handleCancel = () => {
    if (!receiver) return;
    videoCallService.cancelVideoCall(receiver.id, peer.id);
    setIsMakingCall(false);
  };

  useEffect(() => {
    const key = setTimeout(() => {
      handleCancel();
    }, 60000);

    return () => {
      clearTimeout(key);
    };
  }, [receiver, peer]);

  return (
    <div className="call-alert bg-darker">
      <p className="title">Đang gọi cho {receiver?.fullname}</p>
      <p className="phone-call-icon-wrapper">
        <PhoneOutgoing className="phone-call-icon ping" />
      </p>
      <button className="btn-none phone-cancel-btn" onClick={handleCancel}>
        <PhoneOff className="phone-cancel-icon" />
      </button>
    </div>
  );
};

export default CallAlert;
