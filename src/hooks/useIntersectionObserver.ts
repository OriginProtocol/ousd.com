import { useEffect, useState, useRef, RefObject } from "react";

const useIntersectionObserver = (elements: RefObject<HTMLElement>[]) => {
  const observer = useRef<IntersectionObserver>();
  const [activeId, setActiveId] = useState<number>(0);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => setActiveId(parseInt(entries[0].target.id)),
      {
        // re run when element is in the top 20% of the viewport
        rootMargin: "0% 0% -90% 0px",
      }
    );

    elements.forEach((e) => observer.current.observe(e.current));
  }, []);

  return activeId;
};

export default useIntersectionObserver;
