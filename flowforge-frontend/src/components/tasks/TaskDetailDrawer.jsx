import React, { useState } from 'react';
import {
  X, Star, Copy, CopyCheck, Archive, Trash2, Edit3, CheckSquare, MessageSquare, Paperclip,
  Clock, Calendar, User, Tag, Send, AlertTriangle, Activity, Upload, Download
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../hooks/useAuth';

export const TaskDetailDrawer = ({
  isOpen,
  task,
  onClose,
  onEdit,
  onDelete,
  onToggleStar,
  onToggleArchive,
  onDuplicate,
  onTaskUpdated,
}) => {
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  const currentUserName = user?.name || 'Manju';
  const currentUserAvatar = currentUserName.substring(0, 2).toUpperCase();

  const [newCommentText, setNewCommentText] = useState('');
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [comments, setComments] = useState([
    { id: 'c-1', commentText: 'Integrated JwtAuthenticationFilter into security chain.', userName: currentUserName, userAvatar: currentUserAvatar, timeAgo: '2h ago' },
    { id: 'c-2', commentText: 'Verified status endpoints with OpenAPI Postman collection.', userName: 'Priya Sharma', userAvatar: 'PS', timeAgo: '30m ago' },
  ]);
  const [attachments, setAttachments] = useState([
    { id: 'a-1', fileName: 'JWT_Security_Spec.pdf', fileSize: '1.4 MB', fileType: 'PDF' },
  ]);

  if (!isOpen || !task) return null;

  const isOverdue = task.overdue || (task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED');

  const toggleSubtask = (stId) => {
    const updatedSubtasks = (task.subtasks || subtasks).map((st) =>
      st.id === stId ? { ...st, completed: !st.completed } : st
    );
    setSubtasks(updatedSubtasks);

    const completedCount = updatedSubtasks.filter((s) => s.completed).length;
    const progressPct = updatedSubtasks.length === 0 ? 100 : Math.round((completedCount / updatedSubtasks.length) * 100);

    onTaskUpdated({ ...task, subtasks: updatedSubtasks, subtasksProgress: progressPct });
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.origin + `/tasks?id=${task.id}`);
    showSuccess('Task URL copied to clipboard!');
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const added = await taskService.addComment(task.id, newCommentText.trim());
      setComments([added, ...comments]);
      setNewCommentText('');
      showSuccess('Comment posted.');
    } catch (err) {
      console.error('Comment error:', err);
    }
  };

  const handleDeleteComment = (cId) => {
    setComments(comments.filter((c) => c.id !== cId));
    showSuccess('Comment removed.');
  };

  const handleUploadAttachment = () => {
    const newAtt = {
      id: 'a-' + Date.now(),
      fileName: 'Architecture_Blueprint_Diagram.png',
      fileSize: '2.1 MB',
      fileType: 'Image',
    };
    setAttachments([newAtt, ...attachments]);
    showSuccess('Attachment uploaded.');
  };

  const subtasksList = task.subtasks || subtasks;
  const completedSubtasks = subtasksList.filter((s) => s.completed).length;
  const progressPct = subtasksList.length === 0 ? 100 : Math.round((completedSubtasks / subtasksList.length) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto">
          {/* Top Sticky Header */}
          <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              {/* Left Badges */}
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {task.status.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {task.priority} PRIORITY
                </span>
                {isOverdue && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>OVERDUE</span>
                  </span>
                )}
              </div>

              {/* Action Icons Bar & Close */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onToggleStar(task.id)}
                  className={`p-2 rounded-xl transition-colors ${task.starred ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  title="Star Task"
                >
                  <Star className={`w-4 h-4 ${task.starred ? 'fill-amber-400' : ''}`} />
                </button>

                <button
                  onClick={handleCopyLink}
                  className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
                  title="Copy Task URL"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDuplicate(task.id)}
                  className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
                  title="Duplicate Task"
                >
                  <CopyCheck className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onToggleArchive(task.id)}
                  className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl transition-colors"
                  title={task.archived ? 'Restore Task' : 'Archive Task'}
                >
                  <Archive className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onEdit(task)}
                  className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-colors"
                  title="Edit Task"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDelete(task)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-800 mx-1"></div>

                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Task Title */}
            <h2 className="text-xl font-extrabold text-slate-100">{task.title}</h2>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 flex-1">
            {/* Meta Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-xs">
              <div>
                <span className="block text-[10px] text-slate-500 font-semibold uppercase">Assignee</span>
                <span className="font-bold text-slate-200 flex items-center space-x-1.5 mt-0.5">
                  <div className="w-4 h-4 rounded-full bg-brand-500 text-white font-extrabold text-[9px] flex items-center justify-center">
                    {task.assignedUserAvatar || currentUserAvatar}
                  </div>
                  <span>{task.assignedUser || currentUserName}</span>
                </span>
              </div>

              <div>
                <span className="block text-[10px] text-slate-500 font-semibold uppercase">Due Date</span>
                <span className={`font-bold mt-0.5 block ${isOverdue ? 'text-rose-400' : 'text-slate-200'}`}>
                  {task.dueDate || 'No deadline'}
                </span>
              </div>

              <div>
                <span className="block text-[10px] text-slate-500 font-semibold uppercase">Est. Hours</span>
                <span className="font-bold text-slate-200 mt-0.5 block">{task.estimatedHours || 8} hrs</span>
              </div>

              <div>
                <span className="block text-[10px] text-slate-500 font-semibold uppercase">Project</span>
                <span className="font-bold text-brand-400 mt-0.5 block truncate">
                  {task.projectName || 'FlowForge'}
                </span>
              </div>
            </div>

            {/* Labels Stack */}
            <div className="space-y-1.5">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Labels
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(task.labels || ['Backend', 'Feature']).map((lbl) => (
                  <span
                    key={lbl}
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-brand-300 border border-slate-700"
                  >
                    {lbl}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Task Description
              </span>
              <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {task.description || 'No detailed description specified for this task.'}
              </div>
            </div>

            {/* Interactive Subtask Checklist with Progress % */}
            <div className="space-y-3 p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4 text-brand-400" />
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Subtask Checklist
                  </h4>
                </div>
                <span className="text-xs font-bold text-brand-400">{progressPct}% Done</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-brand-600 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                ></div>
              </div>

              <div className="space-y-2 pt-1">
                {subtasksList.map((st) => (
                  <label
                    key={st.id}
                    className="flex items-center space-x-3 p-2 bg-slate-900/80 hover:bg-slate-900 rounded-xl border border-slate-800/80 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => toggleSubtask(st.id)}
                      className="w-4 h-4 rounded border-slate-700 text-brand-500 focus:ring-brand-500/20 bg-slate-950"
                    />
                    <span className={`text-xs ${st.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {st.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Attachments Section */}
            <div className="space-y-3 p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Paperclip className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Attachments</h4>
                </div>
                <button
                  onClick={handleUploadAttachment}
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center space-x-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
              </div>

              <div className="space-y-2">
                {attachments.map((att) => (
                  <div key={att.id} className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
                    <span className="text-slate-300 font-medium truncate">{att.fileName}</span>
                    <span className="text-[10px] text-slate-500">{att.fileSize}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Engine */}
            <div className="space-y-4 p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
              <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Comments Engine</h4>
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </form>

              <div className="space-y-3 pt-1">
                {comments.map((cmt) => (
                  <div key={cmt.id} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full bg-brand-500 text-white font-bold text-[9px] flex items-center justify-center">
                          {cmt.userAvatar}
                        </div>
                        <span className="font-bold text-slate-200">{cmt.userName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-slate-500">{cmt.timeAgo}</span>
                        <button
                          onClick={() => handleDeleteComment(cmt.id)}
                          className="text-slate-600 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 pl-7 leading-relaxed">{cmt.commentText}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
