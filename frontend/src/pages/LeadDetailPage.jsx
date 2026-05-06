import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leadsService } from '@/services/index';
import { Button, Card, Input, Select, LoadingSpinner, Toast, Modal } from '@/components/ui';

export const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
      const response = await leadsService.addNote(id, {
        content: noteContent,
        createdBy: 'Current User',
      });
      setLead(response.data.lead);
      setNoteContent('');
      setToast({ message: 'Note added successfully', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to add note', type: 'error' });
    } finally {
      setAddingNote(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await leadsService.updateLead(id, formData);
      setLead(response.data.lead);
      setEditMode(false);
      setToast({ message: 'Lead updated successfully', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to update lead', type: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await leadsService.deleteLead(id);
      setToast({ message: 'Lead deleted successfully', type: 'success' });
      setTimeout(() => navigate('/leads'), 1000);
    } catch (err) {
      setToast({ message: 'Failed to delete lead', type: 'error' });
    } finally {
      setDeleteModal(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/leads')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Leads
        </button>
        <div className="flex gap-3">
          {!editMode ? (
            <>
              <Button onClick={() => setEditMode(true)} variant="secondary">
                Edit
              </Button>
              <Button onClick={() => setDeleteModal(true)} variant="danger">
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setEditMode(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleSave} variant="success">
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Lead Information</h2>
            {editMode ? (
              <div className="space-y-4">
                <Input
                  label="Lead Name"
                  value={formData.leadName}
                  onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                />
                <Input
                  label="Company Name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Select
                  label="Lead Source"
                  value={formData.leadSource}
                  onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                  options={[
                    { value: 'Website', label: 'Website' },
                    { value: 'LinkedIn', label: 'LinkedIn' },
                    { value: 'Referral', label: 'Referral' },
                    { value: 'Cold Email', label: 'Cold Email' },
                    { value: 'Event', label: 'Event' },
                  ]}
                />
                <Input
                  label="Assigned Salesperson"
                  value={formData.assignedSalesperson}
                  onChange={(e) => setFormData({ ...formData, assignedSalesperson: e.target.value })}
                />
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  options={[
                    { value: 'New', label: 'New' },
                    { value: 'Contacted', label: 'Contacted' },
                    { value: 'Qualified', label: 'Qualified' },
                    { value: 'Proposal Sent', label: 'Proposal Sent' },
                    { value: 'Won', label: 'Won' },
                    { value: 'Lost', label: 'Lost' },
                  ]}
                />
                <Input
                  label="Deal Value"
                  type="number"
                  value={formData.dealValue}
                  onChange={(e) => setFormData({ ...formData, dealValue: Number(e.target.value) })}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Lead Name</p>
                  <p className="font-semibold text-gray-900">{lead.leadName}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Company Name</p>
                  <p className="font-semibold text-gray-900">{lead.companyName}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="font-semibold text-gray-900">{lead.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Phone</p>
                  <p className="font-semibold text-gray-900">{lead.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Lead Source</p>
                  <p className="font-semibold text-gray-900">{lead.leadSource}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Assigned Salesperson</p>
                  <p className="font-semibold text-gray-900">{lead.assignedSalesperson}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className="font-semibold text-gray-900">{lead.status}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Deal Value</p>
                  <p className="font-semibold text-gray-900">${lead.dealValue?.toLocaleString()}</p>
                </div>
              </div>
            )}
          </Card>

          {/* Notes Section */}
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Notes</h3>

            <div className="mb-4">
              <textarea
                placeholder="Add a note..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                disabled={addingNote}
              />
              <Button
                onClick={handleAddNote}
                className="mt-2"
                disabled={addingNote || !noteContent.trim()}
              >
                {addingNote ? 'Adding...' : 'Add Note'}
              </Button>
            </div>

            <div className="space-y-3">
              {lead.notes && lead.notes.length > 0 ? (
                [...lead.notes].reverse().map((note, idx) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-gray-700">{note.content}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      By {note.createdBy} • {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No notes yet</p>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium">Deal Value</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                ${lead.dealValue?.toLocaleString()}
              </p>
            </div>
          </Card>

          <Card>
            <div>
              <p className="text-gray-600 text-sm font-medium">Status</p>
              <p className="text-xl font-bold text-gray-900 mt-2">{lead.status}</p>
            </div>
            <div className="mt-4">
              <p className="text-gray-600 text-sm font-medium">Created</p>
              <p className="text-sm text-gray-700 mt-1">
                {new Date(lead.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-gray-600 text-sm font-medium">Last Updated</p>
              <p className="text-sm text-gray-700 mt-1">
                {new Date(lead.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal}
        title="Delete Lead"
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        confirmText="Delete"
      >
        <p>Are you sure you want to delete this lead? This action cannot be undone.</p>
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
