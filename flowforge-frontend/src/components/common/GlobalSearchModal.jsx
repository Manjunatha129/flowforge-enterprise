import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  FolderKanban,
  CheckSquare,
  MessageSquare,
  FileText,
  User,
  X,
  Sparkles,
  Command,
  ArrowRight,
} from 'lucide-react';
import { searchService } from '../../services/searchService';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * Command Palette Global Search Modal Component.
 * 
 * WHY THIS COMPONENT EXISTS:
 * Serves as the central ⌘K search palette scanning across Projects, Tasks, Messages, Files, and Team Members.
 */
export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Keyboard shortcut listener for ⌘K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search trigger
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await searchService.searchGlobal(query.trim());
        setResults(res);
      } catch (err) {
        console.error('Global search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectResult = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-start justify-center pt-20 p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-900/90">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tasks, chat messages, files, and users... (⌘K)"
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center space-x-1 text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
            <span>ESC</span>
          </kbd>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Viewport */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner label="Searching workspace..." />
            </div>
          ) : !results || results.totalMatches === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto opacity-50" />
              <div className="text-sm font-bold text-slate-200">
                {query ? 'No matching workspace records found' : 'Type to search workspace resources'}
              </div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Search across all Projects, Tasks, Messages, Files, and Team Members.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Projects */}
              {results.projects?.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase text-amber-400 px-2 mb-2 flex items-center space-x-1.5">
                    <FolderKanban className="w-3.5 h-3.5" />
                    <span>Projects ({results.projects.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.projects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectResult(`/projects/${p.id}`)}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-amber-500/40 text-left flex items-center justify-between transition-all group"
                      >
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-200 group-hover:text-amber-400 truncate">
                            {p.projectName}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">{p.description}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {results.tasks?.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase text-purple-400 px-2 mb-2 flex items-center space-x-1.5">
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Tasks ({results.tasks.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.tasks.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleSelectResult('/tasks')}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-purple-500/40 text-left flex items-center justify-between transition-all group"
                      >
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-200 group-hover:text-purple-400 truncate">
                            {t.title}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            Status: {t.status} • Assigned: {t.assignedUser || 'Unassigned'}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              {results.chatMessages?.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase text-emerald-400 px-2 mb-2 flex items-center space-x-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat Messages ({results.chatMessages.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.chatMessages.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleSelectResult('/chat')}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-emerald-500/40 text-left flex items-center justify-between transition-all group"
                      >
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 truncate">
                            {m.senderName}: {m.content}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">Channel: #{m.channelType}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Files */}
              {results.files?.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase text-cyan-400 px-2 mb-2 flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Files ({results.files.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.files.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => handleSelectResult('/projects')}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-cyan-500/40 text-left flex items-center justify-between transition-all group"
                      >
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 truncate">
                            {f.fileName}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">Size: {f.fileSize}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {results.users?.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase text-rose-400 px-2 mb-2 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Users ({results.users.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleSelectResult('/admin/users')}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-rose-500/40 text-left flex items-center justify-between transition-all group"
                      >
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-200 group-hover:text-rose-400 truncate">
                            {u.name} ({u.email})
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">Role: {u.role}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-rose-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
