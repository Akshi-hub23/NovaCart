import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const pathnameChanged = previousPathname.current !== pathname;
    previousPathname.current = pathname;

    if (!pathnameChanged) return;
    // Let browser history restore the prior entry's position on Back/Forward.
    if (navigationType === "POP") return;

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, navigationType]);

  return null;
}
