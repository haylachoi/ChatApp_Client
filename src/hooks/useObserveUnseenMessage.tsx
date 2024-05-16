import { chatService } from '@/services/chatService';
import { useCurrentRoom } from '@/stores/roomStore';
import React, { useEffect } from 'react'

const useObserveUnseenMessage = (chatViewportRef: React.MutableRefObject<HTMLDivElement | null>, messagesRef: React.MutableRefObject<(HTMLDivElement | null)[]> ) => {
    const currentRoom = useCurrentRoom();
    useEffect(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const element = entry.target as HTMLElement;
              const id = element.dataset?.id;
              if (id !== undefined && entry.isIntersecting) {
                chatService
                  .updateIsReaded(id)
                  .then((result) => {
                    observer.unobserve(entry.target);
                  })
                  .catch();
              }
            });
          },
          {
            root: chatViewportRef.current, // viewport
            rootMargin: '0px', // no margin
            threshold: 0.5, // 50% of target visible
          },
        );
    
        messagesRef.current?.map((el) => {
          if (el) {
            observer.observe(el);
          }
        });
    
        // Clean up the observer
        return () => {
          messagesRef.current?.map((el) => {
            if (el) {
              observer.unobserve(el);
            }
          });
        };
      }, [currentRoom?.chats?.length]);
}

export default useObserveUnseenMessage
