import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import ProjectCard from "@/components/molecules/ProjectCard";
import CreateProjectModal from "@/components/molecules/CreateProjectModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { projectService } from "@/services/api/projectService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  
  const loadProjects = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadProjects();
  }, []);
  
  const handleCreateProject = async (projectData) => {
    try {
      setCreateLoading(true);
      const newProject = await projectService.create(projectData);
      setProjects(prev => [...prev, newProject]);
      setShowCreateModal(false);
      toast.success("Project created successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to create project");
    } finally {
      setCreateLoading(false);
    }
  };
  
  if (loading) {
    return <Loading type="dashboard" />;
  }
  
  if (error) {
    return <Error message={error} onRetry={loadProjects} />;
  }
  
  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                Welcome to CampHub
              </h1>
              <p className="text-gray-600">
                Organize your projects and collaborate with your team
              </p>
            </div>
          </div>
          
          <Empty 
            type="projects"
            onAction={() => setShowCreateModal(true)}
          />
        </div>
        
        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProject}
          loading={createLoading}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Your Projects
            </h1>
            <p className="text-gray-600">
              {projects.length} project{projects.length !== 1 ? "s" : ""} • Keep your team organized and on track
            </p>
          </div>
          
          <Button onClick={() => setShowCreateModal(true)}>
            <ApperIcon name="Plus" size={20} className="mr-2" />
            New Project
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
        loading={createLoading}
      />
    </div>
  );
};

export default Dashboard;