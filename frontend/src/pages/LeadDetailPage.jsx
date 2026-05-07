import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leadsService } from '@/services/index';
import { Button, Card, Input, Select, LoadingSpinner, Toast, Modal, Badge } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

const ScoreBadge = ({ score }) => {
  let color = 'red';
  if (score >= 81) color = 'orange';
  else if (score >= 61) color = 'blue';
  else if (score >= 31) color = 'yellow';
  return <Badge color={color}>{score} pts</Badge>;
};

const timeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const ActivityIcon = ({ action }) => {
  const styles = {
    status_change: 'bg-[#FF5B14]/10 text-[#FF5B14]',
    note: 'bg-blue-500/10 text-blue-400',
    created: 'bg-emerald-500/10 text-emerald-400',
    edit: 'bg-amber-500/10 text-amber-400'
  };
  const current = styles[action] || styles.edit;
  
  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/5 ${current}`}>
      {action === 'status_change' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>}
      {action === 'note' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>}
      {action === 'created' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>}
      {action === 'edit' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>}
    </div>
  );
};

export const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await leadsService.getLeadById(id);
        setLead(response.data);
        setFormData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch contact');
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  const handleSummarizeNotes = async () => {
    if (!lead?.notes || lead.notes.length === 0) return;
    setIsSummarizing(true);
    setSummaryError(null);
    try {
      const response = await leadsService.summarizeNotes(id);
      setAiSummary(response.data.summary);
    } catch (err) {
      setSummaryError(err.response?.data?.message || 'AI service unavailable');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    setAddingNote(true);
    try {
      const response = await leadsService.addNote(id, { content: noteContent, createdBy: user?.username || 'User' });
      setLead(response.data.lead);
      setNoteContent('');
      setToast({ message: 'Note captured', type: 'success' });
    } catch { setToast({ message: 'Failed to save note', type: 'error' }); }
    finally { setAddingNote(false); }
  };

  const handleSave = async () => {
    try {
      const response = await leadsService.updateLead(id, formData);
      setLead(response.data.lead);
      setEditMode(false);
      setToast({ message: 'Profile updated', type: 'success' });
    } catch { setToast({ message: 'Update failed', type: 'error' }); }
  };

  const handleDelete = async () => {
    try {
      await leadsService.deleteLead(id);
      setToast({ message: 'Contact purged', type: 'success' });
      setTimeout(() => navigate('/leads'), 800);
    } catch { setToast({ message: 'Deletion failed', type: 'error' }); }
    finally { setDeleteModal(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-20 text-rose-500 font-bold text-xl">{error}</div>;

  const statusSteps = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won'];
  const currentStep = statusSteps.indexOf(lead?.status);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/leads')} 
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/7 flex items-center justify-center text-[#7B8BAD] hover:text-[#FF5B14] hover:bg-[#FF5B14]/10 hover:border-[#FF5B14]/30 transition-all group"
          >
            <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF5B14] to-[#FF8A3D] flex items-center justify-center text-3xl font-bold text-[#060810] shadow-[0_10px_30px_rgba(255,91,20,0.3)]">
              {lead.leadName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-4xl font-bold tracking-tight text-[#F0F4FF]">{lead.leadName}</h1>
                <ScoreBadge score={lead.leadScore || 0} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#7B8BAD] font-bold text-xs uppercase tracking-widest">{lead.companyName}</span>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[#FF8A3D] font-mono text-sm font-bold tracking-tighter">ID: {lead._id.substring(18)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          {!editMode ? (
            <>
              <Button onClick={() => setEditMode(true)} variant="secondary">Edit Profile</Button>
              <Button onClick={() => setDeleteModal(true)} variant="danger">Delete</Button>
            </>
          ) : (
            <>
              <Button onClick={() => { setEditMode(false); setFormData(lead); }} variant="ghost">Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          )}
        </div>
      </div>

      {/* Pipeline Visualizer */}
      {lead.status !== 'Lost' && (
        <Card className="p-2 border-white/5 bg-[#0b0f1a]/50">
          <div className="flex items-center">
            {statusSteps.map((step, idx) => (
              <React.Fragment key={step}>
                <div className="flex-1 flex flex-col items-center gap-2 relative">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-500 ${idx <= currentStep ? 'bg-[#FF5B14] text-white shadow-[0_0_20px_rgba(255,91,20,0.4)] rotate-0' : 'bg-white/5 text-[#7B8BAD] border border-white/5'}`}>
                    {idx < currentStep ? '✓' : idx + 1}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${idx <= currentStep ? 'text-[#FF8A3D]' : 'text-[#7B8BAD]'}`}>{step}</span>
                </div>
                {idx < statusSteps.length - 1 && (
                  <div className={`w-full h-0.5 max-w-[40px] -mt-6 rounded-full transition-colors duration-700 ${idx < currentStep ? 'bg-[#FF5B14]' : 'bg-white/5'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Info Panels */}
          <Card className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {editMode ? (
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <Input label="Full Name" value={formData.leadName} onChange={(e) => setFormData({...formData, leadName: e.target.value})}/>
                <Input label="Company" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})}/>
                <Input label="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}/>
                <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}/>
                <Select label="Status" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} options={statusSteps.map(s => ({value:s, label:s}))}/>
                <Input label="Value ($)" type="number" value={formData.dealValue} onChange={(e) => setFormData({...formData, dealValue: Number(e.target.value)})}/>
              </div>
            ) : (
              <>
                <div className="space-y-8">
                  <h3 className="text-xl font-bold text-[#F0F4FF] border-b border-white/5 pb-4">Core <span className="text-[#FF5B14]">Identity</span></h3>
                  <div className="space-y-6">
                    {[
                      { label: 'Primary Email', value: lead.email, icon: '📧' },
                      { label: 'Direct Phone', value: lead.phone, icon: '📱' },
                      { label: 'Origin Source', value: lead.leadSource, icon: '🔗' },
                      { label: 'Lead Owner', value: lead.assignedSalesperson, icon: '👤' },
                    ].map(i => (
                      <div key={i.label} className="group">
                        <p className="text-[10px] font-bold text-[#7B8BAD] uppercase tracking-widest mb-1.5">{i.label}</p>
                        <p className="text-[#F0F4FF] font-medium flex items-center gap-2">
                          <span className="grayscale group-hover:grayscale-0 transition-all">{i.icon}</span> {i.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-8">
                  <h3 className="text-xl font-bold text-[#F0F4FF] border-b border-white/5 pb-4">Sale <span className="text-[#FF5B14]">Metrics</span></h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-bold text-[#7B8BAD] uppercase tracking-widest mb-1.5">Projected Value</p>
                      <p className="text-3xl font-bold font-mono text-[#FF5B14]">${lead.dealValue?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#7B8BAD] uppercase tracking-widest mb-1.5">Lead Scoring</p>
                      <div className="mt-2"><ScoreBadge score={lead.leadScore} /></div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#7B8BAD] uppercase tracking-widest mb-1.5">Follow-up Window</p>
                      <p className="text-[#F0F4FF] font-medium">{lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'Unscheduled'}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>

          {/* Notes & AI Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-[#F0F4FF]">Internal <span className="text-[#FF5B14]">Intelligence</span></h3>
              <button 
                onClick={handleSummarizeNotes}
                disabled={isSummarizing || !lead?.notes?.length}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5B14]/10 text-[#FF5B14] border border-[#FF5B14]/20 hover:bg-[#FF5B14] hover:text-white transition-all font-bold text-xs uppercase tracking-widest disabled:opacity-20"
              >
                {isSummarizing ? 'Analyzing...' : '✨ Generate AI Summary'}
              </button>
            </div>

            {aiSummary && (
              <Card className="bg-[#FF5B14]/5 border-[#FF5B14]/30 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => setAiSummary(null)} className="text-[#FF8A3D] hover:scale-110 transition-transform">✕</button>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">🤖</div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-[#FF5B14] uppercase tracking-widest">Intelligence Report</p>
                    <p className="text-[#F0F4FF] leading-relaxed italic">"{aiSummary}"</p>
                  </div>
                </div>
              </Card>
            )}

            <Card className="space-y-8">
              <div className="relative">
                <textarea 
                  placeholder="Capture critical intelligence..." 
                  value={noteContent} 
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full bg-white border border-white/20 rounded-2xl p-6 text-[#060810] font-medium placeholder-[#9ca3af] focus:outline-none focus:ring-4 focus:ring-[#FF5B14]/10 focus:border-[#FF5B14]/50 transition-all resize-none min-h-[120px]"
                />
                <div className="absolute bottom-4 right-4">
                  <Button onClick={handleAddNote} disabled={addingNote || !noteContent.trim()} isLoading={addingNote} className="px-5 py-2">Save Note</Button>
                </div>
              </div>
              
              <div className="space-y-8 pl-4">
                {lead.notes?.slice().reverse().map((note, idx) => (
                  <div key={idx} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-white/10">
                    <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-[#FF5B14] shadow-[0_0_10px_#FF5B14]" />
                    <p className="text-[#F0F4FF] leading-relaxed mb-2">{note.content}</p>
                    <p className="text-[10px] font-bold text-[#7B8BAD] uppercase tracking-widest">{note.createdBy} · {new Date(note.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar Timeline */}
        <div className="space-y-10">
          <div>
            <h3 className="text-xl font-bold text-[#F0F4FF] mb-6 tracking-tight">Activity <span className="text-[#FF5B14]">Stream</span></h3>
            <Card className="p-0 border-white/5 overflow-hidden">
              <div className="p-8 space-y-10">
                {lead.activity?.slice().reverse().map((entry, idx) => (
                  <div key={idx} className="flex gap-5 relative">
                    {idx < lead.activity.length - 1 && <div className="absolute left-5 top-12 bottom-[-40px] w-px bg-white/5" />}
                    <ActivityIcon action={entry.action} />
                    <div className="flex-1 pt-1">
                      <p className="text-sm text-[#F0F4FF] leading-relaxed mb-1">{entry.detail}</p>
                      <p className="text-[10px] font-bold text-[#7B8BAD] uppercase tracking-widest">{timeAgo(entry.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-white/2 border-t border-white/5 text-center">
                <button className="text-[10px] font-bold text-[#7B8BAD] uppercase tracking-widest hover:text-[#FF5B14] transition-colors">View Full Audit Log</button>
              </div>
            </Card>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b0f1a] to-[#060810] relative overflow-hidden">
            <h4 className="text-lg font-bold text-white mb-4 relative z-10">Lead Metadata</h4>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#7B8BAD] uppercase tracking-widest">Added</span>
                <span className="text-xs font-mono text-[#F0F4FF]">{new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#7B8BAD] uppercase tracking-widest">Last Contact</span>
                <span className="text-xs font-mono text-[#F0F4FF]">{timeAgo(lead.updatedAt)}</span>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#FF5B14]/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>

      <Modal isOpen={deleteModal} title="Purge Record" onClose={() => setDeleteModal(false)} onConfirm={handleDelete} confirmText="Purge Record">
        <p className="text-lg text-[#7B8BAD] leading-relaxed">Are you absolutely sure you want to purge <strong className="text-[#F0F4FF]">{lead.leadName}</strong>? All associated intelligence and history will be lost forever.</p>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)}/>}
    </div>
  );
};
