import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { fileService } from '@/services/api/fileService';
import { toast } from 'react-toastify';

const ProjectFiles = () => {
  const { projectId } = useParams();
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderPath, setFolderPath] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [view, setView] = useState('grid'); // grid or list
  const [showUpload, setShowUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadFiles();
  }, [projectId, currentFolder]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fileService.getByFolder(projectId, currentFolder?.Id || null);
      setFiles(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (uploadedFiles) => {
    const fileArray = Array.from(uploadedFiles);
    
    for (const file of fileArray) {
      try {
        // Create file URL for preview (in real app, this would be uploaded to server)
        const fileUrl = URL.createObjectURL(file);
        
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          projectId: parseInt(projectId),
          folderId: currentFolder?.Id || null,
          uploadedBy: 'Current User',
          uploadedById: 1,
          url: fileUrl,
          description: '',
          tags: []
        };

        await fileService.create(fileData);
        toast.success(`${file.name} uploaded successfully`);
      } catch (err) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    loadFiles();
    setShowUpload(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const folderData = {
        name: newFolderName,
        projectId: parseInt(projectId),
        folderId: currentFolder?.Id || null,
        uploadedBy: 'Current User',
        uploadedById: 1,
        description: ''
      };

      await fileService.createFolder(folderData);
      toast.success('Folder created successfully');
      setNewFolderName('');
      setShowNewFolder(false);
      loadFiles();
    } catch (err) {
      toast.error('Failed to create folder');
    }
  };

  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
    setFolderPath([...folderPath, folder]);
  };

  const handleBreadcrumbClick = (index) => {
    if (index === -1) {
      setCurrentFolder(null);
      setFolderPath([]);
    } else {
      const newPath = folderPath.slice(0, index + 1);
      setCurrentFolder(newPath[newPath.length - 1]);
      setFolderPath(newPath);
    }
  };

  const handleFileClick = (file) => {
    if (file.type === 'folder') {
      handleFolderClick(file);
    } else {
      setSelectedFile(file);
    }
  };

  const handleDeleteFile = async (file) => {
    if (!confirm(`Are you sure you want to delete "${file.name}"?`)) return;

    try {
      await fileService.delete(file.Id);
      toast.success('File deleted successfully');
      loadFiles();
      if (selectedFile?.Id === file.Id) {
        setSelectedFile(null);
      }
    } catch (err) {
      toast.error('Failed to delete file');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedFile) return;

    try {
      const commentData = {
        authorName: 'Current User',
        authorId: 1,
        content: newComment
      };

      await fileService.addComment(selectedFile.Id, commentData);
      toast.success('Comment added');
      setNewComment('');
      
      // Refresh file to get updated comments
      const updatedFile = await fileService.getById(selectedFile.Id);
      setSelectedFile(updatedFile);
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const handleAddVersion = async (newFile) => {
    if (!selectedFile) return;

    try {
      const fileUrl = URL.createObjectURL(newFile);
      const versionData = {
        version: `${selectedFile.versions.length + 1}.0`,
        uploadedBy: 'Current User',
        size: newFile.size,
        url: fileUrl,
        changes: 'Updated version'
      };

      const updatedFile = await fileService.addVersion(selectedFile.Id, versionData);
      toast.success('New version uploaded');
      setSelectedFile(updatedFile);
      loadFiles();
    } catch (err) {
      toast.error('Failed to upload new version');
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'date':
        aValue = new Date(a.uploadDate);
        bValue = new Date(b.uploadDate);
        break;
      case 'size':
        aValue = a.size || 0;
        bValue = b.size || 0;
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const FilePreview = ({ file }) => {
    if (file.type === 'folder') return null;

    if (file.type?.startsWith('image/')) {
      return (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <img 
            src={file.url} 
            alt={file.name}
            className="max-w-full max-h-96 mx-auto rounded"
          />
        </div>
      );
    }

    if (file.type?.includes('pdf')) {
      return (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center h-48 text-gray-500">
            <div className="text-center">
              <ApperIcon name="FileText" size={48} className="mx-auto mb-2" />
              <p>PDF Preview</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.open(file.url, '_blank')}
              >
                Open PDF
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (file.type?.startsWith('text/')) {
      return (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="font-mono text-sm bg-white p-4 rounded border max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap">
              {/* In a real app, you'd fetch and display file content */}
              Loading file content...
            </pre>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="text-center">
            <ApperIcon name={fileService.getFileIcon(file.type)} size={32} className="mx-auto mb-2" />
            <p>No preview available</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadFiles} />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Project Files</h1>
          <p className="text-gray-600 mt-1">
            Upload, organize, and share project files with your team
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowNewFolder(true)}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="FolderPlus" size={16} />
            <span>New Folder</span>
          </Button>
          <Button
            onClick={() => setShowUpload(true)}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Upload" size={16} />
            <span>Upload Files</span>
          </Button>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      {folderPath.length > 0 && (
        <div className="flex items-center space-x-2 mb-4 text-sm">
          <button
            onClick={() => handleBreadcrumbClick(-1)}
            className="text-primary hover:text-primary/80 flex items-center space-x-1"
          >
            <ApperIcon name="Home" size={14} />
            <span>Files</span>
          </button>
          {folderPath.map((folder, index) => (
            <React.Fragment key={folder.Id}>
              <ApperIcon name="ChevronRight" size={14} className="text-gray-400" />
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className="text-primary hover:text-primary/80"
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Search and Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
            <option value="size">Sort by Size</option>
            <option value="type">Sort by Type</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            <ApperIcon 
              name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
              size={14} 
            />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('grid')}
          >
            <ApperIcon name="Grid3X3" size={14} />
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
          >
            <ApperIcon name="List" size={14} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* File List */}
        <div 
          className={`flex-1 ${isDragging ? 'bg-primary/5 border-2 border-dashed border-primary rounded-lg' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isDragging && (
            <div className="flex items-center justify-center h-64 text-primary">
              <div className="text-center">
                <ApperIcon name="Upload" size={48} className="mx-auto mb-2" />
                <p className="text-lg font-medium">Drop files here to upload</p>
              </div>
            </div>
          )}

          {!isDragging && (
            <>
              {sortedFiles.length === 0 ? (
                <Empty 
                  message="No files found"
                  description="Upload your first file or create a folder to get started"
                />
              ) : (
                <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}>
                  {sortedFiles.map((file) => (
                    <motion.div
                      key={file.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`
                        ${view === 'grid' ? 'bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md cursor-pointer transition-all' : 'bg-white rounded-lg border border-gray-200 p-3 hover:bg-gray-50 cursor-pointer transition-all'}
                      `}
                      onClick={() => handleFileClick(file)}
                    >
                      {view === 'grid' ? (
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ApperIcon 
                              name={fileService.getFileIcon(file.type)} 
                              size={20} 
                              className="text-gray-600"
                            />
                          </div>
                          <h3 className="font-medium text-gray-900 text-sm truncate mb-1">
                            {file.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {file.type === 'folder' ? 'Folder' : fileService.formatFileSize(file.size)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {format(new Date(file.uploadDate), 'MMM d, yyyy')}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <ApperIcon 
                                name={fileService.getFileIcon(file.type)} 
                                size={16} 
                                className="text-gray-600"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 text-sm">
                                {file.name}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {file.uploadedBy} • {format(new Date(file.uploadDate), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {file.type === 'folder' ? 'Folder' : fileService.formatFileSize(file.size)}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFile(file);
                              }}
                            >
                              <ApperIcon name="Trash2" size={14} />
                            </Button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* File Details Panel */}
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-96 bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">File Details</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFile(null)}
              >
                <ApperIcon name="X" size={14} />
              </Button>
            </div>

            <FilePreview file={selectedFile} />

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{selectedFile.name}</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{fileService.formatFileSize(selectedFile.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span>{selectedFile.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uploaded:</span>
                    <span>{format(new Date(selectedFile.uploadDate), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>By:</span>
                    <span>{selectedFile.uploadedBy}</span>
                  </div>
                </div>
              </div>

              {selectedFile.description && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Description</h5>
                  <p className="text-sm text-gray-600">{selectedFile.description}</p>
                </div>
              )}

              {selectedFile.tags && selectedFile.tags.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Tags</h5>
                  <div className="flex flex-wrap gap-1">
                    {selectedFile.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Version History */}
              {selectedFile.versions && selectedFile.versions.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">Versions</h5>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowVersionHistory(!showVersionHistory)}
                    >
                      <ApperIcon name={showVersionHistory ? 'ChevronUp' : 'ChevronDown'} size={14} />
                    </Button>
                  </div>
                  {showVersionHistory && (
                    <div className="space-y-2">
                      {selectedFile.versions.map((version) => (
                        <div key={version.Id} className="flex items-center justify-between text-sm">
                          <div>
                            <span className="font-medium">v{version.version}</span>
                            <span className="text-gray-500 ml-2">
                              {format(new Date(version.uploadDate), 'MMM d')}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(version.url, '_blank')}
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Comments */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">
                    Comments ({selectedFile.comments?.length || 0})
                  </h5>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowComments(!showComments)}
                  >
                    <ApperIcon name={showComments ? 'ChevronUp' : 'ChevronDown'} size={14} />
                  </Button>
                </div>
                
                {showComments && (
                  <div className="space-y-3">
                    {selectedFile.comments?.map((comment) => (
                      <div key={comment.Id} className="border-l-2 border-gray-200 pl-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Avatar name={comment.authorName} size="xs" />
                          <span className="text-sm font-medium text-gray-900">
                            {comment.authorName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                    
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      />
                      <Button
                        size="sm"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                      >
                        <ApperIcon name="Send" size={14} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(selectedFile.url, '_blank')}
                  >
                    <ApperIcon name="Download" size={16} className="mr-2" />
                    Download
                  </Button>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleAddVersion(e.target.files[0]);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ApperIcon name="Upload" size={16} className="mr-2" />
                      Upload New Version
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteFile(selectedFile)}
                  >
                    <ApperIcon name="Trash2" size={16} className="mr-2" />
                    Delete File
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload Files</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUpload(false)}
              >
                <ApperIcon name="X" size={14} />
              </Button>
            </div>
            
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => document.getElementById('fileInput')?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <ApperIcon name="Upload" size={32} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">Drop files here or click to select</p>
              <p className="text-sm text-gray-500">Supports all file types</p>
            </div>
            
            <input
              id="fileInput"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) {
                  handleFileUpload(e.target.files);
                }
              }}
            />
          </motion.div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create New Folder</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewFolder(false)}
              >
                <ApperIcon name="X" size={14} />
              </Button>
            </div>
            
            <div className="space-y-4">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowNewFolder(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                >
                  Create Folder
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProjectFiles;