import React, { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import Header from "@/components/organisms/Header";
import ProjectTabs from "@/components/organisms/ProjectTabs";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { projectService } from "@/services/api/projectService";

const ProjectLayout = () => {
  const { projectId } = useParams();
  const [currentProject, setCurrentProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const loadProjectData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [project, projects] = await Promise.all([
        projectService.getById(projectId),
        projectService.getAll()
      ]);
      
      setCurrentProject(project);
      setAllProjects(projects);
    } catch (err) {
      setError(err.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadProjectData();
  }, [projectId]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-16 bg-white border-b border-gray-200"></div>
          <div className="h-14 bg-white border-b border-gray-200"></div>
        </div>
        <Loading />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Error message={error} onRetry={loadProjectData} />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header currentProject={currentProject} projects={allProjects} />
      <ProjectTabs />
      
      <main className="py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ProjectLayout;