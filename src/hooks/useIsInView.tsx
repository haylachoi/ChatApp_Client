
import { checkIfInView } from '@/libs/utils';
import React, { useEffect, useRef, useState } from 'react'

const useInView = (viewportRef: React.MutableRefObject<HTMLDivElement | null>, elementRef: React.MutableRefObject<HTMLDivElement | null>) => {
  const isInviewRef = useRef(checkIfInView(elementRef, viewportRef));
    useEffect(() => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            isInviewRef.current = entry.isIntersecting;        
          },
          {
            root: viewportRef.current, 
            rootMargin: '0px', 
            threshold: 0.7, 
          },
        );
    
        if (elementRef.current) {
          observer.observe(elementRef.current);
        }
    
        return () => {
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        };
      }, [viewportRef.current, elementRef.current]);

    return isInviewRef;
}

export default useInView
