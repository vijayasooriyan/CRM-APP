import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadsService } from '@/services/index';
import { Button, Card, Input, Select, Table, Pagination, Modal, LoadingSpinner, Toast } from '@/components/ui';

export const LeadsListPage = () => {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    leadSource: '',
    assignedSalesperson: '',
    search: '',
  });

  // Sorting
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    leadName: '',
    companyName: '',
    email: '',
    phone: '',
    leadSource: 'Website',
    assignedSalesperson: '',
    status: 'New',
    dealValue: '',
  });

  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState(null);

  // Fetch leads
  useEffect(() => {
    fetchLeads();
  }, [page, filters, sortBy, sortOrder]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await leadsService.getAllLeads({
        page,
        limit,
        ...filters,
        sortBy,
        sortOrder,
      });
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
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
    setPage(1);
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    setFormError(null);
    setIsCreating(true);

    try {
      await leadsService.createLead({
        ...formData,
        dealValue: Number(formData.dealValue),
      });
      setToast({ message: 'Lead created successfully', type: 'success' });
      setFormData({
        leadName: '',
        companyName: '',
        email: '',
        phone: '',
        leadSource: 'Website',
        assignedSalesperson: '',
        status: 'New',
        dealValue: '',
      });
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

  const columns = [
    {
      key: 'leadName',
      label: 'Lead Name',
      render: (row) => <span className="font-semibold text-blue-600">{row.leadName}</span>,
    },
    {
      key: 'companyName',
      label: 'Company',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const statusColors = {
          New: 'bg-blue-100 text-blue-800',
          Contacted: 'bg-yellow-100 text-yellow-800',
          Qualified: 'bg-purple-100 text-purple-800',
          'Proposal Sent': 'bg-indigo-100 text-indigo-800',
          Won: 'bg-green-100 text-green-800',
          Lost: 'bg-red-100 text-red-800',
        };
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[row.status]}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      key: 'dealValue',
      label: 'Deal Value',
      render: (row) => `$${row.dealValue?.toLocaleString()}`,
    },
  ];

  if (loading && leads.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <Button onClick={() => setShowModal(true)} variant="primary">
          + New Lead
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Filters & Search</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            placeholder="Search by name, company, email..."
            value={filters.search}
            onChange={handleSearchChange}
          />
          <Select
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'New', label: 'New' },
              { value: 'Contacted', label: 'Contacted' },
              { value: 'Qualified', label: 'Qualified' },
              { value: 'Proposal Sent', label: 'Proposal Sent' },
              { value: 'Won', label: 'Won' },
              { value: 'Lost', label: 'Lost' },
            ]}
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          />
          <Select
            options={[
              { value: '', label: 'All Sources' },
              { value: 'Website', label: 'Website' },
              { value: 'LinkedIn', label: 'LinkedIn' },
              { value: 'Referral', label: 'Referral' },
              { value: 'Cold Email', label: 'Cold Email' },
              { value: 'Event', label: 'Event' },
            ]}
            name="leadSource"
            value={filters.leadSource}
            onChange={handleFilterChange}
          />
          <Select
            options={[
              { value: '', label: 'All Salespersons' },
              { value: 'John Doe', label: 'John Doe' },
              { value: 'Sarah Johnson', label: 'Sarah Johnson' },
            ]}
            name="assignedSalesperson"
            value={filters.assignedSalesperson}
            onChange={handleFilterChange}
          />
          <Select
            options={[
              { value: 'createdAt', label: 'Date Created' },
              { value: 'dealValue', label: 'Deal Value' },
              { value: 'leadName', label: 'Lead Name' },
            ]}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />
        </div>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Leads Table */}
      <Card>
        {leads.length > 0 ? (
          <>
            <Table
              columns={columns}
              data={leads}
              onRowClick={(row) => navigate(`/leads/${row._id}`)}
            />
            <Pagination
              current={page}
              total={total}
              pages={pages}
              onPageChange={setPage}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No leads found</p>
            <Button onClick={() => setShowModal(true)} className="mt-4">
              Create First Lead
            </Button>
          </div>
        )}
      </Card>

      {/* Create Lead Modal */}
      <Modal
        isOpen={showModal}
        title="Create New Lead"
        onClose={() => {
          setShowModal(false);
          setFormError(null);
        }}
        onConfirm={(e) => handleCreateLead(e)}
        confirmText="Create"
      >
        <form onSubmit={handleCreateLead}>
          <Input
            label="Lead Name"
            placeholder="John Smith"
            value={formData.leadName}
            onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
            required
            error={formError}
          />
          <Input
            label="Company Name"
            placeholder="Tech Corp"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Phone"
            placeholder="+1-555-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <Select
            label="Lead Source"
            options={[
              { value: 'Website', label: 'Website' },
              { value: 'LinkedIn', label: 'LinkedIn' },
              { value: 'Referral', label: 'Referral' },
              { value: 'Cold Email', label: 'Cold Email' },
              { value: 'Event', label: 'Event' },
            ]}
            value={formData.leadSource}
            onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
            required
          />
          <Input
            label="Assigned Salesperson"
            placeholder="John Doe"
            value={formData.assignedSalesperson}
            onChange={(e) => setFormData({ ...formData, assignedSalesperson: e.target.value })}
            required
          />
          <Input
            label="Deal Value"
            type="number"
            placeholder="50000"
            value={formData.dealValue}
            onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })}
            required
          />
        </form>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
