import { chatService } from '@/services/chatService';
import { roomService } from '@/services/roomService';
import { currentViewPortStore } from '@/stores/chatViewportStore';
import { useCurrentChats } from '@/stores/roomStore';
import React, { useEffect } from 'react';

const useObserveUnseenMessage = (
  viewport: HTMLDivElement | undefined,
  unseenMessages: HTMLDivElement[]
) => {
  const currentChats = useCurrentChats();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          const id = element.dataset?.id as number | undefined;
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
                unseenMessages = unseenMessages.filter((m) => {
                  if (m?.dataset.id &&  +m.dataset.id > +id) {
                    return true;
                  }
                  if (m) {
                    observer.unobserve(m);
                  }
                  return false;
                })
              });
          }
        });
      },
      {
        root: viewport,
        rootMargin: '0px',
        threshold: 0.5,
      },
    );

    // messagesRef.current?.forEach((el) => {
    //   if (el) {
    //     observer.observe(el);
    //   }
    // });

    unseenMessages.forEach((el) => {
      observer.observe(el);
    })
    
    // return () => {
    //   messagesRef.current?.forEach((el) => {
    //     if (el) {
    //       observer.unobserve(el);
    //     }
    //   });
    // };
  }, [currentChats]);
};

export default useObserveUnseenMessage;
