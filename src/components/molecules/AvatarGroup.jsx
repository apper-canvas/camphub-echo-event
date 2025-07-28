import React from "react";
import Avatar from "@/components/atoms/Avatar";
import { cn } from "@/utils/cn";

const AvatarGroup = ({ 
  members = [], 
  max = 4, 
  size = "md",
  className 
}) => {
  const visibleMembers = members.slice(0, max);
  const remainingCount = Math.max(0, members.length - max);
  
  return (
    <div className={cn("flex -space-x-2", className)}>
      {visibleMembers.map((member, index) => (
        <Avatar
          key={member.id || index}
          src={member.avatar}
          alt={member.name}
          size={size}
          className="border-2 border-white"
        />
      ))}
      
      {remainingCount > 0 && (
        <div className={cn(
          "relative inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium border-2 border-white",
          size === "sm" && "w-6 h-6 text-xs",
          size === "md" && "w-8 h-8 text-sm",
          size === "lg" && "w-10 h-10 text-base"
        )}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;