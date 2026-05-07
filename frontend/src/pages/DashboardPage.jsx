import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '@/services/index';
import { Card, StatCard, LoadingSpinner, Badge, Button } from '@/components/ui';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-12 text-center text-rose-500 font-bold">{error}</div>;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-6xl font-bold tracking-tight text-[#F0F4FF] leading-tight">
          System <span className="text-[#FF5B14]">Overview</span>
        </h1>
        <p className="text-lg text-[#7B8BAD] max-w-2xl">
          Real-time analytics and performance metrics for your sales pipeline.
        </p>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Contacts" 
          value={stats.totalLeads} 
          trend="+12%"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>}
        />
        <StatCard 
          label="Open Deals" 
          value={stats.activeLeads} 
          trend="+5.2%"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>}
        />
        <StatCard 
          label="Projected Revenue" 
          value={`$${(stats.totalDealValue || 0).toLocaleString()}`} 
          trend="+28.4%"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
        />
        <StatCard 
          label="Conversion Rate" 
          value={`${(stats.wonLeads + stats.lostLeads > 0 
            ? (stats.wonLeads / (stats.wonLeads + stats.lostLeads) * 100).toFixed(1) 
            : 0)}%`} 
          trend="+1.2%"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Top Leads */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-[#F0F4FF]">High-Score <span className="text-[#FF5B14]">Prospects</span></h2>
            <Button variant="ghost" className="text-xs" onClick={() => navigate('/leads')}>View All Contacts</Button>
          </div>
          <div className="space-y-4">
            {stats.topLeadsByScore?.map((lead) => (
              <Card key={lead._id} className="flex items-center justify-between hover:border-[#FF5B14]/40" noPadding>
                <div className="flex items-center gap-6 p-6">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-mono font-bold text-2xl text-[#FF5B14] border border-white/5 group-hover:border-[#FF5B14]/20 transition-all">
                    {lead.leadScore}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#F0F4FF] group-hover:text-[#FF8A3D] transition-colors">{lead.leadName}</h3>
                    <p className="text-xs font-bold text-[#7B8BAD] uppercase tracking-widest">{lead.companyName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 px-8">
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] font-bold text-[#7B8BAD] uppercase tracking-widest mb-1">Value</p>
                    <p className="font-mono font-bold text-[#F0F4FF]">${lead.dealValue?.toLocaleString()}</p>
                  </div>
                  <Badge color={lead.leadScore > 80 ? 'orange' : 'gray'}>
                    {lead.status}
                  </Badge>
                  <button 
                    onClick={() => navigate(`/leads/${lead._id}`)}
                    className="p-2 rounded-lg bg-white/5 text-[#7B8BAD] hover:text-[#FF5B14] hover:bg-[#FF5B14]/10 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Needs Attention */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#F0F4FF] mb-6">Attention <span className="text-[#FF5B14]">Required</span></h2>
            <Card className="space-y-6">
              <div className="flex items-center justify-between group cursor-pointer" onClick={() => navigate('/leads?stale=true')}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <p className="font-bold text-[#F0F4FF]">Stale Leads</p>
                    <p className="text-xs text-[#7B8BAD]">Inactive for 14+ days</p>
                  </div>
                </div>
                <span className="text-2xl font-bold font-mono text-rose-500">{stats.staleLeads || 0}</span>
              </div>
              
              <div className="flex items-center justify-between group cursor-pointer" onClick={() => navigate('/leads')}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </div>
                  <div>
                    <p className="font-bold text-[#F0F4FF]">Follow-ups</p>
                    <p className="text-xs text-[#7B8BAD]">Scheduled for today</p>
                  </div>
                </div>
                <span className="text-2xl font-bold font-mono text-amber-500">{stats.followUpsDueToday || 0}</span>
              </div>

              <div className="flex items-center justify-between group cursor-pointer" onClick={() => navigate('/activities')}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  </div>
                  <div>
                    <p className="font-bold text-[#F0F4FF]">Overdue</p>
                    <p className="text-xs text-[#7B8BAD]">Missed follow-up dates</p>
                  </div>
                </div>
                <span className="text-2xl font-bold font-mono text-rose-500">{stats.overdueFollowUps || 0}</span>
              </div>
            </Card>
          </div>

          {/* Quick Action */}
          <div className="bg-gradient-to-br from-[#FF5B14] to-[#c84010] p-8 rounded-2xl shadow-[0_20px_50px_rgba(255,91,20,0.3)] relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2 leading-tight">Scale Your <br/>Sales Engine</h3>
              <p className="text-white/70 text-sm mb-6">Integrate your email and calendar to automate lead follow-ups.</p>
              <Button className="w-full bg-white text-[#FF5B14] hover:bg-white/90 shadow-none border-none">Connect Apps</Button>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
};
