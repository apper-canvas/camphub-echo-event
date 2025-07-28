import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found",
  description = "Get started by creating your first item",
  actionLabel = "Create New",
  onAction,
  icon = "Plus",
  type = "default"
}) => {
  if (type === "projects") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-6">
          <ApperIcon name="FolderPlus" size={40} className="text-primary" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No projects yet
        </h3>
        
        <p className="text-gray-600 mb-8 max-w-md">
          Start organizing your work by creating your first project. You can add team members, create to-do lists, and manage everything in one place.
        </p>
        
        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <ApperIcon name="Plus" size={20} className="mr-2" />
            Create Your First Project
          </button>
        )}
      </div>
    );
  }

  if (type === "todos") {
    return (
      <div className="bg-white rounded-lg p-12 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="CheckSquare" size={32} className="text-accent" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No to-do lists yet
        </h3>
        
        <p className="text-gray-600 mb-6">
          Create your first to-do list to start organizing tasks for this project.
        </p>
        
        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Create To-Do List
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} size={32} className="text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name={icon} size={16} className="mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;