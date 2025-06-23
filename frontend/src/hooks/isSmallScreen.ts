import { useEffect, useState } from "react";

function useIsSmallScreen(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => window.innerWidth < breakpoint
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return isMobile;
}

export default useIsSmallScreen;
