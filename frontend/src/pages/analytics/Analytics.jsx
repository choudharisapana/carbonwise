// frontend/src/pages/analytics/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { FaChartLine, FaLeaf, FaClipboardList, FaBolt } from 'react-icons/fa';
import StatsCard from '../../components/Cards/StatsCard';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import CarbonChart from '../../components/charts/CarbonCharts';
import analyticsService from '../../services/analyticsService';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await analyticsService.getAnalytics();
        setAnalytics(data.analytics);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader size="lg" />
        <p className="text-dark-400 mt-4">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  const hasData = analytics && analytics.totalAnalysis > 0;

  // Build chart data from real monthlyTrend records
  const chartData = hasData
    ? {
        labels: analytics.monthlyTrend.map((t) => t.month),
        datasets: [
          {
            label: 'Sustainability Score',
            data: analytics.monthlyTrend.map((t) => t.sustainability),
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
            data: analytics.monthlyTrend.map((t) => t.carbon),
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
    : undefined;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Analytics</h1>
        <p className="text-dark-400 mt-1">
          A summary of sustainability trends across all your analyzed repositories
        </p>
      </div>

      {!hasData ? (
        <Card>
          <div className="text-center py-12">
            <FaChartLine className="text-5xl text-dark-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No analytics yet</h3>
            <p className="text-dark-400 text-sm">
              Analyze a repository first — your sustainability trends will show up here.
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatsCard
              title="Total Analyses"
              value={analytics.totalAnalysis}
              icon={FaClipboardList}
              color="info"
              subtitle="Repositories analyzed so far"
            />
            <StatsCard
              title="Avg. Sustainability Score"
              value={`${analytics.sustainabilityAverage}/100`}
              icon={FaLeaf}
              color="success"
              subtitle="Across all analyses"
            />
            <StatsCard
              title="Avg. CO2 Emission"
              value={`${analytics.carbonAverage} g`}
              icon={FaBolt}
              color="warning"
              subtitle="Per analysis, estimated"
            />
          </div>

          <CarbonChart data={chartData} title="Sustainability & Emissions Over Time" />
        </>
      )}
    </div>
  );
};

export default Analytics;
