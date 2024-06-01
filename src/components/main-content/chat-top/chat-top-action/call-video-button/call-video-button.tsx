import { RoomIdType, RoomMemberInfo } from '@/libs/types';
import { videoCallService } from '@/services/videoCallService';
import { useRoomStore } from '@/stores/roomStore';
import { useCurrentPeer, useVideoCallActions } from '@/stores/videoCallStore';
import React from 'react';

const CallVideoButton = () => {
  const currentRoom = useRoomStore(({ currentRoom: room }) => ({
    id: room?.id as RoomIdType,
    isGroup: room?.isGroup,
    otherMembers: room?.otherRoomMemberInfos as RoomMemberInfo[],
  }));
  const { otherMembers } = currentRoom;

  const peer = useCurrentPeer();
  const { setIsMakingCall, setReceiver } = useVideoCallActions();

  const handleCallVideo = async () => {
    const receiverId = otherMembers[0]?.user.id;
    // const peer = createCurrentPeer();

    console.log('current peerId', peer.id);
    const result = await videoCallService.callVideo(
      currentRoom.id,
      receiverId,
      peer.id,
    );
    setReceiver(otherMembers[0].user);
    setIsMakingCall(true);
  };

  return (
    <button className="btn-none" onClick={handleCallVideo}>
      <img className="size-m" src="./phone.png" alt="" />
    </button>
  );
};

export default CallVideoButton;
