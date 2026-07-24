import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Shield,
  Building2,
  Bell,
  Palette,
  Trash2,
  Camera,
  Save,
  Key,
  Eye,
  EyeOff,
  Download,
  AlertTriangle,
  Lock,
  CheckCircle,
  Loader2,
  X,
  Smartphone,
  Globe,
  Clock,
  Sparkles,
} from 'lucide-react';
import { profileService } from '../services/profileService';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

/**
 * User Profile & Account Settings Hub Page.
 * 
 * WHY THIS PAGE EXISTS:
 * Serves as the comprehensive settings portal for profile details, avatar uploads, security controls,
 * workspace settings, notification toggles, theme/accent preferences, and account destruction.
 */
export const ProfilePage = () => {
  const { user: authUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showSuccess, showError, showInfo } = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Security Form State
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Delete Account Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePasswordInput, setDeletePasswordInput] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err) {
      console.error('Failed to load user profile:', err);
      showError('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await profileService.updateProfile({
        name: profile.name,
        bio: profile.bio,
        phoneNumber: profile.phoneNumber,
        designation: profile.designation,
        department: profile.department,
        location: profile.location,
        timezone: profile.timezone,
      });
      setProfile(updated);
      showSuccess('Profile information updated successfully.');
    } catch (err) {
      showError('Failed to update profile info.');
    } finally {
      setSaving(false);
    }
  };

  // Avatar Image Upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showError('Image file size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = reader.result;
        const updated = await profileService.uploadAvatar(base64);
        setProfile(updated);
        showSuccess('Profile picture updated successfully.');
      } catch (err) {
        showError('Failed to upload profile picture.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarDelete = async () => {
    try {
      const updated = await profileService.deleteAvatar();
      setProfile(updated);
      showSuccess('Profile picture removed.');
    } catch (err) {
      showError('Failed to remove profile picture.');
    }
  };

  // Change Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showError('Please fill in both current and new password fields.');
      return;
    }
    try {
      setSaving(true);
      await profileService.changePassword(passwordForm);
      showSuccess('Password updated successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      showError(err.response?.data?.message || 'Password update failed. Verify current password.');
    } finally {
      setSaving(false);
    }
  };

  // Workspace Settings Submit
  const handleWorkspaceSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await profileService.updateWorkspace({
        workspaceName: profile.workspaceName,
        workspaceDescription: profile.workspaceDescription,
        defaultLanguage: profile.defaultLanguage,
        dateFormat: profile.dateFormat,
        timeFormat: profile.timeFormat,
        currency: profile.currency,
      });
      setProfile(updated);
      showSuccess('Workspace settings saved.');
    } catch (err) {
      showError('Failed to save workspace settings.');
    } finally {
      setSaving(false);
    }
  };

  // Notification Preferences Toggle
  const handleNotificationToggle = async (key) => {
    const nextVal = !profile[key];
    const updatedState = { ...profile, [key]: nextVal };
    setProfile(updatedState);

    try {
      await profileService.updateNotifications({
        emailNotifications: updatedState.emailNotifications,
        pushNotifications: updatedState.pushNotifications,
        browserNotifications: updatedState.browserNotifications,
        projectUpdateAlerts: updatedState.projectUpdateAlerts,
        taskAssignmentAlerts: updatedState.taskAssignmentAlerts,
        dueDateAlerts: updatedState.dueDateAlerts,
        weeklySummary: updatedState.weeklySummary,
        monthlySummary: updatedState.monthlySummary,
      });
      showInfo('Notification preference saved.');
    } catch (err) {
      showError('Failed to update notification toggle.');
    }
  };

  // Appearance Preferences Update
  const handleAppearanceChange = async (key, val) => {
    const updatedState = { ...profile, [key]: val };
    setProfile(updatedState);

    if (key === 'themePreference' && val !== 'SYSTEM') {
      if ((val === 'LIGHT' && theme === 'dark') || (val === 'DARK' && theme === 'light')) {
        toggleTheme();
      }
    }

    try {
      await profileService.updateAppearance({
        themePreference: updatedState.themePreference,
        accentColor: updatedState.accentColor,
        layoutMode: updatedState.layoutMode,
      });
      showSuccess('Appearance settings saved.');
    } catch (err) {
      showError('Failed to save appearance settings.');
    }
  };

  // Export Account Data
  const handleExportData = async () => {
    try {
      await profileService.exportData();
      showSuccess('Personal account data JSON downloaded.');
    } catch (err) {
      showError('Failed to export account data.');
    }
  };

  // Deactivate Account
  const handleDeactivate = async () => {
    try {
      await profileService.deactivateAccount();
      showInfo('Account deactivated. Logging out...');
      setTimeout(() => logout(), 1500);
    } catch (err) {
      showError('Failed to deactivate account.');
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    try {
      await profileService.deleteAccount(deletePasswordInput);
      showSuccess('Account permanently deleted.');
      logout();
    } catch (err) {
      showError('Account deletion failed. Verify password.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner label="Loading account profile & settings..." />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: UserIcon },
    { id: 'security', label: 'Account Security', icon: Shield },
    { id: 'workspace', label: 'Workspace Settings', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'account', label: 'Account Management', icon: Lock },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center space-x-3">
            <span>Account & Workspace Settings</span>
            <UserIcon className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your personal profile, credentials, workspace configuration, preferences, and security settings
          </p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center space-x-1 border-b border-slate-800 overflow-x-auto pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. MY PROFILE TAB */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {/* Avatar Upload Header Card */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 shadow-xl">
            <div className="relative group">
              {profile?.profilePictureUrl ? (
                <img
                  src={profile.profilePictureUrl}
                  alt="Profile Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-amber-500 shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-amber-500/20 text-amber-300 font-black text-2xl flex items-center justify-center border-2 border-amber-500/40 shadow-xl">
                  {profile?.name?.[0] || 'U'}
                </div>
              )}

              <label className="absolute bottom-0 right-0 p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full cursor-pointer transition-transform shadow-lg hover:scale-110">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-lg font-bold text-slate-100">{profile?.name}</h3>
              <p className="text-xs text-slate-400">{profile?.email}</p>
              <div className="flex items-center justify-center sm:justify-start space-x-3 pt-1">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase">
                  {profile?.role}
                </span>
                {profile?.profilePictureUrl && (
                  <button
                    type="button"
                    onClick={handleAvatarDelete}
                    className="text-xs text-rose-400 hover:underline font-semibold"
                  >
                    Remove Avatar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Fields Grid */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3">Personal Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Display Name</label>
                <input
                  type="text"
                  required
                  value={profile?.name || ''}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address (Read-Only)</label>
                <input
                  type="email"
                  disabled
                  value={profile?.email || ''}
                  className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Job Title / Designation</label>
                <input
                  type="text"
                  value={profile?.designation || ''}
                  onChange={(e) => handleProfileChange('designation', e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Department</label>
                <input
                  type="text"
                  value={profile?.department || ''}
                  onChange={(e) => handleProfileChange('department', e.target.value)}
                  placeholder="e.g. Core Architecture Team"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profile?.phoneNumber || ''}
                  onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                  placeholder="e.g. +1 (555) 019-2834"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Location</label>
                <input
                  type="text"
                  value={profile?.location || ''}
                  onChange={(e) => handleProfileChange('location', e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Personal Bio</label>
                <textarea
                  rows={3}
                  value={profile?.bio || ''}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  placeholder="Brief overview of your engineering background and goals..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 2. ACCOUNT SECURITY TAB */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <form onSubmit={handlePasswordSubmit} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Change Password</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full pl-3.5 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">New Password (min 6 chars)</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full pl-3.5 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2"
              >
                <Key className="w-4 h-4" />
                <span>{saving ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>

          {/* Active Sessions Overview */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Active Login Sessions</span>
            </h3>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">Current Web Session</div>
                  <div className="text-[10px] text-slate-400">Chrome on Windows • Last active now</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. WORKSPACE SETTINGS TAB */}
      {activeTab === 'workspace' && (
        <form onSubmit={handleWorkspaceSubmit} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-purple-400" />
            <span>Workspace Metadata & Formats</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Workspace Name</label>
              <input
                type="text"
                value={profile?.workspaceName || ''}
                onChange={(e) => handleProfileChange('workspaceName', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Default Currency</label>
              <select
                value={profile?.currency || 'USD ($)'}
                onChange={(e) => handleProfileChange('currency', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
                <option value="INR (₹)">INR (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Date Format</label>
              <select
                value={profile?.dateFormat || 'YYYY-MM-DD'}
                onChange={(e) => handleProfileChange('dateFormat', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Time Format</label>
              <select
                value={profile?.timeFormat || '24-Hour'}
                onChange={(e) => handleProfileChange('timeFormat', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="24-Hour">24-Hour (14:30)</option>
                <option value="12-Hour">12-Hour (02:30 PM)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Workspace Description</label>
              <textarea
                rows={2}
                value={profile?.workspaceDescription || ''}
                onChange={(e) => handleProfileChange('workspaceDescription', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Workspace Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 4. NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center space-x-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Notification & Alert Controls</span>
          </h3>

          <div className="space-y-3">
            {[
              { key: 'emailNotifications', title: 'Email Notifications', desc: 'Receive alert digests via email.' },
              { key: 'pushNotifications', title: 'Push Notifications', desc: 'Real-time push alerts on mobile devices.' },
              { key: 'browserNotifications', title: 'Browser Notifications', desc: 'Desktop popups for active workspace events.' },
              { key: 'projectUpdateAlerts', title: 'Project Updates', desc: 'Alerts when projects change status or milestone.' },
              { key: 'taskAssignmentAlerts', title: 'Task Assignment Alerts', desc: 'Notify immediately when assigned a new task.' },
              { key: 'dueDateAlerts', title: 'Due Date Warnings', desc: 'Reminders 24 hours before task deadline.' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-slate-100">{item.title}</div>
                  <div className="text-[10px] text-slate-400">{item.desc}</div>
                </div>

                <button
                  type="button"
                  onClick={() => handleNotificationToggle(item.key)}
                  className={`w-11 h-6 rounded-full transition-colors relative border ${
                    profile?.[item.key] ? 'bg-amber-500 border-amber-400' : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      profile?.[item.key] ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  ></span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. APPEARANCE TAB */}
      {activeTab === 'appearance' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Theme & Accent Customization</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Theme Mode</label>
              <div className="grid grid-cols-3 gap-3">
                {['DARK', 'LIGHT', 'SYSTEM'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleAppearanceChange('themePreference', t)}
                    className={`p-4 rounded-xl border text-xs font-bold transition-all ${
                      profile?.themePreference === t
                        ? 'bg-amber-500/15 border-amber-500 text-amber-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Accent Color Token</label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: 'ORANGE', color: 'bg-amber-500 border-amber-400' },
                  { name: 'EMERALD', color: 'bg-emerald-500 border-emerald-400' },
                  { name: 'PURPLE', color: 'bg-purple-500 border-purple-400' },
                  { name: 'ROSE', color: 'bg-rose-500 border-rose-400' },
                ].map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleAppearanceChange('accentColor', c.name)}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center space-x-2 transition-all ${
                      profile?.accentColor === c.name
                        ? 'bg-slate-800 border-amber-500 text-slate-100'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${c.color}`}></span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. ACCOUNT MANAGEMENT TAB */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          {/* Export Data */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Export Personal Data</h4>
                <p className="text-xs text-slate-400 mt-0.5">Download complete JSON archive of profile, activity, and preferences.</p>
              </div>
            </div>

            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition-all"
            >
              Export Data JSON
            </button>
          </div>

          {/* Deactivate Account */}
          <div className="p-6 bg-slate-900 border border-amber-500/30 rounded-2xl flex items-center justify-between shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Deactivate Account</h4>
                <p className="text-xs text-slate-400 mt-0.5">Temporarily disable your profile and logout from all active sessions.</p>
              </div>
            </div>

            <button
              onClick={handleDeactivate}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-all"
            >
              Deactivate Account
            </button>
          </div>

          {/* Delete Account */}
          <div className="p-6 bg-slate-900 border border-rose-500/30 rounded-2xl flex items-center justify-between shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-400">Permanently Delete Account</h4>
                <p className="text-xs text-slate-400 mt-0.5">Irreversible action. Deletes profile, preferences, and workspace credentials.</p>
              </div>
            </div>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition-all"
            >
              Delete Account
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-rose-400">Confirm Account Deletion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete your account? Enter your current password to confirm deletion.
            </p>

            <input
              type="password"
              placeholder="Enter your password..."
              value={deletePasswordInput}
              onChange={(e) => setDeletePasswordInput(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-rose-500"
            />

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
