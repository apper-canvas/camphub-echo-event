import React from "react";
import { NavLink, useParams } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const ProjectTabs = () => {
  const { projectId } = useParams();
  
  const tabs = [
    {
      id: "todos",
      name: "To-dos",
      icon: "CheckSquare",
      path: `/projects/${projectId}/todos`,
      active: true
    },
{
      id: "messages",
      name: "Messages",
      icon: "MessageSquare",
      path: `/projects/${projectId}/messages`,
      active: true
    },
    {
      id: "files",
      name: "Files",
      icon: "FileText",
      path: `/projects/${projectId}/files`,
      active: false
    },
    {
      id: "campfire",
      name: "Campfire",
      icon: "Flame",
      path: `/projects/${projectId}/campfire`,
      active: false
    },
    {
      id: "schedule",
      name: "Schedule",
      icon: "Calendar",
      path: `/projects/${projectId}/schedule`,
      active: false
    },
    {
      id: "documents",
      name: "Documents",
      icon: "FileText",
      path: `/projects/${projectId}/documents`,
      active: false
    }
  ];
  
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6">
        <nav className="flex space-x-8" aria-label="Project sections">
          {tabs.map(tab => (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={({ isActive }) =>
                `flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`
              }
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.name}</span>
{!tab.active && tab.id !== "todos" && tab.id !== "messages" && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  Coming Soon
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ProjectTabs;