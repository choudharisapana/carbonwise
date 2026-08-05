// frontend/src/pages/settings/Settings.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaUser, FaBell, FaPalette, FaShieldAlt, FaGlobe, FaDatabase, FaSave, FaGithub, FaCheckCircle } from 'react-icons/fa';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { ThemeContext } from '../../context/ThemeContext';
import githubOAuthService from '../../services/githubOAuthService';

const Settings = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const [githubStatus, setGithubStatus] = useState({ connected: false, githubUsername: null });
  const [githubLoading, setGithubLoading] = useState(true);
  const [githubMessage, setGithubMessage] = useState('');

  const fetchGithubStatus = async () => {
    try {
      const data = await githubOAuthService.getStatus();
      setGithubStatus(data);
    } catch (error) {
      console.error('Failed to fetch GitHub status:', error);
    } finally {
      setGithubLoading(false);
    }
  };

  useEffect(() => {
    fetchGithubStatus();

    // After GitHub redirects back to /settings?github=connected or error
    const githubResult = searchParams.get('github');
    if (githubResult === 'connected') {
      setGithubMessage('✅ GitHub account connected successfully!');
    } else if (githubResult === 'error') {
      setGithubMessage('❌ Failed to connect GitHub account. Please try again.');
    }
  }, [searchParams]);

  const handleGithubConnect = () => {
    githubOAuthService.connect();
  };

  const handleGithubDisconnect = async () => {
    try {
      await githubOAuthService.disconnect();
      setGithubStatus({ connected: false, githubUsername: null });
      setGithubMessage('GitHub account disconnected');
    } catch (error) {
      setGithubMessage('Failed to disconnect. Please try again.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'appearance', label: 'Appearance', icon: FaPalette },
    { id: 'security', label: 'Security', icon: FaShieldAlt },
    { id: 'integration', label: 'Integrations', icon: FaGlobe },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Settings updated successfully!');
    }, 1500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" loading={loading}>
                <FaSave className="mr-2" /> Save Changes
              </Button>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </div>
          </form>
        );

      case 'security':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="New Password"
                name="newPassword"
                type="password"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" loading={loading}>
                <FaSave className="mr-2" /> Update Password
              </Button>
            </div>
          </form>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-dark-700">
              <div>
                <h4 className="text-white font-medium">Email Notifications</h4>
                <p className="text-sm text-dark-400">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-dark-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-dark-700">
              <div>
                <h4 className="text-white font-medium">Push Notifications</h4>
                <p className="text-sm text-dark-400">Get real-time alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-dark-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-3">Theme</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['dark', 'light'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === t
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-700 hover:border-dark-500'
                    }`}
                  >
                    <div className="text-white font-medium capitalize">{t}</div>
                  </button>
                ))}
              </div>
              {theme === 'light' && (
                <p className="text-xs text-amber-400 mt-2">
                  Your preference is saved, but the light theme UI is still being designed — the app will keep showing dark mode for now.
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-3">Color Scheme</label>
              <div className="flex gap-4">
                {['#10B981', '#3B82F6', '#8B5CF6', '#EF4444'].map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full transition-all hover:scale-110 ${
                      color === '#10B981' ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-900' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'integration':
        return (
          <div className="space-y-4">
            {githubMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-xl text-sm">
                {githubMessage}
              </div>
            )}
            <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-dark-700">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-dark-700 rounded-full flex items-center justify-center">
                  <FaGithub className="text-primary-500" />
                </div>
                <div>
                  <h4 className="text-white font-medium">GitHub Integration</h4>
                  {githubLoading ? (
                    <p className="text-sm text-dark-400">Checking connection...</p>
                  ) : githubStatus.connected ? (
                    <p className="text-sm text-green-400 flex items-center gap-1">
                      <FaCheckCircle size={12} /> Connected as @{githubStatus.githubUsername}
                    </p>
                  ) : (
                    <p className="text-sm text-dark-400">Connect to analyze your private repositories</p>
                  )}
                </div>
              </div>
              {githubLoading ? null : githubStatus.connected ? (
                <Button variant="outline" size="sm" onClick={handleGithubDisconnect}>Disconnect</Button>
              ) : (
                <Button variant="outline" size="sm" onClick={handleGithubConnect}>Connect</Button>
              )}
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-dark-700">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-dark-700 rounded-full flex items-center justify-center">
                  <FaDatabase className="text-primary-500" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Data Export</h4>
                  <p className="text-sm text-dark-400">Export your carbon data</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-dark-400 mt-1">Manage your account preferences and integrations</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <Card className="p-2 sticky top-20">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
                      : 'text-dark-400 hover:bg-dark-800 hover:text-white'
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          <Card>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white">
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
              <p className="text-sm text-dark-400 mt-1">
                Configure your {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} settings
              </p>
            </div>
            <div className="border-t border-dark-700 pt-6">
              {renderContent()}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;