// frontend/src/pages/dashboard/Dashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCode, 
  FaLeaf, 
  FaBolt, 
  FaChartLine,
  FaGithub,
  FaExternalLinkAlt,
  FaStar,
  FaCodeBranch,
  FaCalendarAlt
} from 'react-icons/fa';
import StatsCard from '../../components/cards/StatsCard';
import CarbonChart from '../../components/charts/CarbonCharts';
import EnergyChart from '../../components/charts/EnergyCharts';
import RepoCard from '../../components/cards/RepoCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Footer from '../../components/layout/Footer';
import dashboardService from '../../services/dashboardService';
import analyticsService from '../../services/analyticsService';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    totalProjects: 0,
    carbonScore: 0,
    energyUsage: 0,
    sustainability: 0,
    recentRepositories: [],
    energyDistribution: { ci: 0, storage: 0, network: 0 },
    isDummy: true
  });
  const [monthlyTrend, setMonthlyTrend] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [data, analyticsData] = await Promise.all([
        dashboardService.getDashboard(),
        analyticsService.getAnalytics().catch(() => ({ analytics: null }))
      ]);
      setDashboardData(data);
      setMonthlyTrend(analyticsData.analytics?.monthlyTrend || []);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setError('Failed to load dashboard data. Please try again.');
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = (repoName) => {
    navigate(`/repository?search=${encodeURIComponent(repoName)}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
        <p className="text-dark-400 mt-4 animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-red-400 text-center">
          <p className="text-xl font-semibold">Oops! Something went wrong</p>
          <p className="text-sm mt-2">{error}</p>
          <Button 
            onClick={fetchDashboardData} 
            variant="primary" 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.name || 'Developer'}! 👋
            </h1>
            <p className="text-dark-400 mt-1">
              {dashboardData.isDummy 
                ? 'Start analyzing repositories to see your carbon footprint' 
                : `You're tracking ${dashboardData.totalProjects} repositories`
              }
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button 
              variant="primary" 
              className="flex items-center gap-2"
              onClick={() => navigate('/repository')}
            >
              <FaGithub /> Analyze Repository
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Projects"
          value={dashboardData.totalProjects}
          icon={FaCode}
          change="12%"
          changeType="positive"
          subtitle={dashboardData.isDummy ? 'Start analyzing!' : 'Active repositories'}
          color="primary"
        />
        <StatsCard
          title="Carbon Score"
          value={`${dashboardData.carbonScore}%`}
          icon={FaLeaf}
          change="8%"
          changeType="positive"
          subtitle={dashboardData.carbonScore > 70 ? 'Good sustainability' : 'Needs improvement'}
          color="success"
        />
        <StatsCard
          title="Energy Usage"
          value={`${dashboardData.energyUsage} Wh`}
          icon={FaBolt}
          change="5%"
          changeType="negative"
          subtitle="Optimization needed"
          color="warning"
        />
        <StatsCard
          title="Sustainability Rating"
          value={`${dashboardData.sustainability}%`}
          icon={FaChartLine}
          change="15%"
          changeType="positive"
          subtitle={dashboardData.sustainability > 80 ? 'Excellent' : 'Good'}
          color="info"
        />
      </div>

      {/* Charts Section */}
      {dashboardData.isDummy ? (
        <Card className="text-center py-10 mb-6">
          <p className="text-dark-400">Charts will appear here once you've analyzed a few repositories.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <CarbonChart
              data={
                monthlyTrend.length > 0
                  ? {
                      labels: monthlyTrend.map((t) => t.month),
                      datasets: [
                        {
                          label: 'Sustainability Score',
                          data: monthlyTrend.map((t) => t.sustainability),
                          borderColor: '#10B981',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          fill: true,
                          tension: 0.4,
                          pointBackgroundColor: '#10B981',
                          pointBorderColor: '#10B981',
                          pointRadius: 4,
                          pointHoverRadius: 6
                        },
                        {
                          label: 'CO2 Emission (g)',
                          data: monthlyTrend.map((t) => t.carbon),
                          borderColor: '#3B82F6',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          fill: true,
                          tension: 0.4,
                          pointBackgroundColor: '#3B82F6',
                          pointBorderColor: '#3B82F6',
                          pointRadius: 4,
                          pointHoverRadius: 6,
                          borderDash: [5, 5]
                        }
                      ]
                    }
                  : undefined
              }
            />
          </div>
          <div className="lg:col-span-1">
            <EnergyChart
              data={{
                labels: ['CI/CD', 'Storage', 'Dependencies/Network'],
                datasets: [
                  {
                    data: [
                      dashboardData.energyDistribution.ci,
                      dashboardData.energyDistribution.storage,
                      dashboardData.energyDistribution.network
                    ],
                    backgroundColor: ['#EF4444', '#3B82F6', '#8B5CF6'],
                    borderColor: '#1E293B',
                    borderWidth: 2
                  }
                ]
              }}
            />
          </div>
        </div>
      )}

      {/* Recent Repositories Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            {dashboardData.isDummy ? 'Sample Repositories' : 'Recent Repositories'}
          </h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/repository')}
          >
            View All
          </Button>
        </div>

        {dashboardData.recentRepositories.length > 0 ? (
          <div className="space-y-4">
            {dashboardData.recentRepositories.map((repo, index) => (
              <RepoCard
                key={index}
                name={repo.name}
                description={`Repository by ${repo.owner}`}
                stars={repo.stars || 0}
                forks={0}
                issues={0}
                updatedAt={repo.createdAt ? new Date(repo.createdAt).toLocaleDateString() : 'Recently'}
                language={repo.language || 'Unknown'}
                languageColor="#10B981"
                onAnalyze={() => handleAnalyze(repo.name)}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <p className="text-dark-400">No repositories analyzed yet</p>
            <Button 
              variant="primary" 
              className="mt-4"
              onClick={() => navigate('/repository')}
            >
              Analyze Your First Repository
            </Button>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-primary-900/20 to-dark-800 border-primary-500/20 hover:border-primary-500/40 transition-all duration-300 cursor-pointer">
          <h4 className="text-white font-semibold mb-2">Carbon Analysis</h4>
          <p className="text-sm text-dark-400 mb-4">Analyze your codebase carbon footprint</p>
          <Button variant="primary" size="sm" className="w-full" onClick={() => navigate('/repository')}>
            Start Analysis
          </Button>
        </Card>
        <Card className="bg-gradient-to-br from-blue-900/20 to-dark-800 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 cursor-pointer">
          <h4 className="text-white font-semibold mb-2">AI Suggestions</h4>
          <p className="text-sm text-dark-400 mb-4">Get AI-powered optimization tips</p>
          <Button variant="secondary" size="sm" className="w-full" onClick={() => navigate('/ai-suggestions')}>
            View Suggestions
          </Button>
        </Card>
        <Card className="bg-gradient-to-br from-purple-900/20 to-dark-800 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 cursor-pointer">
          <h4 className="text-white font-semibold mb-2">Generate Report</h4>
          <p className="text-sm text-dark-400 mb-4">Download sustainability report</p>
          <Button variant="secondary" size="sm" className="w-full" onClick={() => navigate('/reports')}>
            Generate PDF
          </Button>
        </Card>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;