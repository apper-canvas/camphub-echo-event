import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import TodoList from "@/components/organisms/TodoList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { todoService } from "@/services/api/todoService";
import { toast } from "react-toastify";

const ProjectTodos = () => {
  const { projectId } = useParams();
  const [todoLists, setTodoLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddList, setShowAddList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [addingList, setAddingList] = useState(false);
  
  const loadTodoLists = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await todoService.getListsByProject(projectId);
      setTodoLists(data);
    } catch (err) {
      setError(err.message || "Failed to load to-do lists");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadTodoLists();
  }, [projectId]);
  
  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    
    try {
      setAddingList(true);
      const newList = await todoService.createList(projectId, newListName.trim());
      setTodoLists(prev => [...prev, newList]);
      setNewListName("");
      setShowAddList(false);
      toast.success("To-do list created!");
    } catch (err) {
      toast.error(err.message || "Failed to create list");
    } finally {
      setAddingList(false);
    }
  };
  
  const handleUpdateList = async (listId, updates) => {
    try {
      const updatedList = await todoService.updateList(listId, updates);
      setTodoLists(prev => prev.map(list => 
        list.Id === listId ? updatedList : list
      ));
      toast.success("List updated!");
    } catch (err) {
      toast.error(err.message || "Failed to update list");
    }
  };
  
  const handleDeleteList = async (listId) => {
    if (!confirm("Are you sure you want to delete this list and all its tasks?")) return;
    
    try {
      await todoService.deleteList(listId);
      setTodoLists(prev => prev.filter(list => list.Id !== listId));
      toast.success("List deleted!");
    } catch (err) {
      toast.error(err.message || "Failed to delete list");
    }
  };
  
  const handleAddTask = async (listId, taskData) => {
    try {
      const newTask = await todoService.addTask(listId, taskData);
      setTodoLists(prev => prev.map(list => 
        list.Id === listId 
          ? { ...list, tasks: [...list.tasks, newTask] }
          : list
      ));
      toast.success("Task added!");
    } catch (err) {
      toast.error(err.message || "Failed to add task");
    }
  };
  
  const handleUpdateTask = async (listId, taskId, updates) => {
    try {
      const updatedTask = await todoService.updateTask(listId, taskId, updates);
      setTodoLists(prev => prev.map(list => 
        list.Id === listId 
          ? {
              ...list,
              tasks: list.tasks.map(task => 
                task.id === taskId ? updatedTask : task
              )
            }
          : list
      ));
      
      if (updates.completed !== undefined) {
        toast.success(updates.completed ? "Task completed!" : "Task reopened!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to update task");
    }
  };
  
  const handleDeleteTask = async (listId, taskId) => {
    try {
      await todoService.deleteTask(listId, taskId);
      setTodoLists(prev => prev.map(list => 
        list.Id === listId 
          ? { ...list, tasks: list.tasks.filter(task => task.id !== taskId) }
          : list
      ));
      toast.success("Task deleted!");
    } catch (err) {
      toast.error(err.message || "Failed to delete task");
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCreateList();
    } else if (e.key === "Escape") {
      setShowAddList(false);
      setNewListName("");
    }
  };
  
  if (loading) {
    return <Loading type="todos" />;
  }
  
  if (error) {
    return <Error message={error} onRetry={loadTodoLists} />;
  }
  
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
            To-dos
          </h1>
          <p className="text-gray-600">
            Keep track of what needs to get done
          </p>
        </div>
        
        <Button onClick={() => setShowAddList(true)}>
          <ApperIcon name="Plus" size={20} className="mr-2" />
          New List
        </Button>
      </div>
      
      {/* Add new list input */}
      {showAddList && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6"
        >
          <div className="flex items-center space-x-4">
            <Input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="What's this list about?"
              className="flex-1"
              autoFocus
            />
            <Button 
              onClick={handleCreateList}
              disabled={!newListName.trim() || addingList}
            >
              {addingList ? (
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
              ) : (
                <ApperIcon name="Plus" size={16} />
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowAddList(false);
                setNewListName("");
              }}
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>
        </motion.div>
      )}
      
      {todoLists.length === 0 ? (
        <Empty 
          type="todos"
          onAction={() => setShowAddList(true)}
        />
      ) : (
        <div className="space-y-6">
          {todoLists.map((list) => (
            <TodoList
              key={list.Id}
              list={list}
              onUpdateList={handleUpdateList}
              onDeleteList={handleDeleteList}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectTodos;