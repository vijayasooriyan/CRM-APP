import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leadsService } from '@/services/index';
import { Button, Card, Input, Select, LoadingSpinner, Toast, Modal, Badge } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

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

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await leadsService.getLeadById(id);
        setLead(response.data);
        setFormData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch lead');
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    setAddingNote(true);
    try {
      const response = await leadsService.addNote(id, { content: noteContent, createdBy: user?.username || 'User' });
      setLead(response.data.lead);
      setNoteContent('');
      setToast({ message: 'Note added', type: 'success' });
    } catch { setToast({ message: 'Failed to add note', type: 'error' }); }
    finally { setAddingNote(false); }
  };

  const handleSave = async () => {
    try {
      const response = await leadsService.updateLead(id, formData);
      setLead(response.data.lead);
      setEditMode(false);
      setToast({ message: 'Lead updated', type: 'success' });
    } catch { setToast({ message: 'Failed to update lead', type: 'error' }); }
  };

  const handleDelete = async () => {
    try {
      await leadsService.deleteLead(id);
      setToast({ message: 'Lead deleted', type: 'success' });
      setTimeout(() => navigate('/leads'), 800);
    } catch { setToast({ message: 'Failed to delete lead', type: 'error' }); }
    finally { setDeleteModal(false); }
  };

  const statusBadge = { New: 'blue', Contacted: 'yellow', Qualified: 'purple', 'Proposal Sent': 'indigo', Won: 'green', Lost: 'red' };
  const statusSteps = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won'];
  const currentStep = statusSteps.indexOf(lead?.status);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-12 text-rose-500">{error}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/leads')} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lead.leadName}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{lead.companyName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!editMode ? (
            <>
              <Button onClick={() => setEditMode(true)} variant="secondary">Edit</Button>
              <Button onClick={() => setDeleteModal(true)} variant="danger">Delete</Button>
            </>
          ) : (
            <>
              <Button onClick={() => { setEditMode(false); setFormData(lead); }} variant="secondary">Cancel</Button>
              <Button onClick={handleSave} variant="success">Save Changes</Button>
            </>
          )}
        </div>
      </div>

      {/* Status Pipeline */}
      {lead.status !== 'Lost' && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, idx) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${idx <= currentStep ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                    {idx < currentStep ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                    ) : idx + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${idx <= currentStep ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>{step}</span>
                </div>
                {idx < statusSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded ${idx < currentStep ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`}/>
                )}
              </React.Fragment>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Info */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Lead Information</h2>
            {editMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <Input label="Lead Name" value={formData.leadName || ''} onChange={(e) => setFormData({...formData, leadName: e.target.value})}/>
                <Input label="Company" value={formData.companyName || ''} onChange={(e) => setFormData({...formData, companyName: e.target.value})}/>
                <Input label="Email" type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})}/>
                <Input label="Phone" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})}/>
                <Select label="Lead Source" value={formData.leadSource || ''} onChange={(e) => setFormData({...formData, leadSource: e.target.value})} options={[{value:'Website',label:'Website'},{value:'LinkedIn',label:'LinkedIn'},{value:'Referral',label:'Referral'},{value:'Cold Email',label:'Cold Email'},{value:'Event',label:'Event'}]}/>
                <Input label="Salesperson" value={formData.assignedSalesperson || ''} onChange={(e) => setFormData({...formData, assignedSalesperson: e.target.value})}/>
                <Select label="Status" value={formData.status || ''} onChange={(e) => setFormData({...formData, status: e.target.value})} options={[{value:'New',label:'New'},{value:'Contacted',label:'Contacted'},{value:'Qualified',label:'Qualified'},{value:'Proposal Sent',label:'Proposal Sent'},{value:'Won',label:'Won'},{value:'Lost',label:'Lost'}]}/>
                <Input label="Deal Value ($)" type="number" value={formData.dealValue || ''} onChange={(e) => setFormData({...formData, dealValue: Number(e.target.value)})}/>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'Email', value: lead.email, icon: '📧' },
                  { label: 'Phone', value: lead.phone, icon: '📱' },
                  { label: 'Lead Source', value: lead.leadSource, icon: '🔗' },
                  { label: 'Salesperson', value: lead.assignedSalesperson, icon: '👤' },
                  { label: 'Status', value: lead.status, icon: '📊', badge: true },
                  { label: 'Deal Value', value: `$${lead.dealValue?.toLocaleString()}`, icon: '💰' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                      {item.badge ? <Badge color={statusBadge[item.value]}>{item.value}</Badge> : <p className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Notes */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notes</h3>
            <div className="mb-5">
              <textarea placeholder="Add a note..." value={noteContent} onChange={(e) => setNoteContent(e.target.value)} disabled={addingNote} rows="3"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all resize-none"/>
              <Button onClick={handleAddNote} className="mt-2" disabled={addingNote || !noteContent.trim()} isLoading={addingNote}>Add Note</Button>
            </div>
            <div className="space-y-3">
              {lead.notes && lead.notes.length > 0 ? (
                [...lead.notes].reverse().map((note, idx) => (
                  <div key={idx} className="relative pl-5 py-3 border-l-2 border-indigo-300 dark:border-indigo-600">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{note.content}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">{note.createdBy} · {new Date(note.createdAt).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 dark:text-gray-500 text-sm italic py-4 text-center">No notes yet</p>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-sm text-indigo-100 mb-1">Deal Value</p>
            <p className="text-3xl font-bold">${lead.dealValue?.toLocaleString()}</p>
          </div>
          <Card>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                <div className="mt-1"><Badge color={statusBadge[lead.status]}>{lead.status}</Badge></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{new Date(lead.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Last Updated</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{new Date(lead.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={deleteModal} title="Delete Lead" onClose={() => setDeleteModal(false)} onConfirm={handleDelete} confirmText="Delete">
        <p className="text-gray-600 dark:text-gray-400">Are you sure you want to delete <strong>{lead.leadName}</strong>? This action cannot be undone.</p>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)}/>}
    </div>
  );
};
