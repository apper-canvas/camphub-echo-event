import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';

const MessageThread = ({ 
  message, 
  onReply, 
  onEdit, 
  onDelete, 
  onEditReply, 
  onDeleteReply,
  loading 
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    return format(date, 'MMM d, yyyy \'at\' h:mm a');
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      await onReply(message.Id, {
        content: replyContent.trim(),
        authorName: 'Current User',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
      });
      setReplyContent('');
      setIsReplying(false);
    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  };

  const handleEditSubmit = async (e, isReply = false, replyId = null) => {
    e.preventDefault();
    
    try {
      if (isReply) {
        await onEditReply(message.Id, replyId, {
          content: editContent.trim()
        });
      } else {
        await onEdit(message.Id, {
          title: editTitle.trim(),
          content: editContent.trim()
        });
      }
      setEditingMessage(null);
      setEditContent('');
      setEditTitle('');
    } catch (error) {
      console.error('Failed to edit:', error);
    }
  };

  const handleDelete = async (isReply = false, replyId = null) => {
    try {
      if (isReply) {
        await onDeleteReply(message.Id, replyId);
      } else {
        await onDelete(message.Id);
      }
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const startEdit = (isReply = false, reply = null) => {
    if (isReply && reply) {
      setEditingMessage(`reply-${reply.Id}`);
      setEditContent(reply.content);
    } else {
      setEditingMessage('message');
      setEditTitle(message.title);
      setEditContent(message.content);
    }
  };

  const isCurrentUser = (authorName) => {
    return authorName === 'Current User';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* Message Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar 
              src={message.authorAvatar} 
              alt={message.authorName}
              size="md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-display font-semibold text-gray-900">
                  {editingMessage === 'message' ? (
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-lg font-semibold"
                      autoFocus
                    />
                  ) : (
                    message.title
                  )}
                </h3>
                {isCurrentUser(message.authorName) && editingMessage !== 'message' && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => startEdit()}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Edit message"
                    >
                      <ApperIcon name="Edit2" size={14} />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm('message')}
                      className="p-1 hover:bg-gray-100 rounded transition-colors text-danger"
                      title="Delete message"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <span>{message.authorName}</span>
                <span>•</span>
                <span>{formatDate(message.createdAt)}</span>
                {message.updatedAt !== message.createdAt && (
                  <>
                    <span>•</span>
                    <span className="text-xs">edited</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="p-6">
        {editingMessage === 'message' ? (
          <form onSubmit={(e) => handleEditSubmit(e)} className="space-y-4">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={4}
            />
            <div className="flex items-center space-x-2">
              <Button type="submit" size="sm" disabled={loading}>
                Save changes
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingMessage(null)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        )}
      </div>

      {/* Replies */}
      {message.replies && message.replies.length > 0 && (
        <div className="border-t border-gray-100">
          <div className="p-4 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 mb-4">
              {message.replies.length} {message.replies.length === 1 ? 'reply' : 'replies'}
            </h4>
            <div className="space-y-4">
              {message.replies.map((reply) => (
                <div key={reply.Id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar 
                        src={reply.authorAvatar} 
                        alt={reply.authorName}
                        size="sm"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{reply.authorName}</span>
                          {isCurrentUser(reply.authorName) && editingMessage !== `reply-${reply.Id}` && (
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => startEdit(true, reply)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="Edit reply"
                              >
                                <ApperIcon name="Edit2" size={12} />
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(`reply-${reply.Id}`)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors text-danger"
                                title="Delete reply"
                              >
                                <ApperIcon name="Trash2" size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{formatDate(reply.createdAt)}</span>
                          {reply.updatedAt !== reply.createdAt && (
                            <>
                              <span>•</span>
                              <span>edited</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {editingMessage === `reply-${reply.Id}` ? (
                    <form onSubmit={(e) => handleEditSubmit(e, true, reply.Id)} className="space-y-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        rows={3}
                      />
                      <div className="flex items-center space-x-2">
                        <Button type="submit" size="sm" disabled={loading}>
                          Save changes
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingMessage(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                      {reply.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reply Form */}
      <div className="border-t border-gray-100 p-4 bg-gray-50">
        {isReplying ? (
          <form onSubmit={handleReplySubmit} className="space-y-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex items-center space-x-2">
              <Button type="submit" size="sm" disabled={loading || !replyContent.trim()}>
                Post reply
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsReplying(false);
                  setReplyContent('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsReplying(true)}
            className="w-full"
          >
            <ApperIcon name="MessageCircle" size={16} />
            Reply to this message
          </Button>
        )}
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-danger/10 rounded-full flex items-center justify-center">
                <ApperIcon name="AlertTriangle" size={20} className="text-danger" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete {showDeleteConfirm === 'message' ? 'message thread' : 'reply'}?
                </h3>
                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (showDeleteConfirm === 'message') {
                    handleDelete(false);
                  } else {
                    const replyId = showDeleteConfirm.replace('reply-', '');
                    handleDelete(true, parseInt(replyId));
                  }
                }}
                disabled={loading}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MessageThread;