import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    
    if (!hash) {
      window.scrollTo(0, 0);
    }
   
  }, [pathname,hash]);

  return null; // 這個元件不需要渲染任何東西
};

export default ScrollToTop;