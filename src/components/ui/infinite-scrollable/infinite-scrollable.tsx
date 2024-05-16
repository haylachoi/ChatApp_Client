import { ArrowDownToLine } from 'lucide-react';
import './infinite-scrollable.css'
import React, {
  UIEventHandler,
  useRef,
  useState,
  PropsWithChildren,
  forwardRef,
} from 'react';

interface InfiniteScrollableProps {
  className?: string;
  canFetchPrevious: boolean;
  canFetchNext: boolean;
  fetchPrevious: () => Promise<void>;
  fetchNext: () => Promise<void>;
}

const InfiniteScrollable = forwardRef<
  HTMLDivElement,
  PropsWithChildren<InfiniteScrollableProps>
>(
  (
    {
      children,
      className,
      fetchPrevious,
      fetchNext,
      canFetchPrevious,
      canFetchNext,
    },
    forwardedRef,
  ) => {
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const lastRef = useRef<HTMLDivElement | null>(null);
    const goToLastRef = useRef<HTMLButtonElement | null>(null)


    const [isFetchingPreviousMessage, setIsFetchingPreviousMessage] =
      useState(false);
    const [isFetchingNextMessage, setIsFetchingNextMessage] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);

    const handleScroll: UIEventHandler<HTMLDivElement> | undefined = async (
      e,
    ) => {
      const element = e.currentTarget;
      let a = element.scrollTop;
      let b = element.scrollHeight - element.clientHeight;
      let c = a / b;

      const isScrollDown = element.scrollTop > scrollTop;
      if (a > b - 600) {
          goToLastRef.current?.classList.remove("show");
        } else {
          goToLastRef.current?.classList.add("show");
      }
      
      if (
        a < 200 &&
        canFetchPrevious &&
        !isFetchingPreviousMessage &&
        !isScrollDown
      ) {
        setIsFetchingPreviousMessage(true);
        try {
          await fetchPrevious();
        } catch (error) {
        } finally {
          setIsFetchingPreviousMessage(false);
        }
      }
      if (
        a > b - 200 &&
        canFetchNext &&
        !isFetchingNextMessage &&
        isScrollDown
      ) {
        setIsFetchingNextMessage(true);
        try {
          await fetchNext();
        } catch (error) {
        } finally {
          setIsFetchingNextMessage(false);
        }
      }

      setScrollTop(element.scrollTop);
    };
    const handleGoToLast: React.MouseEventHandler<HTMLButtonElement> | undefined = (e) => {
        lastRef.current?.scrollIntoView({ behavior: "smooth"});
    }
    return (
      <div
        className={`${className} infinite-scrollable`}
        onScroll={handleScroll}
        ref={(el) => {
          viewportRef.current = el;
          if (forwardedRef) {
            if (typeof forwardedRef === 'function') {
              forwardedRef(el);
            } else {
              forwardedRef.current = el;
            }
          }
        }}>
        {children}
        <div ref={lastRef}></div>
        <button className="go-to-last-btn" onClick={handleGoToLast} ref={goToLastRef}>
            <ArrowDownToLine/>
        </button> 
      </div>
    );
  },
);

export default InfiniteScrollable;
