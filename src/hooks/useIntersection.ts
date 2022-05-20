import { MutableRefObject, useEffect } from 'react';

let listenerCallbacks = new WeakMap();

let observer: IntersectionObserver | null = null;

const handleIntersections: IntersectionObserverCallback = (entries) => {
  entries.forEach((entry) => {
    if (listenerCallbacks.has(entry.target)) {
      let cb = listenerCallbacks.get(entry.target);

      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        observer?.unobserve(entry.target);
        listenerCallbacks.delete(entry.target);
        cb();
      }
    }
  });
};

const getIntersectionObserver = () => {
  if (observer === null) {
    observer = new IntersectionObserver(handleIntersections, {
      threshold: 0.1,
    });
  }
  return observer;
};

export const useIntersection = (
  elem: MutableRefObject<HTMLDivElement | null>,
  callback: Function
) => {
  useEffect(() => {
    let target = elem.current;
    if (!target) return;
    let observer = getIntersectionObserver();
    listenerCallbacks.set(target, callback);
    observer.observe(target);

    return () => {
      if (!target) return;
      listenerCallbacks.delete(target);
      observer.unobserve(target);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
