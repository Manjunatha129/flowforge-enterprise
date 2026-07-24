import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Hash,
  Users,
  Send,
  Paperclip,
  Smile,
  Pin,
  Reply,
  Edit2,
  Trash2,
  X,
  Check,
  CheckCheck,
  FolderKanban,
  CornerDownRight,
  Sparkles,
} from 'lucide-react';
import { chatService } from '../services/chatService';
import { projectService } from '../services/projectService';
import { presenceService } from '../services/presenceService';
import { websocketService } from '../services/websocketService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const EMOJIS = ['👍', '❤️', '🚀', '🔥', '🎉', '😊', '👀', '💯', '✅', '🙌', '💡', '💻', '⚡', '👏', '🎯', '✨', '😃', '⭐', '🤝', '💪', '🏆', '📌', '💬', '🤩'];

/**
 * Enterprise Team Chat & Collaboration Portal.
 * 
 * WHY THIS PAGE EXISTS:
 * Serves as the central real-time communication hub supporting Workspace Chat, Project Channels,
 * Direct Messages between real database users, STOMP typing signals, message replies, edits, pins, read receipts, and file attachments.
 */
export const ChatPage = () => {
  const { user } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const messagesEndRef = useRef(null);
  const typingTimeoutsRef = useRef({});

  // Active Selected Channel State
  const [activeChannel, setActiveChannel] = useState({
    type: 'WORKSPACE',
    id: 'general',
    name: 'general-workspace',
    recipientEmail: null,
  });

  // Resources Data
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [workspaceUsers, setWorkspaceUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Form & Editing State
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [attachment, setAttachment] = useState(null);

  const [wsStatus, setWsStatus] = useState('DISCONNECTED');

  // Auto-scroll helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  // Initial Load Projects, Registered Users & Presence
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const [projList, presenceList, userList] = await Promise.all([
          projectService.getAllProjects(),
          presenceService.getOnlineUsers(),
          chatService.getWorkspaceUsers(),
        ]);
        setProjects(projList || []);
        setOnlineUsers(presenceList || []);
        setWorkspaceUsers(userList || []);
      } catch (err) {
        console.error('Failed to initialize chat resources:', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // Track WebSocket connection status
  useEffect(() => {
    const unsubStatus = websocketService.onStatusChange((status) => {
      setWsStatus(status);
    });
    websocketService.connect();
    return () => unsubStatus();
  }, []);

  // Fetch Channel Messages via REST API when Active Channel or User changes
  useEffect(() => {
    let isSubscribed = true;
    const fetchChannelMessages = async () => {
      try {
        setMessagesLoading(true);
        let list = [];
        if (activeChannel.type === 'WORKSPACE') {
          list = await chatService.getWorkspaceMessages();
        } else if (activeChannel.type === 'PROJECT') {
          list = await chatService.getProjectMessages(activeChannel.id);
        } else if (activeChannel.type === 'DIRECT' && activeChannel.recipientEmail) {
          list = await chatService.getDirectMessages(user?.email, activeChannel.recipientEmail);
        }

        if (isSubscribed) {
          setMessages(list || []);
        }
      } catch (err) {
        console.error('Failed to load channel messages:', err);
      } finally {
        if (isSubscribed) {
          setMessagesLoading(false);
        }
      }
    };

    if (user) {
      fetchChannelMessages();
    }

    return () => {
      isSubscribed = false;
    };
  }, [activeChannel, user]);

  // Subscribe to STOMP WebSockets for Real-Time Messages, Presence & Typing Signals
  useEffect(() => {
    // 1. Listen for Presence Updates
    const unsubPresence = websocketService.onPresence((presence) => {
      setOnlineUsers((prev) => {
        const exists = prev.some((u) => u.userEmail === presence.userEmail);
        if (presence.status === 'ONLINE') {
          return exists ? prev.map((u) => (u.userEmail === presence.userEmail ? presence : u)) : [presence, ...prev];
        } else {
          return prev.filter((u) => u.userEmail !== presence.userEmail);
        }
      });
    });

    // 2. STOMP Subscription for Active Channel Messages
    let stompSub = null;
    let typingSub = null;

    if (websocketService.client && websocketService.client.connected) {
      let topic = '/topic/chat/workspace';
      if (activeChannel.type === 'PROJECT') {
        topic = `/topic/chat/project/${activeChannel.id}`;
      } else if (activeChannel.type === 'DIRECT' && user?.email && activeChannel.recipientEmail) {
        const pair = [user.email.toLowerCase().trim(), activeChannel.recipientEmail.toLowerCase().trim()].sort();
        topic = `/topic/chat/direct/${pair[0]}_${pair[1]}`;
      }

      stompSub = websocketService.client.subscribe(topic, (frame) => {
        try {
          const msg = JSON.parse(frame.body);
          setMessages((prev) => {
            const index = prev.findIndex((m) => m.id === msg.id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = msg;
              return updated;
            } else {
              return [...prev, msg];
            }
          });

          // Automatically mark message as read if user is recipient
          if (msg.senderEmail !== user?.email) {
            chatService.markAsRead(msg.id);
          }
        } catch (e) {
          console.error('Error parsing chat frame:', e);
        }
      });

      // 3. STOMP Typing Signal Subscription
      const channelId = activeChannel.type === 'DIRECT' ? activeChannel.recipientEmail : activeChannel.id;
      typingSub = websocketService.client.subscribe(`/topic/chat/typing/${channelId}`, (frame) => {
        try {
          const signal = JSON.parse(frame.body);
          if (signal.senderEmail !== user?.email) {
            const senderKey = signal.senderName || signal.senderEmail;

            if (signal.typing) {
              setTypingUsers((prev) => new Set(prev).add(senderKey));

              if (typingTimeoutsRef.current[senderKey]) {
                clearTimeout(typingTimeoutsRef.current[senderKey]);
              }
              typingTimeoutsRef.current[senderKey] = setTimeout(() => {
                setTypingUsers((prev) => {
                  const next = new Set(prev);
                  next.delete(senderKey);
                  return next;
                });
              }, 3000);
            } else {
              setTypingUsers((prev) => {
                const next = new Set(prev);
                next.delete(senderKey);
                return next;
              });
            }
          }
        } catch (e) {
          console.error(e);
        }
      });
    }

    return () => {
      unsubPresence();
      if (stompSub) stompSub.unsubscribe();
      if (typingSub) typingSub.unsubscribe();
    };
  }, [activeChannel, user, wsStatus]);

  // Handle Typing Signal Dispatch
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);

    const channelId = activeChannel.type === 'DIRECT' ? activeChannel.recipientEmail : activeChannel.id;
    if (val.trim().length > 0) {
      chatService.sendTypingSignal(channelId, true);
    } else {
      chatService.sendTypingSignal(channelId, false);
    }
  };

  // Send Message Submit
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && !attachment) return;

    const channelId = activeChannel.type === 'DIRECT' ? activeChannel.recipientEmail : activeChannel.id;
    chatService.sendTypingSignal(channelId, false);

    if (editingMessage) {
      // Edit existing message
      try {
        const updated = await chatService.editMessage(editingMessage.id, inputText);
        setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        showSuccess('Message updated.');
      } catch (err) {
        showError('Failed to edit message.');
      } finally {
        setEditingMessage(null);
        setInputText('');
      }
      return;
    }

    // Send new message
    const payload = {
      content: inputText,
      channelType: activeChannel.type,
      projectId: activeChannel.type === 'PROJECT' ? activeChannel.id : null,
      recipientEmail: activeChannel.type === 'DIRECT' ? activeChannel.recipientEmail : null,
      senderEmail: user?.email,
      attachmentUrl: attachment,
      replyToId: replyToMessage ? replyToMessage.id : null,
    };

    try {
      const sent = await chatService.sendStompMessage(payload);
      if (sent) {
        setMessages((prev) => {
          if (!prev.some((m) => m.id === sent.id)) {
            return [...prev, sent];
          }
          return prev;
        });
      }
      setInputText('');
      setReplyToMessage(null);
      setAttachment(null);
      setShowEmojiPicker(false);
    } catch (err) {
      showError('Failed to send chat message.');
    }
  };

  // Handle Attachment File Selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showError('File size must be less than 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachment(reader.result);
      showInfo(`Attached ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  // Delete Message
  const handleDeleteMessage = async (msgId) => {
    try {
      await chatService.deleteMessage(msgId);
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, content: 'This message was deleted.', deleted: true } : m))
      );
      showSuccess('Message deleted.');
    } catch (err) {
      showError('Failed to delete message.');
    }
  };

  // Pin Message
  const handleTogglePin = async (msgId) => {
    try {
      const updated = await chatService.togglePinMessage(msgId);
      setMessages((prev) => prev.map((m) => (m.id === msgId ? updated : m)));
      showSuccess(updated.pinned ? 'Message pinned to channel header.' : 'Message unpinned.');
    } catch (err) {
      showError('Failed to pin message.');
    }
  };

  // Add Emoji to Input
  const handleAddEmoji = (emoji) => {
    setInputText((prev) => prev + emoji);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner label="Initializing Enterprise Team Chat..." />
      </div>
    );
  }

  const pinnedMessage = messages.find((m) => m.pinned && !m.deleted);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-4 animate-in fade-in duration-300">
      {/* LEFT CHANNELS & DMS SIDEBAR */}
      <div className="w-full md:w-72 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shrink-0 shadow-xl overflow-hidden">
        {/* Channel Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-slate-100 tracking-wide">FlowForge Chat</h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            STOMP Live
          </span>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {/* Workspace Channels */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
              Workspace Channels
            </div>
            <button
              onClick={() =>
                setActiveChannel({ type: 'WORKSPACE', id: 'general', name: 'general-workspace', recipientEmail: null })
              }
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${activeChannel.type === 'WORKSPACE'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
            >
              <Hash className="w-4 h-4 text-amber-400" />
              <span>general-workspace</span>
            </button>
          </div>

          {/* Project Channels */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center justify-between">
              <span>Project Channels</span>
              <FolderKanban className="w-3 h-3" />
            </div>
            <div className="space-y-1">
              {projects.length === 0 ? (
                <div className="text-[11px] text-slate-500 px-2 italic">No active projects</div>
              ) : (
                projects.map((p) => {
                  const isActive = activeChannel.type === 'PROJECT' && activeChannel.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() =>
                        setActiveChannel({
                          type: 'PROJECT',
                          id: p.id,
                          name: p.projectName.toLowerCase().replace(/\s+/g, '-'),
                          recipientEmail: null,
                        })
                      }
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${isActive
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-md font-bold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                    >
                      <Hash className="w-3.5 h-3.5 text-purple-400" />
                      <span className="truncate">{p.projectName.toLowerCase().replace(/\s+/g, '-')}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Direct Messages (Real Registered Database Users) */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center justify-between">
              <span>Direct Messages</span>
              <Users className="w-3 h-3" />
            </div>
            <div className="space-y-1">
              {workspaceUsers
                .filter((u) => u.email?.toLowerCase().trim() !== user?.email?.toLowerCase().trim())
                .length === 0 ? (
                <div className="text-[11px] text-slate-500 px-2 italic">No other registered users</div>
              ) : (
                workspaceUsers
                  .filter((u) => u.email?.toLowerCase().trim() !== user?.email?.toLowerCase().trim())
                  .map((m) => {
                    const isActive = activeChannel.type === 'DIRECT' && activeChannel.recipientEmail === m.email;
                    const isOnline = onlineUsers.some((u) => u.userEmail === m.email);
                    return (
                      <button
                        key={m.email}
                        onClick={() =>
                          setActiveChannel({
                            type: 'DIRECT',
                            id: m.email,
                            name: m.name,
                            recipientEmail: m.email,
                          })
                        }
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${isActive
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                          }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <div className="relative">
                            <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-bold flex items-center justify-center border border-purple-500/30">
                              {m.name ? m.name[0].toUpperCase() : 'U'}
                            </div>
                            {isOnline && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-slate-900"></span>
                            )}
                          </div>
                          <span className="truncate">{m.name || m.email}</span>
                        </div>
                      </button>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT MAIN CHAT VIEWPORT */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-xl overflow-hidden relative">
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {activeChannel.type === 'DIRECT' ? <Users className="w-5 h-5" /> : <Hash className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <span>{activeChannel.name}</span>
                {activeChannel.type === 'DIRECT' && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${onlineUsers.some((u) => u.userEmail === activeChannel.recipientEmail)
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                  >
                    {onlineUsers.some((u) => u.userEmail === activeChannel.recipientEmail) ? 'ONLINE' : 'OFFLINE'}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">
                {activeChannel.type === 'WORKSPACE'
                  ? 'General workspace chat for all team members'
                  : activeChannel.type === 'PROJECT'
                    ? 'Project discussion channel'
                    : 'Direct message thread'}
              </p>
            </div>
          </div>
        </div>

        {/* Pinned Message Banner */}
        {pinnedMessage && (
          <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs text-amber-300 animate-in fade-in">
            <div className="flex items-center space-x-2 truncate">
              <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-bold shrink-0">Pinned Message:</span>
              <span className="truncate text-slate-200">{pinnedMessage.content}</span>
            </div>
            <button onClick={() => handleTogglePin(pinnedMessage.id)} className="text-slate-400 hover:text-slate-200">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messagesLoading ? (
            <div className="min-h-[40vh] flex items-center justify-center">
              <LoadingSpinner label="Loading conversation history..." />
            </div>
          ) : messages.length === 0 ? (
            <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-xl">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-100">Welcome to #{activeChannel.name}</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                This is the start of the #{activeChannel.name} channel conversation. Send a message to start collaborating in real-time.
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isCurrentUser = m.senderEmail?.toLowerCase().trim() === user?.email?.toLowerCase().trim();
              return (
                <div
                  key={m.id}
                  className={`flex flex-col group animate-in fade-in duration-200 ${isCurrentUser ? 'items-end' : 'items-start'
                    }`}
                >
                  {/* Sender Name, Time & Read Receipt Header */}
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 mb-1 px-1">
                    <span className="font-bold text-slate-300">{m.senderName || m.senderEmail}</span>
                    <span>•</span>
                    <span>{m.timeFormatted || 'Just now'}</span>
                    {m.edited && <span className="italic text-slate-500">(edited)</span>}
                    {m.pinned && <Pin className="w-2.5 h-2.5 text-amber-400 inline ml-1" />}

                    {/* Read Receipts for Sender */}
                    {isCurrentUser && !m.deleted && (
                      <span className="ml-1 inline-flex items-center" title={m.readBy?.length > 1 ? 'Read' : 'Sent'}>
                        {m.readBy && m.readBy.length > 1 ? (
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Check className="w-3 h-3 text-slate-400" />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Reply Parent Preview */}
                  {m.replyToContent && (
                    <div className="mb-1 p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 max-w-md flex items-center space-x-2">
                      <CornerDownRight className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="font-semibold text-slate-300">{m.replyToSender}:</span>
                      <span className="truncate">{m.replyToContent}</span>
                    </div>
                  )}

                  {/* Message Bubble Container */}
                  <div className="relative group flex items-center space-x-2 max-w-xl">
                    {/* Hover Action Menu */}
                    {!m.deleted && (
                      <div
                        className={`opacity-0 group-hover:opacity-100 transition-opacity absolute top-1/2 -translate-y-1/2 flex items-center space-x-1 p-1 bg-slate-950 border border-slate-800 rounded-xl shadow-xl z-10 ${isCurrentUser ? '-left-28' : '-right-28'
                          }`}
                      >
                        <button
                          onClick={() => setReplyToMessage(m)}
                          className="p-1 text-slate-400 hover:text-amber-400 rounded"
                          title="Reply"
                        >
                          <Reply className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleTogglePin(m.id)}
                          className="p-1 text-slate-400 hover:text-amber-400 rounded"
                          title="Pin"
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        {isCurrentUser && (
                          <>
                            <button
                              onClick={() => {
                                setEditingMessage(m);
                                setInputText(m.content);
                              }}
                              className="p-1 text-slate-400 hover:text-amber-400 rounded"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(m.id)}
                              className="p-1 text-slate-400 hover:text-rose-400 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {/* Bubble Content */}
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-lg ${m.deleted
                          ? 'bg-slate-950/60 border border-slate-800 text-slate-500 italic'
                          : isCurrentUser
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-tr-none shadow-amber-500/10'
                            : 'bg-slate-950 border border-slate-800 text-slate-100 rounded-tl-none'
                        }`}
                    >
                      <div>{m.content}</div>

                      {/* Attachment Image Preview */}
                      {m.attachmentUrl && (
                        <div className="mt-2 pt-2 border-t border-slate-800/40">
                          <img
                            src={m.attachmentUrl}
                            alt="Attachment"
                            className="max-h-48 rounded-xl object-contain border border-slate-800"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Typing Indicator Footer */}
        {typingUsers.size > 0 && (
          <div className="px-4 py-1 text-[11px] text-amber-400 italic flex items-center space-x-1.5 animate-pulse bg-slate-950/40 border-t border-slate-800/40">
            <Smile className="w-3 h-3" />
            <span>{Array.from(typingUsers).join(', ')} is typing...</span>
          </div>
        )}

        {/* Reply / Edit Banner Indicator */}
        {(replyToMessage || editingMessage) && (
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center space-x-2 truncate">
              {replyToMessage ? (
                <>
                  <Reply className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-bold text-amber-400">Replying to {replyToMessage.senderName}:</span>
                  <span className="truncate text-slate-400">{replyToMessage.content}</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-bold text-amber-400">Editing Message:</span>
                  <span className="truncate text-slate-400">{editingMessage.content}</span>
                </>
              )}
            </div>
            <button
              onClick={() => {
                setReplyToMessage(null);
                setEditingMessage(null);
                setInputText('');
              }}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Floating Message Input Composer */}
        <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 relative">
          {/* Emoji Picker Popover Drawer */}
          {showEmojiPicker && (
            <div className="absolute bottom-full left-4 mb-2 p-3 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-30 grid grid-cols-6 gap-2 w-64 animate-in fade-in">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleAddEmoji(emoji)}
                  className="p-1.5 text-lg hover:bg-slate-800 rounded-xl transition-transform hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            {/* Attachment Button */}
            <label className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-xl cursor-pointer transition-colors">
              <Paperclip className="w-4 h-4" />
              <input type="file" onChange={handleFileSelect} className="hidden" />
            </label>

            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-xl transition-colors"
            >
              <Smile className="w-4 h-4" />
            </button>

            {/* Main Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder={`Message #${activeChannel.name}...`}
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() && !attachment}
              className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
