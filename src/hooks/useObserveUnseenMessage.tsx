import { roomService } from '@/services/roomService';
import { currentViewPortStore } from '@/stores/chatViewportStore';
import { useCurrentChats } from '@/stores/roomStore';
import { useCallback, useEffect } from 'react';

const useObserveUnseenMessage = () => {
  const currentChats = useCurrentChats();

  const observerCallback: IntersectionObserverCallback = useCallback(
    (entries, observer) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        const id = element.dataset?.id as number | undefined;
        if (id !== undefined && entry.isIntersecting) {
          console.log(id);
          roomService
            .updateFirstUnseenMessage(id)
            .then((result) => {
              // if (result.isSuccess) {
              //   observer.unobserve(entry.target);
              // }
            })
            .catch()
            .finally(() => {
              currentViewPortStore.unseenMessages =
                currentViewPortStore.unseenMessages.filter((m) => {
                  if (m?.dataset.id && +m.dataset.id > +id) {
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
    [],
  );

  useEffect(() => {
    const viewport = currentViewPortStore.chatViewport;
    const observer = new IntersectionObserver(observerCallback, {
      root: viewport,
      rootMargin: '0px',
      threshold: 0.5,
    });
    currentViewPortStore.unseenMessages.forEach((el) => {
      observer.observe(el);
    });
  }, [currentChats]);
};

export default useObserveUnseenMessage;
