
import { useCurrentChats } from '@/stores/roomStore';
import React, { useEffect, useState } from 'react'

const useIsLastMessageInView = (chatViewportRef: React.MutableRefObject<HTMLDivElement | null>, lastMessageRef: React.MutableRefObject<HTMLDivElement | null>) => {
    const [isInview, setIsInview] = useState(true);
    const currentChats = useCurrentChats();
    useEffect(() => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            setIsInview(entry.isIntersecting);
          },
          {
            root: chatViewportRef.current, 
            rootMargin: '0px', 
            threshold: 0.5, 
          },
        );
    
        if (lastMessageRef.current) {
          observer.observe(lastMessageRef.current);
        }
    
        return () => {
          if (lastMessageRef.current) {
            observer.unobserve(lastMessageRef.current);
          }
        };
      }, [currentChats?.length]);

    return isInview;
}

export default useIsLastMessageInView
