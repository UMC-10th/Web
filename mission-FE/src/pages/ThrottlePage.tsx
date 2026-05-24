import { useEffect, useState } from "react";
import useThrottle from "../hooks/useThrottle";

const ThrottlePage = () => {
  const [scrollY, setScrollY] = useState<number>(0);

  const handleScroll = useThrottle(() => {
    setScrollY(window.scrollY);
  }, 2000);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-[220vh] w-full flex items-center justify-center">
      <div className="sticky top-6 mx-auto w-fit rounded-full bg-white/10 px-6 py-3 text-lg font-semibold text-blue-400 backdrop-blur-sm">
        Scroll: {scrollY}px
      </div>
    </div>
  );
};

export default ThrottlePage;
