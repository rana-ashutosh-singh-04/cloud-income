import { useState } from "react";

/**
 * Next.js-like Image component with optimization features
 * Provides lazy loading, blur placeholder, and error handling
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = "", 
  priority = false,
  objectFit = "cover",
  placeholder = "blur",
  onLoad,
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(priority ? src : "");

  const handleLoad = () => {
    setImageLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setImageError(true);
  };

  // Intersection Observer for lazy loading
  const imageRef = (node) => {
    if (!node || priority) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "50px" }
    );

    observer.observe(node);
  };

  const containerStyle = {
    width: width || "100%",
    height: height || "auto",
    position: "relative",
    overflow: "hidden",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: objectFit,
    transition: "opacity 0.3s ease-in-out",
    opacity: imageLoaded ? 1 : 0,
  };

  if (imageError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={containerStyle}
      >
        <span className="text-gray-400 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <div 
      ref={imageRef}
      className={`relative ${className}`}
      style={containerStyle}
      {...props}
    >
      {/* Blur placeholder */}
      {placeholder === "blur" && !imageLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
          style={{
            filter: "blur(10px)",
            transform: "scale(1.1)",
          }}
        />
      )}
      
      {/* Actual image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={imageStyle}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      )}
    </div>
  );
};

export default OptimizedImage;




