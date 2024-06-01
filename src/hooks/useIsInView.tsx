import { checkIfInView } from '@/libs/utils';
import { useEffect, useRef } from 'react';

const useInView = (
  viewport: HTMLElement | undefined,
  element: HTMLDivElement | undefined,
) => {
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
};

export default useInView;
