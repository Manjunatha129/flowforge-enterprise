import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, Plus, FolderPlus } from 'lucide-react';
import { ProjectStatsGrid } from '../components/projects/ProjectStatsGrid';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectModal } from '../components/projects/ProjectModal';
import { DeleteConfirmModal } from '../components/projects/DeleteConfirmModal';
import { ProjectEmptyState } from '../components/projects/ProjectEmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { projectService } from '../services/projectService';
import { useToast } from '../context/ToastContext';

export const ProjectsPage = () => {
  const { showSuccess, showError } = useToast();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null); // Edit mode target
  const [projectToDelete, setProjectToDelete] = useState(null); // Delete target

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAllProjects(sortBy);
      setProjects(data || []);
    } catch (err) {
      console.error('Failed to fetch projects', err);
      showError('Failed to load projects list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [sortBy]);

  // Client-side Instant Filter & Search Processing
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Search check
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.projectName.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query));

      // Status check
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

      // Priority check
      const matchesPriority = priorityFilter === 'ALL' || p.priority === priorityFilter;

      // Category check
      const matchesCategory =
        categoryFilter === 'ALL' || (p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [projects, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  // Handlers
  const handleOpenCreateModal = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj) => {
    setSelectedProject(proj);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (proj) => {
    setProjectToDelete(proj);
  };

  const handleSaveProject = async (payload, existingId) => {
    if (existingId) {
      const updated = await projectService.updateProject(existingId, payload);
      setProjects((prev) => prev.map((p) => (p.id === existingId ? { ...p, ...updated } : p)));
    } else {
      const created = await projectService.createProject(payload);
      setProjects((prev) => [created, ...prev]);
    }
  };

  const handleConfirmDelete = async (id) => {
    await projectService.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
            Projects Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage, monitor, and deliver engineering repositories and team milestones
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-semibold text-xs rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create Project</span>
        </button>
      </div>

      {/* Project Statistics Cards Summary */}
      <ProjectStatsGrid projects={projects} />

      {/* Search & Filter & Sort Control Bar */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name or description..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Dropdowns: Filter & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-brand-400" />
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

          {/* Priority Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="createdAt">Sort: Created Date</option>
              <option value="name">Sort: Project Name</option>
              <option value="dueDate">Sort: Due Date</option>
              <option value="progress">Sort: Completion Progress</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Cards Grid / Loading / Empty State */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <LoadingSpinner label="Loading projects workspace..." />
        </div>
      ) : filteredProjects.length === 0 ? (
        <ProjectEmptyState onCreateNew={handleOpenCreateModal} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={(p) => navigate(`/projects/${p.id}`)}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Project Form Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        project={selectedProject}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={handleSaveProject}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!projectToDelete}
        project={projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default ProjectsPage;
