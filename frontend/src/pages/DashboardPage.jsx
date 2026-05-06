import React, { useEffect, useState } from 'react';
import { dashboardService } from '@/services/index';
import { Card, LoadingSpinner, Badge } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

const StatCard = ({ label, value, icon, gradient, delay = 0 }) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg animate-slide-up ${gradient}`} style={{ animationDelay: `${delay}ms` }}>
    <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full bg-white/10"/>
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-white/80">{label}</span>
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">{icon}</div>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  </div>
);

const ProgressBar = ({ label, value, total, color }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600 dark:text-gray-400 w-28 truncate">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }}/>
      </div>
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-10 text-right">{value}</span>
    </div>
  );
};

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-12 text-rose-500 dark:text-rose-400">{error}</div>;

  const sourceColors = ['bg-indigo-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-sky-500'];
  const statusColors = {
    New: 'blue', Contacted: 'yellow', Qualified: 'purple', 'Proposal Sent': 'indigo', Won: 'green', Lost: 'red',
  };
  const statusBarColors = {
    New: 'bg-blue-500', Contacted: 'bg-amber-500', Qualified: 'bg-violet-500', 'Proposal Sent': 'bg-indigo-500', Won: 'bg-emerald-500', Lost: 'bg-rose-500',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, <span className="text-gradient">{user?.username || 'User'}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your leads today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Leads" value={stats?.totalLeads || 0} delay={0} gradient="bg-gradient-to-br from-indigo-500 to-violet-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}/>
        <StatCard label="New Leads" value={stats?.newLeads || 0} delay={100} gradient="bg-gradient-to-br from-sky-500 to-blue-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>}/>
        <StatCard label="Won Deals" value={stats?.wonLeads || 0} delay={200} gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}/>
        <StatCard label="Lost Deals" value={stats?.lostLeads || 0} delay={300} gradient="bg-gradient-to-br from-rose-500 to-pink-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}/>
      </div>

      {/* Deal values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${(stats?.totalDealValue || 0).toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Won Deal Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${(stats?.totalWonValue || 0).toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Leads by Source</h3>
          <div className="space-y-4">
            {stats?.leadsBySource?.map((item, idx) => (
              <ProgressBar key={item._id} label={item._id} value={item.count} total={stats.totalLeads} color={sourceColors[idx % sourceColors.length]}/>
            ))}
            {(!stats?.leadsBySource || stats.leadsBySource.length === 0) && <p className="text-gray-400 dark:text-gray-500 text-sm italic">No data available</p>}
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Leads by Status</h3>
          <div className="space-y-4">
            {stats?.leadsByStatus?.map((item) => (
              <ProgressBar key={item._id} label={item._id} value={item.count} total={stats.totalLeads} color={statusBarColors[item._id] || 'bg-gray-500'}/>
            ))}
            {(!stats?.leadsByStatus || stats.leadsByStatus.length === 0) && <p className="text-gray-400 dark:text-gray-500 text-sm italic">No data available</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};
