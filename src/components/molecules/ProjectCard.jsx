import React from "react";
import { useNavigate } from "react-router-dom";
import AvatarGroup from "@/components/molecules/AvatarGroup";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/projects/${project.Id}/todos`);
  };
  
  // Calculate completion percentage (mock calculation)
  const completionPercentage = Math.floor(Math.random() * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {project.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {project.description}
          </p>
        </div>
        
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center ml-4"
          style={{ backgroundColor: `${project.color}20`, color: project.color }}
        >
          <ApperIcon name="Folder" size={16} />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <AvatarGroup members={project.teamMembers} max={3} size="sm" />
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
            {completionPercentage}% complete
          </div>
          
          <div 
            className="w-12 h-12 rounded-full relative flex items-center justify-center text-xs font-medium"
            style={{ backgroundColor: `${project.color}10` }}
          >
            <svg className="w-10 h-10 transform -rotate-90 absolute inset-0">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke={`${project.color}30`}
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke={project.color}
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${completionPercentage} 100`}
                className="progress-ring"
              />
            </svg>
            <span style={{ color: project.color }}>
              {completionPercentage}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;