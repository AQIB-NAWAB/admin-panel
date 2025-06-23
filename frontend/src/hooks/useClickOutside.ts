import { useEffect } from "react";

function useClickOutside(ref: React.RefObject<HTMLElement>, callback: () => void,ignoreClass?: string) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
    if (ref.current && !ref.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (ignoreClass && target.closest(`.${ignoreClass}`)) {
            return;
        }
        callback();
    }
    }

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, callback]);
}

export default useClickOutside;
