import { ArrowDownToLine } from 'lucide-react';
import './infinite-scrollable.css';
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
    const goToLastRef = useRef<HTMLButtonElement | null>(null);

    const [isFetchingPreviousMessage, setIsFetchingPreviousMessage] =
      useState(false);
    const [isFetchingNextMessage, setIsFetchingNextMessage] = useState(false);
    const scrollTopRef = useRef(0);

    console.log('render scrollable')
    const handleScroll: UIEventHandler<HTMLDivElement> | undefined = async (
      e,
    ) => {
      const element = e.currentTarget;
      const scrollTop = scrollTopRef.current;
      let a = element.scrollTop;
      let b = element.scrollHeight - element.clientHeight;
      let c = a / b;

      const isScrollDown = element.scrollTop > scrollTop;
      if (a > b - 600) {
        goToLastRef.current?.classList.remove('show');
      } else {
        goToLastRef.current?.classList.add('show');
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

      scrollTopRef.current = element.scrollTop;
    };

    const handleGoToLast:
      | React.MouseEventHandler<HTMLButtonElement>
      | undefined = (e) => {
      lastRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

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
        {isFetchingPreviousMessage && (
          <div className="fetching-indicator fetching-previous-indicator">.</div>
        )}
        {children}
        {isFetchingNextMessage && (
          <div className="fetching-indicator fetching-next-indicator">.</div>
        )}
        <div ref={lastRef} data-fake-last></div>
        <button
          className="go-to-last-btn"
          onClick={handleGoToLast}
          ref={goToLastRef}>
          <ArrowDownToLine />
        </button>
      </div>
    );
  },
);

export default InfiniteScrollable;
