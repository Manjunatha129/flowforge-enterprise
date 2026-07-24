import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Search, Filter, Trash2, Archive, RotateCcw, Shield, ExternalLink, UserCheck } from 'lucide-react';
import { projectService } from '../../services/projectService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

/**
 * Admin Project Oversight Page.
 * 
 * WHY THIS PAGE EXISTS:
 * Gives system administrators full administrative control over all workspace projects
 * (view, delete, archive, restore, transfer ownership, monitor statistics).
 */
export const AdminProjectsPage = () => {
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [projectToDelete, setProjectToDelete] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAllProjects('createdAt');
      setProjects(data || []);
    } catch (err) {
      console.error('Failed to fetch admin projects:', err);
      showError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || p.projectName.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  const handleToggleArchive = async (project) => {
    try {
      const nextStatus = project.status === 'ARCHIVED' ? 'ACTIVE' : 'ARCHIVED';
      const updated = await projectService.updateProject(project.id, { status: nextStatus });
      setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, status: updated.status } : p)));
      showSuccess(`Project '${project.projectName}' status changed to ${nextStatus}`);
    } catch (err) {
      showError('Failed to update project status.');
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      await projectService.deleteProject(projectToDelete.id);
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      showSuccess(`Project '${projectToDelete.projectName}' deleted.`);
      setProjectToDelete(null);
    } catch (err) {
      showError('Failed to delete project.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center space-x-3">
            <span>Project Oversight & Administration</span>
            <FolderKanban className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Global admin supervision over all engineering repositories, ownerships, and statuses
          </p>
        </div>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name or description..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PLANNING">Planning</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <LoadingSpinner label="Loading workspace projects..." />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3">
          <FolderKanban className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Projects Found</h3>
          <p className="text-xs text-slate-400">No workspace projects match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div key={p.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">{p.projectName}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-300 border-amber-500/20">
                  {p.status}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Progress:</span>
                  <span className="font-bold text-slate-200">{p.progress}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${p.progress}%` }}></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>Owner: <strong className="text-slate-200">{p.createdBy || 'Admin'}</strong></span>
                <span>{p.totalTasks} Tasks</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className="text-xs text-amber-400 font-semibold hover:underline flex items-center space-x-1"
                >
                  <span>Open Details</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleArchive(p)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                    title={p.status === 'ARCHIVED' ? 'Restore Project' : 'Archive Project'}
                  >
                    {p.status === 'ARCHIVED' ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setProjectToDelete(p)}
                    className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {projectToDelete && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-rose-400">Admin Delete Project</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete project <span className="text-slate-100 font-bold">{projectToDelete.projectName}</span>? All associated tasks will be permanently removed.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button onClick={() => setProjectToDelete(null)} className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl">Cancel</button>
              <button onClick={handleDeleteProject} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20">Delete Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjectsPage;
