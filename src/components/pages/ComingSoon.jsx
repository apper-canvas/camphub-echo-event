import React from "react";
import { useParams, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const ComingSoon = () => {
  const { projectId } = useParams();
  const location = useLocation();
  
  // Extract section name from path
  const sectionName = location.pathname.split("/").pop();
  const sectionDisplayName = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
  
  const sectionIcons = {
    messages: "MessageSquare",
    files: "FileText",
    campfire: "Flame",
    schedule: "Calendar",
    documents: "FileText"
  };
  
  const sectionDescriptions = {
    messages: "Team discussions and announcements",
    files: "Share and organize project files",
    campfire: "Real-time team chat and collaboration",
    schedule: "Project timeline and milestones",
    documents: "Project documentation and notes"
  };
  
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon 
          name={sectionIcons[sectionName] || "Layers"} 
          size={40} 
          className="text-primary" 
        />
      </div>
      
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
        {sectionDisplayName} Coming Soon
      </h1>
      
      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        {sectionDescriptions[sectionName] || "This feature is currently in development"}
      </p>
      
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 max-w-lg mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          What to expect:
        </h3>
        
        <div className="space-y-3 text-left">
          {sectionName === "messages" && (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Team message boards</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Threaded discussions</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">File attachments</span>
              </div>
            </>
          )}
          
          {sectionName === "files" && (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">File upload and sharing</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Version control</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Preview and comments</span>
              </div>
            </>
          )}
          
          {sectionName === "campfire" && (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Real-time chat</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Voice and video calls</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Screen sharing</span>
              </div>
            </>
          )}
          
          {sectionName === "schedule" && (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Project timeline</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Milestone tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Team calendar</span>
              </div>
            </>
          )}
          
          {sectionName === "documents" && (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Rich text editor</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Collaborative editing</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Document templates</span>
              </div>
            </>
          )}
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mt-8">
        In the meantime, focus on getting things done with our robust to-do lists!
      </p>
    </div>
  );
};

export default ComingSoon;