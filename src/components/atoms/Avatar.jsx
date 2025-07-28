import React from "react";
import { cn } from "@/utils/cn";

const Avatar = ({ 
  src, 
  alt, 
  size = "md", 
  className,
  fallback 
}) => {
  const sizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
    xl: "w-12 h-12 text-lg"
  };
  
  const initials = fallback || (alt ? alt.split(" ").map(n => n[0]).join("").toUpperCase() : "");
  
  return (
    <div className={cn(
      "relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-medium",
      sizes[size],
      className
    )}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      
      <span 
        className={cn(
          "flex items-center justify-center w-full h-full rounded-full",
          src ? "hidden" : "flex"
        )}
      >
        {initials}
      </span>
    </div>
  );
};

export default Avatar;