import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import MessageThread from '@/components/molecules/MessageThread';
import CreateMessageModal from '@/components/molecules/CreateMessageModal';
import { messageService } from '@/services/api/messageService';

const ProjectMessages = () => {
  const { projectId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadMessages = async () => {
    try {
      setError('');
      setLoading(true);
      const data = await messageService.getByProjectId(projectId);
      setMessages(data);
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [projectId]);

  const handleCreateMessage = async (messageData) => {
    try {
      setActionLoading(true);
      const newMessage = await messageService.create({
        ...messageData,
        projectId: parseInt(projectId)
      });
      setMessages(prev => [newMessage, ...prev]);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create message:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditMessage = async (messageId, messageData) => {
    try {
      setActionLoading(true);
      const updatedMessage = await messageService.update(messageId, messageData);
      setMessages(prev => prev.map(msg => 
        msg.Id === messageId ? updatedMessage : msg
      ));
    } catch (err) {
      console.error('Failed to edit message:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      setActionLoading(true);
      await messageService.delete(messageId);
      setMessages(prev => prev.filter(msg => msg.Id !== messageId));
    } catch (err) {
      console.error('Failed to delete message:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddReply = async (messageId, replyData) => {
    try {
      setActionLoading(true);
      const newReply = await messageService.addReply(messageId, replyData);
      setMessages(prev => prev.map(msg => 
        msg.Id === messageId 
          ? { ...msg, replies: [...msg.replies, newReply] }
          : msg
      ));
    } catch (err) {
      console.error('Failed to add reply:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditReply = async (messageId, replyId, replyData) => {
    try {
      setActionLoading(true);
      const updatedReply = await messageService.updateReply(messageId, replyId, replyData);
      setMessages(prev => prev.map(msg => 
        msg.Id === messageId 
          ? {
              ...msg, 
              replies: msg.replies.map(reply => 
                reply.Id === replyId ? updatedReply : reply
              )
            }
          : msg
      ));
    } catch (err) {
      console.error('Failed to edit reply:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteReply = async (messageId, replyId) => {
    try {
      setActionLoading(true);
      await messageService.deleteReply(messageId, replyId);
      setMessages(prev => prev.map(msg => 
        msg.Id === messageId 
          ? {
              ...msg, 
              replies: msg.replies.filter(reply => reply.Id !== replyId)
            }
          : msg
      ));
    } catch (err) {
      console.error('Failed to delete reply:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6">
        <Error message={error} onRetry={loadMessages} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Messages
          </h1>
          <p className="text-gray-600 mt-2">
            Team discussions and project communication
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <ApperIcon name="Plus" size={16} />
          New discussion
        </Button>
      </div>

      {/* Messages List */}
      {messages.length === 0 ? (
        <Empty
          icon="MessageSquare"
          title="No discussions yet"
          description="Start the conversation! Create the first message thread to begin discussing ideas, sharing updates, or asking questions with your team."
          action={
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <ApperIcon name="Plus" size={16} />
              Start first discussion
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {messages.map((message, index) => (
            <motion.div
              key={message.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MessageThread
                message={message}
                onReply={handleAddReply}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
                onEditReply={handleEditReply}
                onDeleteReply={handleDeleteReply}
                loading={actionLoading}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Message Modal */}
      <CreateMessageModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateMessage}
        loading={actionLoading}
      />
    </div>
  );
};

export default ProjectMessages;