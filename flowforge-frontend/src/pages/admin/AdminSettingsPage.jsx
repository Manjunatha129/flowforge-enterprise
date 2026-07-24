import React, { useState, useEffect } from 'react';
import { Settings, Save, Shield, Lock, Bell, Mail, Clock, AlertTriangle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

/**
 * Admin System Settings Page.
 * 
 * WHY THIS PAGE EXISTS:
 * Controls global platform settings (Application Name, Company Branding, Timezone,
 * JWT Expiration, Session Timeout, Password Policy, Maintenance Mode).
 */
export const AdminSettingsPage = () => {
  const { showSuccess, showError } = useToast();

  const [settings, setSettings] = useState({
    applicationName: 'FlowForge SaaS',
    companyName: 'FlowForge Technologies Inc.',
    logoUrl: '/assets/logo.png',
    theme: 'DARK',
    timezone: 'UTC+05:30',
    emailSender: 'noreply@FlowForge.dev',
    jwtExpirationHours: 24,
    sessionTimeoutMinutes: 60,
    passwordPolicy: 'Minimum 8 characters, at least 1 uppercase, 1 number',
    maintenanceMode: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await adminService.getSettings();
        if (data) setSettings(data);
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await adminService.updateSettings(settings);
      setSettings(updated);
      showSuccess('Global system settings updated successfully.');
    } catch (err) {
      showError('Failed to update system settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner label="Loading system settings..." />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center space-x-3">
            <span>System Configuration & Policy Settings</span>
            <Settings className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Global application branding, security token timeouts, session policies, and maintenance control
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Application & Branding Settings */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Platform & Company Branding</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Application Name</label>
              <input
                type="text"
                value={settings.applicationName}
                onChange={(e) => handleChange('applicationName', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Timezone</label>
              <input
                type="text"
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Security & Authentication Policies */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Security & Token Policies</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">JWT Expiration (Hours)</label>
              <input
                type="number"
                value={settings.jwtExpirationHours}
                onChange={(e) => handleChange('jwtExpirationHours', parseInt(e.target.value) || 24)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Session Timeout (Minutes)</label>
              <input
                type="number"
                value={settings.sessionTimeoutMinutes}
                onChange={(e) => handleChange('sessionTimeoutMinutes', parseInt(e.target.value) || 60)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password Policy Description</label>
              <input
                type="text"
                value={settings.passwordPolicy}
                onChange={(e) => handleChange('passwordPolicy', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Mode Card */}
      <div className="p-6 bg-slate-900 border border-amber-500/30 rounded-2xl flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">Maintenance Mode Override</h4>
            <p className="text-xs text-slate-400 mt-0.5">Restrict non-admin user logins while undergoing platform updates.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${settings.maintenanceMode
              ? 'bg-rose-500 text-white border-rose-500'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
        >
          {settings.maintenanceMode ? 'Maintenance ENABLED' : 'Maintenance Disabled'}
        </button>
      </div>
    </form>
  );
};

export default AdminSettingsPage;
