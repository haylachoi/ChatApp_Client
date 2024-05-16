import { peer } from '@/services/hubConnection';
import { useVideoCallStream } from '@/stores/videoCallStore';
import React, { useEffect, useRef } from 'react';

const CallVideo = () => {
  const localVideoRef: React.LegacyRef<HTMLVideoElement> | undefined =
    useRef(null);
  const remoteVideoRef: React.LegacyRef<HTMLVideoElement> | undefined =
    useRef(null);

  const remoteStream1 = useVideoCallStream();
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (!localVideoRef.current || !remoteVideoRef.current) return;

        if (remoteStream1) {
          remoteVideoRef.current.srcObject = remoteStream1;
        }

        peer.on('call', (call) => {
          console.log('call');
          if (!localVideoRef.current || !remoteVideoRef.current) return;
          localVideoRef.current.srcObject = stream;
          
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            console.log('start stream');
            if (!remoteVideoRef.current) return;
            remoteVideoRef.current.srcObject = remoteStream;
          });
        });
      });

    //   peer.on('call', (call) => {
    //   // if (!localVideoRef.current || !remoteVideoRef.current) return;
    //   console.log('call');

    //   call.on('stream', (remoteStream) => {
    //     console.log('start stream');
    //     if (!remoteVideoRef.current) return;
    //     remoteVideoRef.current.srcObject = remoteStream;
    //   });

    //   call.on('error', (err) => console.log(err));
    //   if (remoteStream1) {
    //     localVideoRef.current!.srcObject = remoteStream1;
    //   }
    // });
    // peer.on('connection', function (conn) {
    //   conn.on('data', function (data) {
    //     // Will print 'hi!'
    //     console.log(data);
    //   });
    // });
  }, []);
  useEffect(() => {
    console.log('remotestream1', remoteStream1);
    if (remoteStream1) {
      localVideoRef.current!.srcObject = remoteStream1;
    }
  }, [remoteStream1]);
  return (
    <div className="call-video-area">
      <h1>PeerJS Video Call</h1>
      <div>
        <video ref={localVideoRef} autoPlay playsInline muted />
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>
      <div></div>
    </div>
  );
};

export default CallVideo;
