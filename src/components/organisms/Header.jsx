import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({ currentProject, projects = [] }) => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [showProjectSwitcher, setShowProjectSwitcher] = useState(false);
  
  const handleProjectSwitch = (project) => {
    navigate(`/projects/${project.Id}/todos`);
    setShowProjectSwitcher(false);
  };
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 text-xl font-display font-bold text-gradient hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Layers" size={20} className="text-white" />
            </div>
            <span>CampHub</span>
          </button>
          
          {currentProject && (
            <>
              <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
              
              <div className="relative">
                <button
                  onClick={() => setShowProjectSwitcher(!showProjectSwitcher)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: currentProject.color }}
                  />
                  <span className="font-medium text-gray-900">
                    {currentProject.name}
                  </span>
                  <ApperIcon name="ChevronDown" size={16} className="text-gray-400" />
                </button>
                
                <AnimatePresence>
                  {showProjectSwitcher && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      {projects.map(project => (
                        <button
                          key={project.Id}
                          onClick={() => handleProjectSwitch(project)}
                          className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                            project.Id === parseInt(projectId) ? "bg-gray-50" : ""
                          }`}
                        >
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: project.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {project.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {project.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <ApperIcon name="Bell" size={20} />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <ApperIcon name="Search" size={20} />
          </button>
          
          <Avatar
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
            alt="User Avatar"
            size="md"
            className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
          />
        </div>
      </div>
      
      {/* Close dropdown when clicking outside */}
      {showProjectSwitcher && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProjectSwitcher(false)}
        />
      )}
    </header>
  );
};

export default Header;