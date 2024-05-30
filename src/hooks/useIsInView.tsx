
import { checkIfInView } from '@/libs/utils';
import React, { useEffect, useRef, useState } from 'react'

const useInView = (viewport: HTMLDivElement | undefined, element: HTMLDivElement | undefined) => {
  const isInviewRef = useRef(checkIfInView(element, viewport));
    useEffect(() => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            isInviewRef.current = entry.isIntersecting;        
          },
          {
            root: viewport, 
            rootMargin: '0px', 
            threshold: 0.7, 
          },
        );
    
        if (element) {
          observer.observe(element);
        }
    
        return () => {
          if (element) {
            observer.unobserve(element);
          }
        };
      }, [viewport, element]);

    return isInviewRef;
}

export default useInView
