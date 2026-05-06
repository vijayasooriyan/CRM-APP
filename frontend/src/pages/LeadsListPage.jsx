import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadsService } from '@/services/index';
import { Button, Card, Input, Select, Table, Pagination, Modal, LoadingSpinner, Toast, Badge } from '@/components/ui';

export const LeadsListPage = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [filters, setFilters] = useState({ status: '', leadSource: '', assignedSalesperson: '', search: '' });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ leadName: '', companyName: '', email: '', phone: '', leadSource: 'Website', assignedSalesperson: '', status: 'New', dealValue: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => { fetchLeads(); }, [page, filters, sortBy, sortOrder]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await leadsService.getAllLeads({ page, limit, ...filters, sortBy, sortOrder });
      setLeads(response.data.leads);
      setTotal(response.data.pagination.total);
      setPages(response.data.pagination.pages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handleCreateLead = async (e) => {
    e?.preventDefault();
    setFormError(null);
    setIsCreating(true);
    try {
      await leadsService.createLead({ ...formData, dealValue: Number(formData.dealValue) });
      setToast({ message: 'Lead created successfully', type: 'success' });
      setFormData({ leadName: '', companyName: '', email: '', phone: '', leadSource: 'Website', assignedSalesperson: '', status: 'New', dealValue: '' });
      setShowModal(false);
      fetchLeads();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create lead';
      setFormError(msg);
      setToast({ message: msg, type: 'error' });
    } finally {
      setIsCreating(false);
    }
  };

  const statusBadge = {
    New: 'blue', Contacted: 'yellow', Qualified: 'purple', 'Proposal Sent': 'indigo', Won: 'green', Lost: 'red',
  };

  const columns = [
    { key: 'leadName', label: 'Lead Name', render: (row) => <span className="font-semibold text-indigo-600 dark:text-indigo-400">{row.leadName}</span> },
    { key: 'companyName', label: 'Company' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', render: (row) => <Badge color={statusBadge[row.status]}>{row.status}</Badge> },
    { key: 'dealValue', label: 'Deal Value', render: (row) => <span className="font-semibold">${row.dealValue?.toLocaleString()}</span> },
  ];

  if (loading && leads.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leads</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track your sales pipeline</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          New Lead
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Filters & Search</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input placeholder="Search leads..." value={filters.search} onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }} className="mb-0"/>
          <Select options={[{value:'',label:'All Statuses'},{value:'New',label:'New'},{value:'Contacted',label:'Contacted'},{value:'Qualified',label:'Qualified'},{value:'Proposal Sent',label:'Proposal Sent'},{value:'Won',label:'Won'},{value:'Lost',label:'Lost'}]} name="status" value={filters.status} onChange={handleFilterChange} className="mb-0"/>
          <Select options={[{value:'',label:'All Sources'},{value:'Website',label:'Website'},{value:'LinkedIn',label:'LinkedIn'},{value:'Referral',label:'Referral'},{value:'Cold Email',label:'Cold Email'},{value:'Event',label:'Event'}]} name="leadSource" value={filters.leadSource} onChange={handleFilterChange} className="mb-0"/>
          <Select options={[{value:'',label:'All Salespersons'},{value:'John Doe',label:'John Doe'},{value:'Sarah Johnson',label:'Sarah Johnson'}]} name="assignedSalesperson" value={filters.assignedSalesperson} onChange={handleFilterChange} className="mb-0"/>
          <Select options={[{value:'createdAt',label:'Date Created'},{value:'dealValue',label:'Deal Value'},{value:'leadName',label:'Lead Name'}]} value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="mb-0"/>
        </div>
      </Card>

      {error && (
        <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 px-4 py-3 rounded-xl text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {error}
        </div>
      )}

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        {leads.length > 0 ? (
          <div>
            <Table columns={columns} data={leads} onRowClick={(row) => navigate(`/leads/${row._id}`)}/>
            <div className="px-6 pb-4">
              <Pagination current={page} total={total} pages={pages} onPageChange={setPage}/>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">No leads found</p>
            <Button onClick={() => setShowModal(true)}>Create First Lead</Button>
          </div>
        )}
      </Card>

      {/* Create Modal */}
      <Modal isOpen={showModal} title="Create New Lead" onClose={() => { setShowModal(false); setFormError(null); }} onConfirm={handleCreateLead} confirmText={isCreating ? 'Creating...' : 'Create Lead'}>
        <form onSubmit={handleCreateLead} className="space-y-0">
          <Input label="Lead Name" placeholder="John Smith" value={formData.leadName} onChange={(e) => setFormData({...formData, leadName: e.target.value})} required/>
          <Input label="Company Name" placeholder="Tech Corp" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} required/>
          <Input label="Email" type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required/>
          <Input label="Phone" placeholder="+1-555-0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required/>
          <Select label="Lead Source" value={formData.leadSource} onChange={(e) => setFormData({...formData, leadSource: e.target.value})} options={[{value:'Website',label:'Website'},{value:'LinkedIn',label:'LinkedIn'},{value:'Referral',label:'Referral'},{value:'Cold Email',label:'Cold Email'},{value:'Event',label:'Event'}]}/>
          <Input label="Assigned Salesperson" placeholder="John Doe" value={formData.assignedSalesperson} onChange={(e) => setFormData({...formData, assignedSalesperson: e.target.value})} required/>
          <Input label="Deal Value ($)" type="number" placeholder="50000" value={formData.dealValue} onChange={(e) => setFormData({...formData, dealValue: e.target.value})} required/>
          {formError && <p className="text-rose-500 text-sm">{formError}</p>}
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)}/>}
    </div>
  );
};
