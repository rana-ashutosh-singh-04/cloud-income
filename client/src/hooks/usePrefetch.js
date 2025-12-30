import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Next.js-like prefetching hook
 * Preloads route data when link is hovered or in viewport
 */
export const usePrefetch = (path, options = {}) => {
  const { enabled = true, strategy = "hover" } = options;

  useEffect(() => {
    if (!enabled) return;

    const prefetchRoute = () => {
      // Prefetch route component
      // In a real Next.js app, this would prefetch the page data
      // Here we can prefetch API data or prepare resources
      
      // Create link element for browser prefetching
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = path;
      document.head.appendChild(link);
    };

    if (strategy === "hover") {
      // Prefetch on hover (similar to Next.js Link prefetch)
      const elements = document.querySelectorAll(`[href="${path}"]`);
      elements.forEach((el) => {
        el.addEventListener("mouseenter", prefetchRoute, { once: true });
      });

      return () => {
        elements.forEach((el) => {
          el.removeEventListener("mouseenter", prefetchRoute);
        });
      };
    } else if (strategy === "viewport") {
      // Prefetch when element enters viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              prefetchRoute();
              observer.disconnect();
            }
          });
        },
        { rootMargin: "200px" }
      );

      const elements = document.querySelectorAll(`[href="${path}"]`);
      elements.forEach((el) => observer.observe(el));

      return () => {
        elements.forEach((el) => observer.unobserve(el));
        observer.disconnect();
      };
    }
  }, [path, enabled, strategy]);
};

export default usePrefetch;




