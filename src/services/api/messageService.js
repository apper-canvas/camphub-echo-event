import mockMessages from '@/services/mockData/messages.json';
import { toast } from 'react-toastify';

let messages = [...mockMessages];
let nextId = Math.max(...messages.map(m => m.Id), 0) + 1;
let nextReplyId = Math.max(
  ...messages.flatMap(m => m.replies.map(r => r.Id)),
  0
) + 1;

export const messageService = {
  getAll: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...messages]);
      }, 500);
    });
  },

  getByProjectId: (projectId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const projectMessages = messages
          .filter(message => message.projectId === parseInt(projectId))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        resolve(projectMessages);
      }, 500);
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const message = messages.find(m => m.Id === parseInt(id));
        if (message) {
          resolve({ ...message });
        } else {
          reject(new Error('Message not found'));
        }
      }, 300);
    });
  },

  create: (messageData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMessage = {
          ...messageData,
          Id: nextId++,
          projectId: parseInt(messageData.projectId),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          replies: []
        };
        messages.push(newMessage);
        toast.success('Message thread created successfully');
        resolve({ ...newMessage });
      }, 600);
    });
  },

  update: (id, messageData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = messages.findIndex(m => m.Id === parseInt(id));
        if (index !== -1) {
          messages[index] = {
            ...messages[index],
            ...messageData,
            Id: parseInt(id),
            updatedAt: new Date().toISOString()
          };
          toast.success('Message updated successfully');
          resolve({ ...messages[index] });
        } else {
          reject(new Error('Message not found'));
        }
      }, 500);
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = messages.findIndex(m => m.Id === parseInt(id));
        if (index !== -1) {
          messages.splice(index, 1);
          toast.success('Message thread deleted successfully');
          resolve();
        } else {
          reject(new Error('Message not found'));
        }
      }, 400);
    });
  },

  addReply: (messageId, replyData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const messageIndex = messages.findIndex(m => m.Id === parseInt(messageId));
        if (messageIndex !== -1) {
          const newReply = {
            ...replyData,
            Id: nextReplyId++,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          messages[messageIndex].replies.push(newReply);
          toast.success('Reply added successfully');
          resolve({ ...newReply });
        } else {
          reject(new Error('Message not found'));
        }
      }, 500);
    });
  },

  updateReply: (messageId, replyId, replyData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const messageIndex = messages.findIndex(m => m.Id === parseInt(messageId));
        if (messageIndex !== -1) {
          const replyIndex = messages[messageIndex].replies.findIndex(r => r.Id === parseInt(replyId));
          if (replyIndex !== -1) {
            messages[messageIndex].replies[replyIndex] = {
              ...messages[messageIndex].replies[replyIndex],
              ...replyData,
              Id: parseInt(replyId),
              updatedAt: new Date().toISOString()
            };
            toast.success('Reply updated successfully');
            resolve({ ...messages[messageIndex].replies[replyIndex] });
          } else {
            reject(new Error('Reply not found'));
          }
        } else {
          reject(new Error('Message not found'));
        }
      }, 500);
    });
  },

  deleteReply: (messageId, replyId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const messageIndex = messages.findIndex(m => m.Id === parseInt(messageId));
        if (messageIndex !== -1) {
          const replyIndex = messages[messageIndex].replies.findIndex(r => r.Id === parseInt(replyId));
          if (replyIndex !== -1) {
            messages[messageIndex].replies.splice(replyIndex, 1);
            toast.success('Reply deleted successfully');
            resolve();
          } else {
            reject(new Error('Reply not found'));
          }
        } else {
          reject(new Error('Message not found'));
        }
      }, 400);
    });
  }
};