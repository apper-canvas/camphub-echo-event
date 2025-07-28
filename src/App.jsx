import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProjectFiles from "@/components/pages/ProjectFiles";
import "@/index.css";
import ProjectTodos from "@/components/pages/ProjectTodos";
import ComingSoon from "@/components/pages/ComingSoon";
import ProjectMessages from "@/components/pages/ProjectMessages";
import Dashboard from "@/components/pages/Dashboard";
import ProjectLayout from "@/components/pages/ProjectLayout";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects/:projectId" element={<ProjectLayout />}>
            <Route path="todos" element={<ProjectTodos />} />
            <Route path="messages" element={<ProjectMessages />} />
<Route path="files" element={<ProjectFiles />} />
            <Route path="campfire" element={<ComingSoon />} />
            <Route path="schedule" element={<ComingSoon />} />
            <Route path="documents" element={<ComingSoon />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="toast-container"
          style={{
            zIndex: 9999
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;