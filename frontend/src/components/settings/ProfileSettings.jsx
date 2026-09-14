// frontend/src/components/settings/ProfileSettings.jsx
import React, { useState, useContext, useEffect } from 'react';
import { FaUser, FaEnvelope, FaCheckCircle, FaGithub, FaFolder, FaChartLine, FaFileAlt } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import settingsService from '../../services/settingsService';
import dashboardService from '../../services/dashboardService';

const ProfileSettings = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [githubInfo, setGithubInfo] = useState({ githubUsername: null });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [stats, setStats] = useState([
    { icon: FaFolder, label: 'Repositories', value: 0 },
    { icon: FaChartLine, label: 'Analyses', value: 0 },
    { icon: FaFileAlt, label: 'Reports', value: 0 },
  ]);

  // AuthContext's user object doesn't carry GitHub connection info or
  // activity totals — fetch those separately here.
  useEffect(() => {
    settingsService.getSettings()
      .then((data) => {
        setGithubInfo({ githubUsername: data.user?.githubUsername || null });
      })
      .catch((err) => console.error('Failed to load profile settings:', err));

    dashboardService.getDashboard()
      .then((data) => {
        setStats([
          { icon: FaFolder, label: 'Repositories', value: data.totalRepositories || 0 },
          { icon: FaChartLine, label: 'Analyses', value: data.totalAnalyses ?? data.totalProjects ?? 0 },
          { icon: FaFileAlt, label: 'Reports', value: data.totalReports || 0 },
        ]);
      })
      .catch((err) => console.error('Failed to load activity stats:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
       await settingsService.updateProfile(formData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
return (
  <div className="space-y-6">

    {/* Profile Information */}
    <Card className="bg-[#111827] border border-gray-800 p-6">

      <h3 className="text-lg font-semibold text-white mb-6">
        Profile Information
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">

          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-emerald-500/20 flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="flex-1">

            <div className="flex flex-wrap items-center gap-3">

              <h2 className="text-xl font-semibold text-white">
                {user?.name}
              </h2>

              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                {user?.role || "Developer"}
              </span>

            </div>

            <p className="text-gray-400 mt-1">
              {user?.email}
            </p>

            <div className="flex items-center gap-2 mt-3">

              <FaCheckCircle
                size={14}
                className={
                  user?.isVerified
                    ? "text-emerald-400"
                    : "text-red-400"
                }
              />

              <span
                className={`text-sm ${
                  user?.isVerified
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {user?.isVerified
                  ? "Email Verified"
                  : "Email Not Verified"}
              </span>

            </div>

          </div>

        </div>

        {/* Form */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Full Name"
            required
            maxLength={50}
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            disabled
          />

        </div>

        {/* GitHub Information */}

        <div className="border border-gray-800 rounded-xl p-4 bg-gray-900/40">

          <div className="flex items-center gap-3">

            <FaGithub
              size={22}
              className="text-white"
            />

            <div>

              <h4 className="text-white font-medium">
                GitHub Account
              </h4>

              <p className="text-gray-400 text-sm">

                {githubInfo.githubUsername
                  ? `Connected as @${githubInfo.githubUsername}`
                  : "GitHub account not connected"}

              </p>

            </div>

          </div>

        </div>

        {/* Messages */}

        {success && (

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">

            {success}

          </div>

        )}

        {error && (

          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">

            {error}

          </div>

        )}

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          Save Changes
        </Button>

      </form>

    </Card>

    {/* Activity Overview */}

    <Card className="bg-[#111827] border border-gray-800 p-6">

      <h3 className="text-lg font-semibold text-white mb-5">
        Activity Overview
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {stats.map((stat, index) => (

          <div
            key={index}
            className="bg-gray-800/30 rounded-xl p-5 text-center border border-gray-800"
          >

            <stat.icon
              size={22}
              className="mx-auto mb-3 text-emerald-400"
            />

            <p className="text-2xl font-bold text-white">
              {stat.value}
            </p>

            <p className="text-sm text-gray-400 mt-1">
              {stat.label}
            </p>

          </div>

        ))}

      </div>

    </Card>

  </div>
);
};

export default ProfileSettings;