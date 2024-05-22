import { videoCallService } from '@/services/videoCallService';
import { useVideoCallActions } from '@/stores/videoCallStore';
import  { useEffect } from 'react'
import useIsTabActive from './useIsTabActive';

const useCallVideoEvent = () => {
  const {setHasIncommingCall, setCaller, setCallerPeerId} = useVideoCallActions();
  const isTabActive = useIsTabActive();

  useEffect(() => {     
    const key = videoCallService.onCallVideo.sub(async (roomId, peerId, caller) => {
      console.log('incomming call', peerId)
      setHasIncommingCall(true);
      setCaller(caller);
      setCallerPeerId(peerId);
      console.log('is tab', isTabActive)
      if (!isTabActive) {
        Notification.requestPermission().then((per) => {
          if (per === 'granted') {
            var notification = new Notification('Thông báo', {
              body: `Bạn có cuộc gọi đến từ ${caller.fullname}`,
              icon: 'icon.jpg',
            })
          }
        }) 
      }
    });

    return () => {
      videoCallService.onCallVideo.unsub(key);
    }
    
  },[isTabActive])
}

export default useCallVideoEvent
