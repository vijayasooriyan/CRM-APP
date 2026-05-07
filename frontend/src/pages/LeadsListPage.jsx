import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { leadsService } from '@/services/index';
import { Card, Button, Input, Select, Table, Pagination, LoadingSpinner, Badge, Toast, Modal } from '@/components/ui';

export const LeadsListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // Handle Search Debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams({ ...Object.fromEntries(searchParams), search: searchTerm, page: 1 });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [newLead, setNewLead] = useState({
    leadName: '',
    companyName: '',
    email: '',
    phone: '',
    leadSource: 'Website',
    assignedSalesperson: '',
    dealValue: 0,
    status: 'New'
  });

  // Filters from URL
  const page = searchParams.get('page') || 1;
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const stale = searchParams.get('stale') || '';

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const response = await leadsService.getAllLeads({ page, search, status, stale });
        setLeads(response.data.leads);
        setPagination(response.data.pagination);
      } catch (err) {
        setError('Failed to fetch contacts');
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [page, search, status, stale]);

  const handleCreateLead = async () => {
    try {
      await leadsService.createLead(newLead);
      setToast({ message: 'Contact created successfully', type: 'success' });
      setCreateModal(false);
      setNewLead({ leadName: '', companyName: '', email: '', phone: '', leadSource: 'Website', assignedSalesperson: '', dealValue: 0, status: 'New' });
      // Refresh list
      const response = await leadsService.getAllLeads({ page, search, status, stale });
      setLeads(response.data.leads);
      setPagination(response.data.pagination);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to create contact', type: 'error' });
    }
  };

  const columns = [
    { 
      label: 'Contact', 
      key: 'leadName',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#F0F4FF] group-hover:text-[#FF5B14] transition-colors">{row.leadName}</span>
          <span className="text-[10px] font-bold text-[#7B8BAD] uppercase tracking-widest">{row.companyName}</span>
        </div>
      )
    },
    { 
      label: 'Value', 
      key: 'dealValue',
      isMono: true,
      render: (row) => <span className="text-[#FF8A3D] font-bold">${row.dealValue?.toLocaleString()}</span>
    },
    { 
      label: 'Status', 
      key: 'status',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Badge color={
            row.status === 'Won' ? 'green' : 
            row.status === 'Lost' ? 'red' : 
            row.status === 'New' ? 'orange' : 'blue'
          }>
            {row.status}
          </Badge>
          {row.isStale && <Badge color="red">STALE</Badge>}
        </div>
      )
    },
    { label: 'Salesperson', key: 'assignedSalesperson' },
    { 
      label: 'Score', 
      key: 'leadScore',
      isMono: true,
      render: (row) => (
        <span className={`font-bold ${row.leadScore >= 80 ? 'text-[#FF5B14]' : 'text-[#7B8BAD]'}`}>
          {row.leadScore}
        </span>
      )
    },
    { 
      label: 'Last Update', 
      key: 'updatedAt',
      render: (row) => new Date(row.updatedAt).toLocaleDateString()
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-6xl font-bold tracking-tight text-[#F0F4FF] leading-tight">
            Contact <span className="text-[#FF5B14]">Base</span>
          </h1>
          <p className="text-[#7B8BAD] font-medium tracking-wide uppercase text-xs">Manage and track your customer relationships</p>
        </div>
        <Button onClick={() => setCreateModal(true)} className="glow-active">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
          Add New Contact
        </Button>
      </div>

      {/* Filters */}
      <Card className="flex flex-col md:flex-row items-center gap-6" noPadding>
        <div className="flex-1 w-full p-4 md:p-6 border-b md:border-b-0 md:border-r border-white/5">
          <Input 
            placeholder="Search by name, company, or email..." 
            value={searchTerm}
            className="mb-0 border-none bg-transparent"
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>}
          />
        </div>
        <div className="w-full md:w-64 p-4 md:p-6 border-b md:border-b-0 md:border-r border-white/5">
          <Select 
            value={status}
            className="mb-0 border-none bg-transparent"
            onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams), status: e.target.value, page: 1 })}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'New', label: 'New' },
              { value: 'Contacted', label: 'Contacted' },
              { value: 'Qualified', label: 'Qualified' },
              { value: 'Proposal Sent', label: 'Proposal Sent' },
              { value: 'Won', label: 'Won' },
              { value: 'Lost', label: 'Lost' }
            ]}
          />
        </div>
        <div className="w-full md:w-auto px-8 py-4 flex items-center gap-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={stale === 'true'}
                onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams), stale: e.target.checked ? 'true' : '', page: 1 })}
              />
              <div className={`w-10 h-5 rounded-full transition-colors ${stale === 'true' ? 'bg-[#FF5B14]' : 'bg-white/10'}`} />
              <div className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform ${stale === 'true' ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            <span className="text-xs font-bold text-[#7B8BAD] uppercase tracking-widest group-hover:text-[#F0F4FF] transition-colors">Show Stale Only</span>
          </label>
        </div>
      </Card>

      {/* Table */}
      <Card noPadding>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="p-12 text-center text-rose-500 font-bold">{error}</div>
        ) : (
          <>
            <Table 
              columns={columns} 
              data={leads} 
              onRowClick={(row) => navigate(`/leads/${row._id}`)}
            />
            <div className="px-8 pb-8">
              <Pagination 
                current={Number(page)} 
                pages={pagination.pages} 
                total={pagination.total}
                onPageChange={(p) => setSearchParams({ ...Object.fromEntries(searchParams), page: p })}
              />
            </div>
          </>
        )}
      </Card>

      {/* Create Modal */}
      <Modal 
        isOpen={createModal} 
        title="Add New Contact" 
        onClose={() => setCreateModal(false)}
        onConfirm={handleCreateLead}
        confirmText="Create Contact"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input label="Lead Name" value={newLead.leadName} onChange={(e) => setNewLead({...newLead, leadName: e.target.value})} placeholder="e.g. Elon Musk"/>
          </div>
          <Input label="Company" value={newLead.companyName} onChange={(e) => setNewLead({...newLead, companyName: e.target.value})} placeholder="e.g. SpaceX"/>
          <Input label="Deal Value ($)" type="number" value={newLead.dealValue} onChange={(e) => setNewLead({...newLead, dealValue: e.target.value})} placeholder="0"/>
          <Input label="Email" type="email" value={newLead.email} onChange={(e) => setNewLead({...newLead, email: e.target.value})} placeholder="elon@spacex.com"/>
          <Input label="Phone" value={newLead.phone} onChange={(e) => setNewLead({...newLead, phone: e.target.value})} placeholder="+1 234 567 890"/>
          <Select label="Source" value={newLead.leadSource} onChange={(e) => setNewLead({...newLead, leadSource: e.target.value})} options={[
            {value:'Website',label:'Website'},{value:'LinkedIn',label:'LinkedIn'},{value:'Referral',label:'Referral'},{value:'Cold Email',label:'Cold Email'},{value:'Event',label:'Event'}
          ]}/>
          <Input label="Salesperson" value={newLead.assignedSalesperson} onChange={(e) => setNewLead({...newLead, assignedSalesperson: e.target.value})} placeholder="Assignee name"/>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
