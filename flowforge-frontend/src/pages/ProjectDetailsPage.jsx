import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectHeader } from '../components/project-details/ProjectHeader';
import { ProjectOverviewCards } from '../components/project-details/ProjectOverviewCards';
import { ProjectProgressSection } from '../components/project-details/ProjectProgressSection';
import { TeamMembersSection } from '../components/project-details/TeamMembersSection';
import { ProjectDescriptionCard } from '../components/project-details/ProjectDescriptionCard';
import { ProjectTimeline } from '../components/project-details/ProjectTimeline';
import { ProjectFilesSection } from '../components/project-details/ProjectFilesSection';
import { ProjectQuickActions } from '../components/project-details/ProjectQuickActions';
import { ProjectModal } from '../components/projects/ProjectModal';
import { DeleteConfirmModal } from '../components/projects/DeleteConfirmModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { projectDetailsService } from '../services/projectDetailsService';
import { projectService } from '../services/projectService';
import { useToast } from '../context/ToastContext';

export const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await projectDetailsService.getProjectDetails(projectId);
      setDetails(data);
    } catch (err) {
      console.error('Failed to load project details', err);
      showError('Failed to load project details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [projectId]);

  // Handlers
  const handleEditProject = async (payload) => {
    const updated = await projectService.updateProject(projectId, payload);
    setDetails((prev) => ({
      ...prev,
      project: { ...prev.project, ...updated },
    }));
  };

  const handleArchiveProject = async () => {
    await projectService.updateProject(projectId, { status: 'ARCHIVED' });
    setDetails((prev) => ({
      ...prev,
      project: { ...prev.project, status: 'ARCHIVED' },
    }));
    showSuccess('Project archived.');
  };

  const handleConfirmDelete = async () => {
    await projectService.deleteProject(projectId);
    showSuccess('Project deleted.');
    navigate('/projects');
  };

  const handleAddMember = async (memberData) => {
    const newMember = await projectDetailsService.addMember(projectId, memberData);
    setDetails((prev) => ({
      ...prev,
      teamMembers: [...(prev.teamMembers || []), newMember],
      activities: [
        {
          id: Date.now().toString(),
          activity: `added member ${newMember.name} to project team`,
          userName: 'System Admin',
          userAvatar: 'SA',
          statusBadge: 'Member Added',
          timeAgo: 'Just now',
        },
        ...(prev.activities || []),
      ],
    }));
  };

  const handleRemoveMember = async (memberId) => {
    await projectDetailsService.removeMember(projectId, memberId);
    setDetails((prev) => ({
      ...prev,
      teamMembers: (prev.teamMembers || []).filter((m) => m.id !== memberId && m.avatar !== memberId),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner label="Loading project overview & metrics..." />
      </div>
    );
  }

  if (!details || !details.project) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold text-white">Project Not Found</h2>
        <p className="text-slate-400 text-sm">The requested project repository does not exist or has been deleted.</p>
        <button
          onClick={() => navigate('/projects')}
          className="px-4 py-2 bg-brand-600 text-white font-semibold text-xs rounded-xl"
        >
          Return to Projects Workspace
        </button>
      </div>
    );
  }

  const { project, activities, teamMembers } = details;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Top Header Banner & Action Toolbar */}
      <ProjectHeader
        project={project}
        onEdit={() => setIsEditModalOpen(true)}
        onArchive={handleArchiveProject}
        onDelete={() => setIsDeleteModalOpen(true)}
      />

      {/* 2. Project Overview 8 Metrics Cards */}
      <ProjectOverviewCards project={project} details={details} />

      {/* 3. Project Quick Shortcuts */}
      <ProjectQuickActions onAddMember={handleAddMember} />

      {/* 4. Two-Column Detailed Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          <ProjectProgressSection project={project} />
          <ProjectDescriptionCard project={project} />
          <TeamMembersSection
            members={teamMembers}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
          />
          <ProjectFilesSection />
        </div>

        {/* Right 1 Column */}
        <div className="space-y-8">
          <ProjectTimeline activities={activities} />
        </div>
      </div>

      {/* Edit Modal */}
      <ProjectModal
        isOpen={isEditModalOpen}
        project={project}
        onClose={() => setIsEditModalOpen(false)}
        onSubmitSuccess={handleEditProject}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        project={project}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default ProjectDetailsPage;
