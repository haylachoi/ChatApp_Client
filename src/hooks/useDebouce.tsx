import { debounce } from '@/libs/utils';
import { useLayoutEffect, useMemo, useRef } from 'react';

function useDebounce(callback: Function, delay: number) {
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // useMemo: nếu return debounce trực tiếp thì mỗi khi re-render (useDebounce() dc gọi) thì sẽ tạo ra một version mới của debounce()
  // useRef và useCallback: update callback mới nhất,
  return useMemo(
    () => debounce((...args: any) => callbackRef.current(...args), delay),
    [delay],
  );
}

export default useDebounce;
