import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Shield,
  UserCheck,
  UserX,
  Key,
  Trash2,
  Lock,
  UserPlus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  X,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

/**
 * Admin User Management Page.
 * 
 * WHY THIS PAGE EXISTS:
 * Gives system administrators full control over user accounts (search, role promotion/demotion,
 * activate/deactivate, password reset, delete account, view projects & tasks owned).
 */
export const AdminUsersPage = () => {
  const { showSuccess, showError } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals State
  const [selectedUserForProfile, setSelectedUserForProfile] = useState(null);
  const [userForPasswordReset, setUserForPasswordReset] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers(searchQuery, roleFilter, statusFilter);
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to fetch users list:', err);
      showError('Failed to load users list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  // Client-side search filtering
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && u.enabled) ||
        (statusFilter === 'INACTIVE' && !u.enabled);

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Handlers
  const handleToggleRole = async (user) => {
    try {
      const nextRole = user.role === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
      const updated = await adminService.updateRole(user.id, nextRole);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: updated.role } : u)));
      showSuccess(`User ${user.email} updated to ${nextRole}`);
    } catch (err) {
      showError('Failed to update user role.');
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const updated = await adminService.toggleStatus(user.id);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, enabled: updated.enabled } : u)));
      showSuccess(`User ${user.email} status toggled.`);
    } catch (err) {
      showError('Failed to toggle user status.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPasswordInput || newPasswordInput.length < 6) {
      showError('Password must be at least 6 characters.');
      return;
    }
    try {
      await adminService.resetPassword(userForPasswordReset.id, newPasswordInput);
      showSuccess(`Password reset successfully for ${userForPasswordReset.email}`);
      setUserForPasswordReset(null);
      setNewPasswordInput('');
    } catch (err) {
      showError('Failed to reset password.');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await adminService.deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      showSuccess(`User account ${userToDelete.email} deleted.`);
      setUserToDelete(null);
    } catch (err) {
      showError('Failed to delete user.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center space-x-3">
            <span>User Account Management</span>
            <Users className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage user accounts, promote administrators, toggle active statuses, and audit security credentials
          </p>
        </div>
      </div>

      {/* Control Bar: Search & Filter Dropdowns */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="ROLE_ADMIN">ROLE_ADMIN</option>
              <option value="ROLE_USER">ROLE_USER</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Accounts</option>
              <option value="INACTIVE">Deactivated Accounts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <LoadingSpinner label="Loading user directory..." />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Users Found</h3>
          <p className="text-xs text-slate-400">No registered accounts match your current search or filter query.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">User Profile</th>
                  <th className="py-3.5 px-4">Role Authority</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Workload Metrics</th>
                  <th className="py-3.5 px-4">Last Login</th>
                  <th className="py-3.5 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* User Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-extrabold text-xs">
                          {user.avatar || 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-100 flex items-center space-x-1.5">
                            <span>{user.name}</span>
                            {user.online && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
                          </div>
                          <div className="text-[11px] text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role Authority */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          user.role === 'ROLE_ADMIN'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        <span>{user.role}</span>
                      </span>
                    </td>

                    {/* Account Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                          user.enabled
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {user.enabled ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{user.enabled ? 'Active' : 'Deactivated'}</span>
                      </span>
                    </td>

                    {/* Workload Metrics */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 font-medium">
                        {user.ownedProjectsCount} Projects • {user.assignedTasksCount} Tasks
                      </div>
                    </td>

                    {/* Last Login */}
                    <td className="py-3.5 px-4 text-slate-400">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
                    </td>

                    {/* Admin Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedUserForProfile(user)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleRole(user)}
                          className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/20 transition-colors"
                          title={user.role === 'ROLE_ADMIN' ? 'Demote to USER' : 'Promote to ADMIN'}
                        >
                          <Shield className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            user.enabled
                              ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                          }`}
                          title={user.enabled ? 'Deactivate Account' : 'Activate Account'}
                        >
                          {user.enabled ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => setUserForPasswordReset(user)}
                          className="p-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/20 transition-colors"
                          title="Reset Password"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setUserToDelete(user)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 transition-colors"
                          title="Delete Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Profile Detail View Modal */}
      {selectedUserForProfile && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 font-bold text-sm flex items-center justify-center border border-amber-500/30">
                  {selectedUserForProfile.avatar}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">{selectedUserForProfile.name}</h3>
                  <p className="text-xs text-slate-400">{selectedUserForProfile.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUserForProfile(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Security Role:</span>
                <span className="font-bold text-amber-400">{selectedUserForProfile.role}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Account Status:</span>
                <span className={selectedUserForProfile.enabled ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {selectedUserForProfile.enabled ? 'Active' : 'Deactivated'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Registration Date:</span>
                <span className="text-slate-200">
                  {selectedUserForProfile.createdAt ? new Date(selectedUserForProfile.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Last Login:</span>
                <span className="text-slate-200">
                  {selectedUserForProfile.lastLoginAt ? new Date(selectedUserForProfile.lastLoginAt).toLocaleString() : 'Never'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Owned Projects:</span>
                <span className="font-bold text-slate-100">{selectedUserForProfile.ownedProjectsCount}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedUserForProfile(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {userForPasswordReset && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleResetPassword} className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100">Reset User Password</h3>
              <button type="button" onClick={() => setUserForPasswordReset(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Enter a new password for account <span className="text-amber-400 font-semibold">{userForPasswordReset.email}</span>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                placeholder="Enter new password (min 6 chars)..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setUserForPasswordReset(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete User Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-rose-400">Delete User Account</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete user <span className="text-slate-100 font-bold">{userToDelete.email}</span>? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-rose-600/20"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
