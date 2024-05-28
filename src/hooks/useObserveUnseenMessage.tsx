import { chatService } from '@/services/chatService';
import { roomService } from '@/services/roomService';
import { useCurrentChats } from '@/stores/roomStore';
import React, { useEffect } from 'react';

const useObserveUnseenMessage = (
  chatViewportRef: React.MutableRefObject<HTMLDivElement | null>,
  messagesRef: React.MutableRefObject<(HTMLDivElement | null)[]>,
) => {
  const currentChats = useCurrentChats();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          const id = element.dataset?.id;
          if (id !== undefined && entry.isIntersecting) {        
            console.log(id);
            roomService.updateFirstUnseenMessage(id)
              .then((result) => {
                // if (result.isSuccess) {
                //   observer.unobserve(entry.target);           
                // }
              })
              .catch()
              .finally(() => {
                messagesRef.current = messagesRef.current.filter((m) => {
                  if (m?.dataset.id &&  +m.dataset.id > +id) {
                    return true;
                  }
                  if (m) {
                    observer.unobserve(m);
                  }
                  return false;
                });          
              });
          }
        });
      },
      {
        root: chatViewportRef.current,
        rootMargin: '0px',
        threshold: 0.5,
      },
    );

    messagesRef.current?.forEach((el) => {
      if (el) {
        observer.observe(el);
      }
    });

    // Clean up the observer
    return () => {
      messagesRef.current?.forEach((el) => {
        if (el) {
          observer.unobserve(el);
        }
      });
    };
  }, [currentChats]);
};

export default useObserveUnseenMessage;
