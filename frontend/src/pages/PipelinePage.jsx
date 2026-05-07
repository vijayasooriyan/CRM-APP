import React, { useState, useEffect } from 'react';
import { leadsService } from '@/services/index';
import { Card, LoadingSpinner, Badge, Button, Toast } from '@/components/ui';

const PIPELINE_STAGES = [
  { id: 'New', label: 'Leads', color: 'orange' },
  { id: 'Contacted', label: 'Qualified', color: 'blue' },
  { id: 'Qualified', label: 'Proposal', color: 'purple' },
  { id: 'Proposal Sent', label: 'Negotiation', color: 'indigo' },
  { id: 'Won', label: 'Closed', color: 'green' }
];

export const PipelinePage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await leadsService.getAllLeads({ limit: 100 });
      setLeads(response.data.leads);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      await leadsService.updateLead(leadId, { status: newStatus });
      setLeads(leads.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
      setToast({ message: `Pipeline updated`, type: 'success' });
    } catch (err) {
      setToast({ message: 'Update failed', type: 'error' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-6xl font-bold tracking-tight text-[#F0F4FF] leading-tight">
          Deal <span className="text-[#FF5B14]">Pipeline</span>
        </h1>
        <p className="text-[#7B8BAD] font-bold text-xs uppercase tracking-[2px]">Visualize and manage your sales flow</p>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-10 min-h-[70vh] -mx-4 px-4 scrollbar-hide">
        {PIPELINE_STAGES.map((stage) => {
          const stageLeads = leads.filter(l => l.status === stage.id || (stage.id === 'Won' && l.status === 'Won'));
          const totalValue = stageLeads.reduce((acc, l) => acc + (l.dealValue || 0), 0);

          return (
            <div key={stage.id} className="flex-shrink-0 w-[320px] flex flex-col gap-6">
              {/* Column Header */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${stage.id === 'Won' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-[#FF5B14] shadow-[0_0_8px_#FF5B14]'}`} />
                  <h3 className="text-sm font-bold text-[#F0F4FF] uppercase tracking-widest">{stage.label}</h3>
                  <span className="text-xs font-mono text-[#7B8BAD] bg-white/5 px-2 py-0.5 rounded-md">{stageLeads.length}</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#FF8A3D]">${totalValue.toLocaleString()}</span>
              </div>

              {/* Column Body */}
              <div className="flex-1 space-y-4 p-2 rounded-2xl bg-white/[0.02] border border-white/5 overflow-y-auto">
                {stageLeads.map((lead) => (
                  <Card 
                    key={lead._id} 
                    className="p-5 cursor-grab active:cursor-grabbing hover:border-[#FF5B14]/40 group"
                    noPadding={false}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-bold text-[#F0F4FF] group-hover:text-[#FF8A3D] transition-colors">{lead.leadName}</p>
                          <p className="text-[10px] font-bold text-[#7B8BAD] uppercase tracking-[1px]">{lead.companyName}</p>
                        </div>
                        <Badge color={stage.color}>{lead.leadScore} pts</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                        <span className="text-sm font-mono font-bold text-[#F0F4FF]">${lead.dealValue?.toLocaleString()}</span>
                        <div className="flex gap-1">
                          {PIPELINE_STAGES.findIndex(s => s.id === stage.id) > 0 && (
                            <button 
                              onClick={() => updateLeadStatus(lead._id, PIPELINE_STAGES[PIPELINE_STAGES.findIndex(s => s.id === stage.id) - 1].id)}
                              className="p-1.5 rounded-lg bg-white/5 text-[#7B8BAD] hover:text-[#F0F4FF] transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
                            </button>
                          )}
                          {PIPELINE_STAGES.findIndex(s => s.id === stage.id) < PIPELINE_STAGES.length - 1 && (
                            <button 
                              onClick={() => updateLeadStatus(lead._id, PIPELINE_STAGES[PIPELINE_STAGES.findIndex(s => s.id === stage.id) + 1].id)}
                              className="p-1.5 rounded-lg bg-white/5 text-[#7B8BAD] hover:text-[#FF5B14] transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {stageLeads.length === 0 && (
                  <div className="py-12 text-center text-[10px] font-bold text-[#7B8BAD] uppercase tracking-widest opacity-30">
                    No active deals
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
