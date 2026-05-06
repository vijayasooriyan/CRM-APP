import React, { useEffect, useState } from 'react';
import { dashboardService } from '@/services/index';
import { Card, LoadingSpinner } from '@/components/ui';

const StatCard = ({ label, value, color = 'blue' }) => (
  <Card className={`bg-gradient-to-br from-${color}-50 to-${color}-100`}>
    <p className="text-gray-600 text-sm font-medium">{label}</p>
    <p className={`text-3xl font-bold text-${color}-600 mt-2`}>{value}</p>
  </Card>
);

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (error)
    return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your CRM metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Leads" value={stats?.totalLeads || 0} color="blue" />
        <StatCard label="New Leads" value={stats?.newLeads || 0} color="yellow" />
        <StatCard label="Qualified Leads" value={stats?.qualifiedLeads || 0} color="purple" />
        <StatCard label="Won Deals" value={stats?.wonLeads || 0} color="green" />
      </div>

      {/* Deal Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <p className="text-gray-600 text-sm font-medium">Total Deal Value</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ${(stats?.totalDealValue || 0).toLocaleString()}
          </p>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100">
          <p className="text-gray-600 text-sm font-medium">Won Deal Value</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">
            ${(stats?.totalWonValue || 0).toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads by Source</h3>
          <div className="space-y-3">
            {stats?.leadsBySource?.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <span className="text-gray-700">{item._id}</span>
                <span className="font-semibold text-blue-600">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads by Status</h3>
          <div className="space-y-3">
            {stats?.leadsByStatus?.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <span className="text-gray-700">{item._id}</span>
                <span className="font-semibold text-blue-600">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Lost Leads */}
      <div>
        <StatCard label="Lost Deals" value={stats?.lostLeads || 0} color="red" />
      </div>
    </div>
  );
};
