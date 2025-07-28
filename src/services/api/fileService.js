import filesData from "@/services/mockData/files.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let files = [...filesData];
let nextCommentId = Math.max(...files.flatMap(f => f.comments?.map(c => c.Id) || []), 0) + 1;

export const fileService = {
  async getAll(projectId) {
    await delay(300);
    return files.filter(f => f.projectId === parseInt(projectId)).map(f => ({ ...f }));
  },

  async getById(id) {
    await delay(200);
    const file = files.find(f => f.Id === parseInt(id));
    if (!file) {
      throw new Error("File not found");
    }
    return { ...file };
  },

  async getByFolder(projectId, folderId = null) {
    await delay(250);
    return files
      .filter(f => f.projectId === parseInt(projectId) && f.folderId === folderId)
      .map(f => ({ ...f }));
  },

  async create(fileData) {
    await delay(400);
    const maxId = Math.max(...files.map(f => f.Id), 0);
    const newFile = {
      Id: maxId + 1,
      ...fileData,
      uploadDate: new Date().toISOString(),
      versions: fileData.versions || [
        {
          Id: 1,
          version: "1.0",
          uploadDate: new Date().toISOString(),
          uploadedBy: fileData.uploadedBy,
          size: fileData.size,
          url: fileData.url,
          changes: "Initial version"
        }
      ],
      comments: []
    };
    files.push(newFile);
    return { ...newFile };
  },

  async createFolder(folderData) {
    await delay(300);
    const maxId = Math.max(...files.map(f => f.Id), 0);
    const newFolder = {
      Id: maxId + 1,
      ...folderData,
      type: "folder",
      uploadDate: new Date().toISOString()
    };
    files.push(newFolder);
    return { ...newFolder };
  },

  async update(id, updates) {
    await delay(300);
    const index = files.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("File not found");
    }
    files[index] = {
      ...files[index],
      ...updates
    };
    return { ...files[index] };
  },

  async addVersion(id, versionData) {
    await delay(350);
    const index = files.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("File not found");
    }
    
    const file = files[index];
    const maxVersionId = Math.max(...file.versions.map(v => v.Id), 0);
    const newVersion = {
      Id: maxVersionId + 1,
      ...versionData,
      uploadDate: new Date().toISOString()
    };
    
    file.versions.push(newVersion);
    file.url = newVersion.url;
    file.size = newVersion.size;
    file.uploadDate = newVersion.uploadDate;
    file.uploadedBy = newVersion.uploadedBy;
    
    return { ...file };
  },

  async rollbackToVersion(id, versionId) {
    await delay(300);
    const index = files.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("File not found");
    }
    
    const file = files[index];
    const version = file.versions.find(v => v.Id === parseInt(versionId));
    if (!version) {
      throw new Error("Version not found");
    }
    
    file.url = version.url;
    file.size = version.size;
    
    return { ...file };
  },

  async addComment(id, commentData) {
    await delay(250);
    const index = files.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("File not found");
    }
    
    const newComment = {
      Id: nextCommentId++,
      ...commentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (!files[index].comments) {
      files[index].comments = [];
    }
    files[index].comments.push(newComment);
    
    return { ...newComment };
  },

  async updateComment(fileId, commentId, updates) {
    await delay(200);
    const fileIndex = files.findIndex(f => f.Id === parseInt(fileId));
    if (fileIndex === -1) {
      throw new Error("File not found");
    }
    
    const file = files[fileIndex];
    const commentIndex = file.comments.findIndex(c => c.Id === parseInt(commentId));
    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }
    
    file.comments[commentIndex] = {
      ...file.comments[commentIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...file.comments[commentIndex] };
  },

  async deleteComment(fileId, commentId) {
    await delay(200);
    const fileIndex = files.findIndex(f => f.Id === parseInt(fileId));
    if (fileIndex === -1) {
      throw new Error("File not found");
    }
    
    const file = files[fileIndex];
    const commentIndex = file.comments.findIndex(c => c.Id === parseInt(commentId));
    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }
    
    const deleted = file.comments.splice(commentIndex, 1)[0];
    return { ...deleted };
  },

  async delete(id) {
    await delay(250);
    const index = files.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("File not found");
    }
    const deleted = files.splice(index, 1)[0];
    return { ...deleted };
  },

  async search(projectId, query) {
    await delay(200);
    const lowerQuery = query.toLowerCase();
    return files
      .filter(f => 
        f.projectId === parseInt(projectId) && 
        (f.name.toLowerCase().includes(lowerQuery) ||
         f.description?.toLowerCase().includes(lowerQuery) ||
         f.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)))
      )
      .map(f => ({ ...f }));
  },

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  getFileIcon(type) {
    if (type === 'folder') return 'Folder';
    if (type?.startsWith('image/')) return 'Image';
    if (type?.includes('pdf')) return 'FileText';
    if (type?.includes('text')) return 'FileText';
    if (type?.includes('document')) return 'FileText';
    if (type?.includes('spreadsheet')) return 'Sheet';
    if (type?.includes('presentation')) return 'Presentation';
    return 'File';
  }
};