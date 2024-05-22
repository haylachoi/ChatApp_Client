import { chatService } from '@/services/chatService';
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
        root: chatViewportRef.current,
        rootMargin: '0px',
        threshold: 0.5,
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
  }, [currentChats?.length]);
};

export default useObserveUnseenMessage;
