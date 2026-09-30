import React, { useEffect, useState } from "react";
import { Image as ImageIcon } from "lucide-react";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  style,
  className,
  ...props
}) => {
  const [hasError, setHasError] = useState(!src);

  useEffect(() => setHasError(!src), [src]);

  if (!src || hasError) {
    return (
      <div 
        className={`${className || ""} image-fallback`.trim()} 
        role="img"
        aria-label={`${alt || "Product"} image unavailable`}
        style={{
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          flexDirection: "column",
          gap: 8,
          width: "100%",
          height: "100%",
          minHeight: 150,
          background: "var(--bg-subtle)", 
          color: "var(--text-muted)",
          ...style
        }}
      >
        <ImageIcon size={40} aria-hidden="true" />
        <strong aria-hidden="true">NovaCart</strong>
        <span aria-hidden="true">Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      loading="lazy"
      decoding="async"
      className={className}
      style={style}
    />
  );
};

export default ImageWithFallback;
