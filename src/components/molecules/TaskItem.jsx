import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  
  const handleToggleComplete = () => {
    onUpdate(task.id, { completed: !task.completed });
  };
  
  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      onUpdate(task.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
        task.completed 
          ? "bg-gray-50 border-gray-200" 
          : "bg-white border-gray-200 hover:border-gray-300"
      }`}
    >
      <button
        onClick={handleToggleComplete}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 ${
          task.completed
            ? "bg-accent border-accent text-white"
            : "border-gray-300 hover:border-accent"
        }`}
      >
        {task.completed && (
          <ApperIcon name="Check" size={14} className="w-full h-full" />
        )}
      </button>
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSaveEdit}
            className="text-sm"
            autoFocus
          />
        ) : (
          <span
            className={`block text-sm transition-all duration-200 ${
              task.completed
                ? "text-gray-500 line-through"
                : "text-gray-900"
            }`}
            onClick={() => setIsEditing(true)}
          >
            {task.title}
          </span>
        )}
        
        {task.assignee && !isEditing && (
          <span className="text-xs text-gray-500 mt-1 block">
            Assigned to {task.assignee}
          </span>
        )}
      </div>
      
      {!isEditing && (
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="Edit2" size={14} />
          </button>
          
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <ApperIcon name="Trash2" size={14} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default TaskItem;