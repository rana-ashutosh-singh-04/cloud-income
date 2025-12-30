import { useState, useEffect, useRef, Children, cloneElement } from "react";

/**
 * Lazy loading wrapper component using Intersection Observer
 * Similar to Next.js lazy loading patterns
 */
const LazySection = ({ 
  children, 
  threshold = 0.1, 
  rootMargin = "50px",
  fallback = null,
  className = "",
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Disconnect after first intersection for performance
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return (
    <div ref={sectionRef} className={className} {...props}>
      {isVisible ? (
        Children.map(children, (child) => 
          cloneElement(child, { "data-loaded": true })
        )
      ) : (
        fallback || <div className="min-h-[400px]" />
      )}
    </div>
  );
};

export default LazySection;




