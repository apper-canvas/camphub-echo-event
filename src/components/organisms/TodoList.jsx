import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskItem from "@/components/molecules/TaskItem";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const TodoList = ({ list, onUpdateList, onDeleteList, onAddTask, onUpdateTask, onDeleteTask }) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(list.name);
  
  const completedTasks = list.tasks.filter(task => task.completed);
  const pendingTasks = list.tasks.filter(task => !task.completed);
  
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(list.Id, { title: newTaskTitle.trim() });
      setNewTaskTitle("");
      setIsAddingTask(false);
    }
  };
  
  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle !== list.name) {
      onUpdateList(list.Id, { name: editTitle.trim() });
    }
    setIsEditingTitle(false);
  };
  
  const handleCancelEdit = () => {
    setEditTitle(list.name);
    setIsEditingTitle(false);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (isAddingTask) {
        handleAddTask();
      } else if (isEditingTitle) {
        handleSaveTitle();
      }
    } else if (e.key === "Escape") {
      if (isAddingTask) {
        setIsAddingTask(false);
        setNewTaskTitle("");
      } else if (isEditingTitle) {
        handleCancelEdit();
      }
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        {isEditingTitle ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSaveTitle}
            className="text-lg font-semibold"
            autoFocus
          />
        ) : (
          <h3
            className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-primary transition-colors"
            onClick={() => setIsEditingTitle(true)}
          >
            {list.name}
          </h3>
        )}
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {completedTasks.length}/{list.tasks.length}
          </span>
          
          <button
            onClick={() => onDeleteList(list.Id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <ApperIcon name="Trash2" size={16} />
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <AnimatePresence>
          {/* Pending tasks */}
          {pendingTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={(taskId, updates) => onUpdateTask(list.Id, taskId, updates)}
              onDelete={(taskId) => onDeleteTask(list.Id, taskId)}
            />
          ))}
          
          {/* Add new task input */}
          {isAddingTask && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center space-x-3 p-3 rounded-lg border border-dashed border-gray-300"
            >
              <div className="w-5 h-5 border-2 border-gray-300 rounded" />
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="What needs to be done?"
                className="flex-1 text-sm border-none shadow-none focus:ring-0 p-0"
                autoFocus
              />
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  onClick={handleAddTask}
                  disabled={!newTaskTitle.trim()}
                >
                  <ApperIcon name="Plus" size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTaskTitle("");
                  }}
                >
                  <ApperIcon name="X" size={14} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Completed tasks */}
        {completedTasks.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Completed ({completedTasks.length})
            </h4>
            <AnimatePresence>
              {completedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdate={(taskId, updates) => onUpdateTask(list.Id, taskId, updates)}
                  onDelete={(taskId) => onDeleteTask(list.Id, taskId)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {!isAddingTask && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAddingTask(true)}
          className="w-full mt-4 justify-start text-gray-500 hover:text-gray-700"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add a to-do
        </Button>
      )}
    </motion.div>
  );
};

export default TodoList;