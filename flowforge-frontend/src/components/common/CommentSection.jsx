import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Reply,
  Edit2,
  Trash2,
  X,
  AtSign,
  User,
  Sparkles,
  CornerDownRight,
} from 'lucide-react';
import { commentService } from '../../services/commentService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from './LoadingSpinner';

const TEAM_MEMBERS = [
  { email: 'manju@FlowForge.com', name: 'Manju (Admin)' },
  { email: 'rahul@FlowForge.com', name: 'Rahul Verma' },
  { email: 'priya@FlowForge.com', name: 'Priya Sharma' },
  { email: 'ananya@FlowForge.com', name: 'Ananya Roy' },
];

/**
 * Reusable Unified Comment Section Component.
 * 
 * WHY THIS COMPONENT EXISTS:
 * Renders comment threads with nested replies, rich text, @mentions user autocomplete, and edit/delete controls
 * for Projects, Tasks, and File Attachments.
 */
export const CommentSection = ({ targetType, targetId }) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [inputText, setInputText] = useState('');
  const [replyParent, setReplyParent] = useState(null);
  const [editingComment, setEditingComment] = useState(null);

  // Mention Autocomplete Popover
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await commentService.getComments(targetType, targetId);
      setComments(data || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetType && targetId) {
      loadComments();
    }
  }, [targetType, targetId]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);

    // Detect @ mention trigger
    const lastWord = val.split(/\s+/).pop();
    if (lastWord && lastWord.startsWith('@')) {
      setShowMentionMenu(true);
      setMentionFilter(lastWord.slice(1).toLowerCase());
    } else {
      setShowMentionMenu(false);
    }
  };

  const handleSelectMention = (memberEmail) => {
    const words = inputText.split(/\s+/);
    words.pop();
    const newText = [...words, `@${memberEmail} `].join(' ').trimStart();
    setInputText(newText);
    setShowMentionMenu(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (editingComment) {
      try {
        await commentService.editComment(editingComment.id, inputText);
        showSuccess('Comment updated.');
        setEditingComment(null);
        setInputText('');
        loadComments();
      } catch (err) {
        showError('Failed to update comment.');
      }
      return;
    }

    try {
      await commentService.createComment({
        targetType,
        targetId,
        content: inputText,
        parentCommentId: replyParent ? replyParent.id : null,
      });
      showSuccess('Comment posted.');
      setInputText('');
      setReplyParent(null);
      loadComments();
    } catch (err) {
      showError('Failed to post comment.');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      showSuccess('Comment deleted.');
      loadComments();
    } catch (err) {
      showError('Failed to delete comment.');
    }
  };

  // Helper to render nested comment node
  const renderCommentNode = (c, level = 0) => {
    const isAuthor = c.authorEmail?.toLowerCase().trim() === user?.email?.toLowerCase().trim();

    return (
      <div key={c.id} className={`space-y-3 ${level > 0 ? 'ml-6 border-l-2 border-slate-800 pl-4 mt-3' : ''}`}>
        <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-sm hover:border-slate-700 transition-all group">
          {/* Header */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center border border-amber-500/30">
                {c.authorName?.[0] || 'U'}
              </div>
              <span className="font-bold text-slate-200">{c.authorName}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-500 text-[10px]">{c.timeFormatted || 'Just now'}</span>
              {c.edited && <span className="text-[10px] italic text-slate-500">(edited)</span>}
            </div>

            {/* Hover Actions */}
            {!c.deleted && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                <button
                  onClick={() => setReplyParent(c)}
                  className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Reply"
                >
                  <Reply className="w-3.5 h-3.5" />
                </button>
                {isAuthor && (
                  <>
                    <button
                      onClick={() => {
                        setEditingComment(c);
                        setInputText(c.content);
                      }}
                      className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Comment Body Content */}
          <div className={`text-xs leading-relaxed ${c.deleted ? 'text-slate-500 italic' : 'text-slate-300'}`}>
            {c.content}
          </div>
        </div>

        {/* Nested Child Replies */}
        {c.replies && c.replies.length > 0 && (
          <div className="space-y-3">{c.replies.map((reply) => renderCommentNode(reply, level + 1))}</div>
        )}
      </div>
    );
  };

  const filteredMembers = TEAM_MEMBERS.filter(
    (m) => m.name.toLowerCase().includes(mentionFilter) || m.email.toLowerCase().includes(mentionFilter)
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Comments & Discussion</h4>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
          {comments.length} Comments
        </span>
      </div>

      {/* Reply / Edit Banner Indicator */}
      {(replyParent || editingComment) && (
        <div className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center space-x-2 truncate">
            {replyParent ? (
              <>
                <CornerDownRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-bold text-amber-400">Replying to {replyParent.authorName}:</span>
                <span className="truncate text-slate-400">{replyParent.content}</span>
              </>
            ) : (
              <>
                <Edit2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-bold text-amber-400">Editing Comment:</span>
                <span className="truncate text-slate-400">{editingComment.content}</span>
              </>
            )}
          </div>
          <button
            onClick={() => {
              setReplyParent(null);
              setEditingComment(null);
              setInputText('');
            }}
            className="text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Composer Form */}
      <form onSubmit={handleSubmit} className="relative space-y-2">
        {/* @Mentions Autocomplete Dropdown Popover */}
        {showMentionMenu && filteredMembers.length > 0 && (
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-30 p-2 space-y-1 animate-in fade-in">
            <div className="text-[10px] font-bold uppercase text-amber-400 px-2 py-1 flex items-center space-x-1">
              <AtSign className="w-3 h-3" />
              <span>Mention Team Member</span>
            </div>
            {filteredMembers.map((m) => (
              <button
                key={m.email}
                type="button"
                onClick={() => handleSelectMention(m.email)}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left"
              >
                <User className="w-3.5 h-3.5 text-purple-400" />
                <div className="truncate">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-[10px] text-slate-500">{m.email}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Write a comment... (Type @ to mention team members)"
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="py-6 flex justify-center">
          <LoadingSpinner label="Loading comments..." />
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800/60 p-4">
          <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-2 opacity-60" />
          <p className="text-xs text-slate-400 font-medium">No comments yet.</p>
          <p className="text-[11px] text-slate-500 mt-1">Start the discussion by posting a comment above.</p>
        </div>
      ) : (
        <div className="space-y-3">{comments.map((c) => renderCommentNode(c))}</div>
      )}
    </div>
  );
};

export default CommentSection;
