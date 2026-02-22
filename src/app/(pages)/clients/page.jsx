// app/(pages)/clients/page.jsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  MoreVertical
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import './client.css';

export default function ClientsPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Default clients for first-time users
  const defaultClients = [
    {
      id: 1,
      fullName: 'John Doe',
      company: 'Acme Corp',
      email: 'john@acme.com',
      phone: '+1 234-567-8901',
      notes: 'Premium client',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      fullName: 'Jane Smith',
      company: 'Tech Solutions',
      email: 'jane@techsol.com',
      phone: '+1 345-678-9012',
      notes: 'Monthly retainer',
      createdAt: '2024-02-20'
    },
    {
      id: 3,
      fullName: 'Bob Johnson',
      company: 'Creative Agency',
      email: 'bob@creative.com',
      phone: '+1 456-789-0123',
      notes: 'Project based',
      createdAt: '2024-03-10'
    }
  ];

  // Load clients from localStorage on component mount
  useEffect(() => {
    const loadClients = () => {
      try {
        const savedClients = localStorage.getItem('clients');
        if (savedClients) {
          setClients(JSON.parse(savedClients));
        } else {
          // Use default clients for first-time users
          setClients(defaultClients);
          localStorage.setItem('clients', JSON.stringify(defaultClients));
        }
      } catch (error) {
        console.error('Error loading clients:', error);
        setClients(defaultClients);
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, []); // Empty dependency array - runs once on mount

  // Save clients to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && clients.length > 0) {
      localStorage.setItem('clients', JSON.stringify(clients));
    }
  }, [clients, isLoading]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    return newErrors;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      fullName: '',
      company: '',
      email: '',
      phone: '',
      notes: ''
    });
    setErrors({});
    setEditingClient(null);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (editingClient) {
        // Update existing client
        setClients(prev => prev.map(client => 
          client.id === editingClient.id 
            ? { ...formData, id: editingClient.id, updatedAt: new Date().toISOString().split('T')[0] }
            : client
        ));
        setSuccessMessage('Client updated successfully!');
      } else {
        // Add new client
        const newClient = {
          ...formData,
          id: Date.now(),
          createdAt: new Date().toISOString().split('T')[0]
        };
        setClients(prev => [newClient, ...prev]);
        setSuccessMessage('Client added successfully!');
      }

      setIsSubmitting(false);
      setShowSuccess(true);
      resetForm();
      setShowForm(false);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1500);
  }, [editingClient, formData, resetForm, validateForm]);

  const handleEdit = useCallback((client) => {
    setEditingClient(client);
    setFormData({
      fullName: client.fullName,
      company: client.company || '',
      email: client.email,
      phone: client.phone,
      notes: client.notes || ''
    });
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((id) => {
    setDeleteConfirm(id);
  }, []);

  const confirmDelete = useCallback(() => {
    setClients(prev => prev.filter(client => client.id !== deleteConfirm));
    setSuccessMessage('Client deleted successfully!');
    setShowSuccess(true);
    setDeleteConfirm(null);
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  }, [deleteConfirm]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const filteredClients = clients.filter(client =>
    client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading clients...</p>
      </div>
    );
  }

  return (
    <div className="clients-container">
      {/* Success Message */}
      {showSuccess && (
        <div className="success-message">
          <CheckCircle size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Confirm Delete</h3>
            <p className="modal-text">Are you sure you want to delete this client? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="modal-btn delete" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={handleBack}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="page-title">Clients</h1>
            <p className="page-subtitle">Manage your client relationships</p>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="action-btn primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <Plus size={18} />
            <span>Add New Client</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search clients by name, company or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm('')}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Clients Table */}
      <div className="clients-table-container">
        {filteredClients.length === 0 ? (
          <div className="no-clients">
            <User size={48} className="no-clients-icon" />
            <h3 className="no-clients-title">No clients found</h3>
            <p className="no-clients-text">
              {searchTerm ? 'Try a different search term' : 'Get started by adding your first client'}
            </p>
            {!searchTerm && (
              <button 
                className="add-first-client"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                <Plus size={18} />
                <span>Add Your First Client</span>
              </button>
            )}
          </div>
        ) : (
          <table className="clients-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Company</th>
                <th>Contact</th>
                <th>Notes</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id}>
                  <td>
                    <div className="client-info">
                      <div className="client-avatar">
                        <User size={16} />
                      </div>
                      <span className="client-name">{client.fullName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="company-info">
                      <Building2 size={14} />
                      <span>{client.company || '—'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div className="contact-item">
                        <Mail size={12} />
                        <span>{client.email}</span>
                      </div>
                      <div className="contact-item">
                        <Phone size={12} />
                        <span>{client.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="notes-cell">
                      {client.notes ? (
                        <>
                          <FileText size={14} />
                          <span className="notes-text">{client.notes.substring(0, 30)}...</span>
                        </>
                      ) : (
                        <span className="no-notes">—</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="date-added">{client.createdAt}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn-icon edit"
                        onClick={() => handleEdit(client)}
                        title="Edit client"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="action-btn-icon delete"
                        onClick={() => handleDelete(client.id)}
                        title="Delete client"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Client Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content form-modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingClient ? 'Edit Client' : 'New Client'}
              </h2>
              <button className="modal-close" onClick={() => {
                setShowForm(false);
                resetForm();
              }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {/* Personal Info Section */}
              <div className="form-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <User size={18} />
                    PERSONAL INFO
                  </h3>
                </div>

                <div className="form-grid">
                  <div className="form-field full-width">
                    <label className="field-label">
                      Full Name <span className="required">*</span>
                    </label>
                    <div className={`input-wrapper ${errors.fullName ? 'error' : ''}`}>
                      <User size={18} className="input-icon" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="form-input"
                      />
                      {errors.fullName && (
                        <div className="error-tooltip">
                          <AlertCircle size={14} />
                          <span>{errors.fullName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-field full-width">
                    <label className="field-label">Company</label>
                    <div className="input-wrapper">
                      <Building2 size={18} className="input-icon" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Acme Corp"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="form-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <Mail size={18} />
                    CONTACT
                  </h3>
                </div>

                <div className="form-grid">
                  <div className="form-field full-width">
                    <label className="field-label">
                      Email <span className="required">*</span>
                    </label>
                    <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                      <Mail size={18} className="input-icon" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="form-input"
                      />
                      {errors.email && (
                        <div className="error-tooltip">
                          <AlertCircle size={14} />
                          <span>{errors.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-field full-width">
                    <label className="field-label">
                      Phone <span className="required">*</span>
                    </label>
                    <div className={`input-wrapper ${errors.phone ? 'error' : ''}`}>
                      <Phone size={18} className="input-icon" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 234-567-8901"
                        className="form-input"
                      />
                      {errors.phone && (
                        <div className="error-tooltip">
                          <AlertCircle size={14} />
                          <span>{errors.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Section */}
              <div className="form-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <FileText size={18} />
                    ADDITIONAL
                  </h3>
                </div>

                <div className="form-field full-width">
                  <label className="field-label">Notes</label>
                  <div className="input-wrapper">
                    <FileText size={18} className="input-icon textarea-icon" />
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any additional notes..."
                      className="form-input textarea"
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="modal-btn cancel"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="modal-btn save"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner-small"></div>
                      <span>{editingClient ? 'Updating...' : 'Creating...'}</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>{editingClient ? 'Update Client' : 'Create Client'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}