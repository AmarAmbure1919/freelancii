// app/(pages)/projects/page.jsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FolderKanban,
  Globe,
  Smartphone,
  Code,
  PenTool,
  MoreHorizontal,
  Calendar,
  DollarSign,
  User,
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
  Clock,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Tag,
  Layers,
  Hash,
  Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import './project.css';

export default function ProjectsPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState([]);
  const [techSearch, setTechSearch] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'web',
    status: 'planning',
    clientId: '',
    budget: '',
    paymentType: 'fixed',
    startDate: '',
    endDate: '',
    techStack: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState([]);

  // Project types
  const projectTypes = [
    { id: 'web', label: 'Web', icon: <Globe size={16} /> },
    { id: 'app', label: 'App', icon: <Smartphone size={16} /> },
    { id: 'software', label: 'Software', icon: <Code size={16} /> },
    { id: 'design', label: 'Design', icon: <PenTool size={16} /> },
    { id: 'other', label: 'Other', icon: <FolderKanban size={16} /> }
  ];

  // Project statuses
  const projectStatuses = [
    { id: 'planning', label: 'Planning', icon: <Clock size={16} />, color: '#ffa500' },
    { id: 'ongoing', label: 'Ongoing', icon: <PlayCircle size={16} />, color: '#00ffff' },
    { id: 'onhold', label: 'On Hold', icon: <PauseCircle size={16} />, color: '#ff4444' },
    { id: 'completed', label: 'Completed', icon: <CheckCircle2 size={16} />, color: '#00ff00' }
  ];

  // Available tech stack options
  const techStackOptions = [
    'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte',
    'Flutter', 'React Native', 'Kotlin', 'Swift',
    'Node.js', 'Spring Boot', 'Django', 'FastAPI', 'Laravel', 'Express.js',
    'PostgreSQL', 'MongoDB', 'MySQL', 'Firebase',
    'TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes'
  ].sort();

  // Default projects for first-time users
  const defaultProjects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with React and Node.js',
      type: 'web',
      status: 'ongoing',
      clientId: 1,
      clientName: 'John Doe',
      budget: 15000,
      paymentType: 'fixed',
      startDate: '2024-02-01',
      endDate: '2024-05-30',
      techStack: ['React', 'Node.js', 'PostgreSQL'],
      createdAt: '2024-02-01'
    },
    {
      id: 2,
      title: 'Mobile Banking App',
      description: 'Cross-platform mobile banking application',
      type: 'app',
      status: 'planning',
      clientId: 2,
      clientName: 'Jane Smith',
      budget: 25000,
      paymentType: 'hourly',
      startDate: '2024-03-15',
      endDate: '',
      techStack: ['Flutter', 'Firebase', 'Kotlin'],
      createdAt: '2024-03-10'
    },
    {
      id: 3,
      title: 'CRM Dashboard',
      description: 'Customer relationship management dashboard',
      type: 'software',
      status: 'onhold',
      clientId: 3,
      clientName: 'Bob Johnson',
      budget: 12000,
      paymentType: 'fixed',
      startDate: '2024-01-10',
      endDate: '2024-04-20',
      techStack: ['Next.js', 'TypeScript', 'PostgreSQL'],
      createdAt: '2024-01-10'
    }
  ];

  // Load clients for dropdown
  useEffect(() => {
    try {
      const savedClients = localStorage.getItem('clients');
      if (savedClients) {
        setClients(JSON.parse(savedClients));
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  }, []);

  // Load projects from localStorage on component mount
  useEffect(() => {
    const loadProjects = () => {
      try {
        const savedProjects = localStorage.getItem('projects');
        if (savedProjects) {
          setProjects(JSON.parse(savedProjects));
        } else {
          setProjects(defaultProjects);
          localStorage.setItem('projects', JSON.stringify(defaultProjects));
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects(defaultProjects);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && projects.length > 0) {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }, [projects, isLoading]);

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

  const handleTypeSelect = useCallback((typeId) => {
    setFormData(prev => ({
      ...prev,
      type: typeId
    }));
  }, []);

  const handleStatusSelect = useCallback((statusId) => {
    setFormData(prev => ({
      ...prev,
      status: statusId
    }));
  }, []);

  const handleTechToggle = useCallback((tech) => {
    setSelectedTech(prev => {
      if (prev.includes(tech)) {
        return prev.filter(t => t !== tech);
      } else {
        return [...prev, tech];
      }
    });
    setFormData(prev => ({
      ...prev,
      techStack: selectedTech.includes(tech) 
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }));
  }, [selectedTech]);

  const filteredTechOptions = techStackOptions.filter(tech =>
    tech.toLowerCase().includes(techSearch.toLowerCase())
  );

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.clientId) newErrors.clientId = 'Please select a client';
    if (!formData.budget) {
      newErrors.budget = 'Budget is required';
    } else if (isNaN(formData.budget) || Number(formData.budget) <= 0) {
      newErrors.budget = 'Please enter a valid budget';
    }
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    return newErrors;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      type: 'web',
      status: 'planning',
      clientId: '',
      budget: '',
      paymentType: 'fixed',
      startDate: '',
      endDate: '',
      techStack: []
    });
    setSelectedTech([]);
    setTechSearch('');
    setErrors({});
    setEditingProject(null);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Get client name
    const selectedClient = clients.find(c => c.id === Number(formData.clientId));

    setTimeout(() => {
      if (editingProject) {
        // Update existing project
        setProjects(prev => prev.map(project => 
          project.id === editingProject.id 
            ? { 
                ...formData, 
                id: editingProject.id,
                clientName: selectedClient?.fullName || 'Unknown',
                budget: Number(formData.budget),
                updatedAt: new Date().toISOString().split('T')[0]
              }
            : project
        ));
        setSuccessMessage('Project updated successfully!');
      } else {
        // Add new project
        const newProject = {
          ...formData,
          id: Date.now(),
          clientName: selectedClient?.fullName || 'Unknown',
          budget: Number(formData.budget),
          createdAt: new Date().toISOString().split('T')[0]
        };
        setProjects(prev => [newProject, ...prev]);
        setSuccessMessage('Project added successfully!');
      }

      setIsSubmitting(false);
      setShowSuccess(true);
      resetForm();
      setShowForm(false);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1500);
  }, [editingProject, formData, clients, resetForm, validateForm]);

  const handleEdit = useCallback((project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      type: project.type,
      status: project.status,
      clientId: project.clientId,
      budget: project.budget,
      paymentType: project.paymentType,
      startDate: project.startDate,
      endDate: project.endDate || '',
      techStack: project.techStack || []
    });
    setSelectedTech(project.techStack || []);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((id) => {
    setDeleteConfirm(id);
  }, []);

  const confirmDelete = useCallback(() => {
    setProjects(prev => prev.filter(project => project.id !== deleteConfirm));
    setSuccessMessage('Project deleted successfully!');
    setShowSuccess(true);
    setDeleteConfirm(null);
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  }, [deleteConfirm]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const getStatusIcon = (status) => {
    const statusObj = projectStatuses.find(s => s.id === status);
    return statusObj?.icon || <Clock size={14} />;
  };

  const getStatusColor = (status) => {
    const statusObj = projectStatuses.find(s => s.id === status);
    return statusObj?.color || '#00ffff';
  };

  const getTypeIcon = (type) => {
    const typeObj = projectTypes.find(t => t.id === type);
    return typeObj?.icon || <FolderKanban size={14} />;
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="projects-container">
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
            <p className="modal-text">Are you sure you want to delete this project? This action cannot be undone.</p>
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
            <h1 className="page-title">Projects</h1>
            <p className="page-subtitle">Manage your projects and track progress</p>
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
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search projects by title, client or description..."
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

      {/* Projects Table */}
      <div className="projects-table-container">
        {filteredProjects.length === 0 ? (
          <div className="no-projects">
            <FolderKanban size={48} className="no-projects-icon" />
            <h3 className="no-projects-title">No projects found</h3>
            <p className="no-projects-text">
              {searchTerm ? 'Try a different search term' : 'Get started by adding your first project'}
            </p>
            {!searchTerm && (
              <button 
                className="add-first-project"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                <Plus size={18} />
                <span>Add Your First Project</span>
              </button>
            )}
          </div>
        ) : (
          <table className="projects-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Type</th>
                <th>Status</th>
                <th>Client</th>
                <th>Budget</th>
                <th>Timeline</th>
                <th>Tech Stack</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(project => (
                <tr key={project.id}>
                  <td>
                    <div className="project-info">
                      <div className="project-avatar">
                        <FolderKanban size={16} />
                      </div>
                      <div>
                        <span className="project-title">{project.title}</span>
                        {project.description && (
                          <span className="project-description">
                            {project.description.substring(0, 30)}...
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="project-type">
                      {getTypeIcon(project.type)}
                      <span className="type-label">
                        {projectTypes.find(t => t.id === project.type)?.label || project.type}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div 
                      className="project-status"
                      style={{ 
                        backgroundColor: `${getStatusColor(project.status)}20`,
                        borderColor: getStatusColor(project.status)
                      }}
                    >
                      {getStatusIcon(project.status)}
                      <span style={{ color: getStatusColor(project.status) }}>
                        {projectStatuses.find(s => s.id === project.status)?.label || project.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="project-client">
                      <User size={14} />
                      <span>{project.clientName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="project-budget">
                      <DollarSign size={14} />
                      <span>${project.budget?.toLocaleString()}</span>
                      <small className="payment-type">
                        {project.paymentType === 'fixed' ? 'Fixed' : 'Hourly'}
                      </small>
                    </div>
                  </td>
                  <td>
                    <div className="project-timeline">
                      <div className="timeline-item">
                        <Calendar size={12} />
                        <span>{project.startDate}</span>
                      </div>
                      {project.endDate && (
                        <div className="timeline-item">
                          <Calendar size={12} />
                          <span>{project.endDate}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="tech-stack-preview">
                      {project.techStack?.slice(0, 3).map((tech, index) => (
                        <span key={index} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                      {project.techStack?.length > 3 && (
                        <span className="tech-tag more">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn-icon edit"
                        onClick={() => handleEdit(project)}
                        title="Edit project"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="action-btn-icon delete"
                        onClick={() => handleDelete(project.id)}
                        title="Delete project"
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

      {/* Project Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content form-modal project-form-modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingProject ? 'Edit Project' : 'New Project'}
              </h2>
              <button className="modal-close" onClick={() => {
                setShowForm(false);
                resetForm();
              }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {/* Project Type & Status Row */}
              <div className="form-row">
                {/* Type Selection */}
                <div className="form-section half-width">
                  <div className="section-header">
                    <h3 className="section-title">
                      <Layers size={18} />
                      TYPE
                    </h3>
                  </div>
                  <div className="type-grid">
                    {projectTypes.map(type => (
                      <button
                        key={type.id}
                        type="button"
                        className={`type-btn ${formData.type === type.id ? 'active' : ''}`}
                        onClick={() => handleTypeSelect(type.id)}
                      >
                        {type.icon}
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Selection */}
                <div className="form-section half-width">
                  <div className="section-header">
                    <h3 className="section-title">
                      <Clock size={18} />
                      STATUS
                    </h3>
                  </div>
                  <div className="status-grid">
                    {projectStatuses.map(status => (
                      <button
                        key={status.id}
                        type="button"
                        className={`status-btn ${formData.status === status.id ? 'active' : ''}`}
                        onClick={() => handleStatusSelect(status.id)}
                        style={{ 
                          borderColor: status.color,
                          backgroundColor: formData.status === status.id ? `${status.color}20` : 'transparent'
                        }}
                      >
                        <span style={{ color: status.color }}>{status.icon}</span>
                        <span style={{ color: status.color }}>{status.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Project Info Section */}
              <div className="form-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <FileText size={18} />
                    PROJECT INFO
                  </h3>
                </div>

                <div className="form-grid">
                  <div className="form-field full-width">
                    <label className="field-label">
                      Project Title <span className="required">*</span>
                    </label>
                    <div className={`input-wrapper ${errors.title ? 'error' : ''}`}>
                      <FolderKanban size={18} className="input-icon" />
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="My Awesome Project"
                        className="form-input"
                      />
                      {errors.title && (
                        <div className="error-tooltip">
                          <AlertCircle size={14} />
                          <span>{errors.title}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-field full-width">
                    <label className="field-label">Description</label>
                    <div className="input-wrapper">
                      <FileText size={18} className="input-icon textarea-icon" />
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Brief overview..."
                        className="form-input textarea"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Selection */}
              <div className="form-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <Users size={18} />
                    CLIENT
                  </h3>
                </div>

                <div className="form-field full-width">
                  <label className="field-label">
                    Select Client <span className="required">*</span>
                  </label>
                  <div className={`input-wrapper ${errors.clientId ? 'error' : ''}`}>
                    <User size={18} className="input-icon" />
                    <select
                      name="clientId"
                      value={formData.clientId}
                      onChange={handleInputChange}
                      className="form-input select-input"
                    >
                      <option value="">Choose a client...</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.fullName} {client.company ? `(${client.company})` : ''}
                        </option>
                      ))}
                    </select>
                    {errors.clientId && (
                      <div className="error-tooltip">
                        <AlertCircle size={14} />
                        <span>{errors.clientId}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Budget & Payment Section */}
              <div className="form-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <DollarSign size={18} />
                    BUDGET & PAYMENT
                  </h3>
                </div>

                <div className="form-grid">
                  <div className="form-field">
                    <label className="field-label">
                      Budget ($) <span className="required">*</span>
                    </label>
                    <div className={`input-wrapper ${errors.budget ? 'error' : ''}`}>
                      <DollarSign size={18} className="input-icon" />
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        placeholder="5000"
                        className="form-input"
                        min="0"
                        step="100"
                      />
                      {errors.budget && (
                        <div className="error-tooltip">
                          <AlertCircle size={14} />
                          <span>{errors.budget}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Payment Type</label>
                    <div className="payment-type-selector">
                      <button
                        type="button"
                        className={`payment-type-btn ${formData.paymentType === 'fixed' ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, paymentType: 'fixed' }))}
                      >
                        <Hash size={16} />
                        <span>Fixed</span>
                      </button>
                      <button
                        type="button"
                        className={`payment-type-btn ${formData.paymentType === 'hourly' ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, paymentType: 'hourly' }))}
                      >
                        <Clock size={16} />
                        <span>Hourly</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Section */}
              <div className="form-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <Calendar size={18} />
                    TIMELINE
                  </h3>
                </div>

                <div className="form-grid">
                  <div className="form-field">
                    <label className="field-label">
                      Start Date <span className="required">*</span>
                    </label>
                    <div className={`input-wrapper ${errors.startDate ? 'error' : ''}`}>
                      <Calendar size={18} className="input-icon" />
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                      {errors.startDate && (
                        <div className="error-tooltip">
                          <AlertCircle size={14} />
                          <span>{errors.startDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="field-label">End Date (opt.)</label>
                    <div className="input-wrapper">
                      <Calendar size={18} className="input-icon" />
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech Stack Section */}
              <div className="form-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <Code size={18} />
                    TECH STACK
                  </h3>
                </div>

                <div className="tech-stack-container">
                  {/* Search Input */}
                  <div className="tech-search">
                    <Search size={16} className="tech-search-icon" />
                    <input
                      type="text"
                      placeholder="Search technologies..."
                      value={techSearch}
                      onChange={(e) => setTechSearch(e.target.value)}
                      className="tech-search-input"
                    />
                  </div>

                  {/* Selected Technologies */}
                  {selectedTech.length > 0 && (
                    <div className="selected-tech">
                      <span className="selected-tech-label">Selected:</span>
                      <div className="selected-tech-tags">
                        {selectedTech.map(tech => (
                          <span key={tech} className="selected-tech-tag">
                            {tech}
                            <button
                              type="button"
                              onClick={() => handleTechToggle(tech)}
                              className="remove-tech"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tech Stack Grid */}
                  <div className="tech-grid">
                    {filteredTechOptions.map(tech => (
                      <button
                        key={tech}
                        type="button"
                        className={`tech-btn ${selectedTech.includes(tech) ? 'selected' : ''}`}
                        onClick={() => handleTechToggle(tech)}
                      >
                        <Tag size={12} />
                        <span>{tech}</span>
                      </button>
                    ))}
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
                      <span>{editingProject ? 'Updating...' : 'Creating...'}</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>{editingProject ? 'Update Project' : 'Create Project'}</span>
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