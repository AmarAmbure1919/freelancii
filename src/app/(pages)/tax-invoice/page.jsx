/* eslint-disable react-hooks/set-state-in-effect */
// app/(pages)/invoices/create/page.jsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  FileText,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Percent,
  Hash,
  Calendar,
  CreditCard,
  Download,
  Printer,
  X,
  User,
  Package,
  Receipt,
  DollarSign,
  Tag,
  Briefcase,
  Home,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import './create-invoice.css';

export default function CreateInvoicePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [clients, setClients] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Generate invoice number only once on component mount
  const generateInvoiceNumber = useCallback(() => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000);
    return `INV-${year}${String(random).padStart(4, '0')}`;
  }, []);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = useCallback(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // GST State
  const [gstData, setGstData] = useState({
    rate: 18,
    type: 'cgst_sgst',
    cgst: 9,
    sgst: 9,
    igst: 0
  });

  // Business Details State
  const [businessData, setBusinessData] = useState({
    name: '',
    address: '',
    gstin: '',
    pan: '',
    email: '',
    phone: ''
  });

  // Client Details State
  const [clientData, setClientData] = useState({
    id: '',
    name: '',
    address: '',
    gstin: '',
    email: '',
    phone: ''
  });

  // Invoice Details State - Initialize after component mounts
  const [invoiceData, setInvoiceData] = useState({
    number: '',
    poNumber: '',
    date: '',
    dueDate: '',
    placeOfSupply: ''
  });

  // Items State
  const [items, setItems] = useState([
    {
      id: 1,
      description: '',
      hsn: '1',
      quantity: 1,
      rate: 0,
      amount: 0
    }
  ]);

  // Additional Info State
  const [additionalData, setAdditionalData] = useState({
    paymentTerms: 'Payment due within 15 days',
    notes: 'Thank you for your business!'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize invoice data after component mounts
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInvoiceData({
      number: generateInvoiceNumber(),
      poNumber: '',
      date: getTodayDate(),
      dueDate: '',
      placeOfSupply: ''
    });
    setIsInitialized(true);
  }, [generateInvoiceNumber, getTodayDate]);

  // Load clients for selection
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

  // Update GST calculations when rate changes
  useEffect(() => {
    const rate = Number(gstData.rate);
    if (gstData.type === 'cgst_sgst') {
      setGstData(prev => ({
        ...prev,
        cgst: rate / 2,
        sgst: rate / 2,
        igst: 0
      }));
    } else {
      setGstData(prev => ({
        ...prev,
        cgst: 0,
        sgst: 0,
        igst: rate
      }));
    }
  }, [gstData.rate, gstData.type]);

  // Calculate item amount
  const calculateItemAmount = useCallback((item) => {
    return item.quantity * item.rate;
  }, []);

  // Update item
  const updateItem = useCallback((id, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        updatedItem.amount = calculateItemAmount(updatedItem);
        return updatedItem;
      }
      return item;
    }));
  }, [calculateItemAmount]);

  // Add new item
  const addItem = useCallback(() => {
    setItems(prev => [
      ...prev,
      {
        id: Date.now(),
        description: '',
        hsn: '1',
        quantity: 1,
        rate: 0,
        amount: 0
      }
    ]);
  }, []);

  // Remove item
  const removeItem = useCallback((id) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  }, [items.length]);

  // Calculate subtotal
  const calculateSubtotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  }, [items]);

  // Calculate tax amounts
  const calculateTax = useCallback(() => {
    const subtotal = calculateSubtotal();
    if (gstData.type === 'cgst_sgst') {
      return {
        cgst: (subtotal * gstData.cgst) / 100,
        sgst: (subtotal * gstData.sgst) / 100,
        igst: 0
      };
    } else {
      return {
        cgst: 0,
        sgst: 0,
        igst: (subtotal * gstData.igst) / 100
      };
    }
  }, [calculateSubtotal, gstData]);

  // Calculate total
  const calculateTotal = useCallback(() => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    return subtotal + tax.cgst + tax.sgst + tax.igst;
  }, [calculateSubtotal, calculateTax]);

  // Handle client selection
  const handleClientSelect = useCallback((clientId) => {
    const client = clients.find(c => c.id === Number(clientId));
    if (client) {
      setClientData({
        id: client.id,
        name: client.fullName,
        address: client.company || '',
        gstin: '',
        email: client.email,
        phone: client.phone
      });
    }
  }, [clients]);

  // Validate current step
  const validateStep = useCallback(() => {
    const newErrors = {};

    switch (currentStep) {
      case 1: // Business Details
        if (!businessData.name.trim()) newErrors.businessName = 'Business name is required';
        if (!businessData.address.trim()) newErrors.businessAddress = 'Address is required';
        if (businessData.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(businessData.gstin)) {
          newErrors.businessGstin = 'Invalid GSTIN format';
        }
        if (businessData.pan && !/[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(businessData.pan)) {
          newErrors.businessPan = 'Invalid PAN format';
        }
        break;

      case 2: // Client Details
        if (!clientData.name.trim()) newErrors.clientName = 'Client name is required';
        if (!clientData.address.trim()) newErrors.clientAddress = 'Address is required';
        break;

      case 3: // Items
        items.forEach((item, index) => {
          if (!item.description.trim()) {
            newErrors[`item_${item.id}_desc`] = `Item ${index + 1} description required`;
          }
          if (item.rate <= 0) {
            newErrors[`item_${item.id}_rate`] = `Item ${index + 1} rate must be greater than 0`;
          }
          if (item.quantity <= 0) {
            newErrors[`item_${item.id}_qty`] = `Item ${index + 1} quantity must be greater than 0`;
          }
        });
        break;

      case 4: // Additional Info
        // No required fields
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentStep, businessData, clientData, items]);

  // Handle next step
  const handleNext = useCallback(() => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  }, [validateStep]);

  // Handle previous step
  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  // Generate invoice
  const handleGenerateInvoice = useCallback(() => {
    if (!validateStep()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const subtotal = calculateSubtotal();
      const tax = calculateTax();
      const total = calculateTotal();

      const invoice = {
        id: `INV-${Date.now()}`,
        number: invoiceData.number,
        date: invoiceData.date,
        dueDate: invoiceData.dueDate,
        business: businessData,
        client: clientData,
        items: items.map(item => ({ ...item })),
        gst: gstData,
        subtotal,
        tax,
        total,
        additional: additionalData,
        createdAt: new Date().toISOString()
      };

      setGeneratedInvoice(invoice);
      setShowSuccess(true);
      setShowPreview(true);
      setIsSubmitting(false);

      // Save to localStorage
      try {
        const savedInvoices = localStorage.getItem('invoices') || '[]';
        const invoices = JSON.parse(savedInvoices);
        invoices.push(invoice);
        localStorage.setItem('invoices', JSON.stringify(invoices));
      } catch (error) {
        console.error('Error saving invoice:', error);
      }

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1500);
  }, [validateStep, calculateSubtotal, calculateTax, calculateTotal, invoiceData, businessData, clientData, items, gstData, additionalData]);

  // Download invoice as PDF (simulated)
  const handleDownload = useCallback(() => {
    alert('Downloading invoice... (PDF generation would be implemented here)');
  }, []);

  // Print invoice
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Close preview and return to invoices list
  const handleClosePreview = useCallback(() => {
    setShowPreview(false);
    router.push('/invoices');
  }, [router]);

  // Create new invoice
  const handleCreateNew = useCallback(() => {
    setCurrentStep(1);
    setBusinessData({
      name: '',
      address: '',
      gstin: '',
      pan: '',
      email: '',
      phone: ''
    });
    setClientData({
      id: '',
      name: '',
      address: '',
      gstin: '',
      email: '',
      phone: ''
    });
    setInvoiceData({
      number: generateInvoiceNumber(),
      poNumber: '',
      date: getTodayDate(),
      dueDate: '',
      placeOfSupply: ''
    });
    setItems([{
      id: 1,
      description: '',
      hsn: '1',
      quantity: 1,
      rate: 0,
      amount: 0
    }]);
    setAdditionalData({
      paymentTerms: 'Payment due within 15 days',
      notes: 'Thank you for your business!'
    });
    setErrors({});
    setShowPreview(false);
  }, [generateInvoiceNumber, getTodayDate]);

  // Calculate step progress
  const stepProgress = useMemo(() => {
    return ((currentStep - 1) / 4) * 100;
  }, [currentStep]);

  // Don't render until initialized
  if (!isInitialized) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="create-invoice-container">
      {/* Success Message */}
      {showSuccess && (
        <div className="success-message">
          <CheckCircle size={20} />
          <span>Invoice generated successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="page-title">Create Invoice</h1>
            <p className="page-subtitle">
              Step {currentStep} of 4 · {currentStep === 1 ? 'Business' : 
                currentStep === 2 ? 'Client' : 
                currentStep === 3 ? 'Items' : 'More'}
            </p>
          </div>
        </div>
        <div className="step-indicator">
          <div className="steps">
            <span className={`step ${currentStep >= 1 ? 'active' : ''}`}>Business</span>
            <ChevronRight size={14} className="step-separator" />
            <span className={`step ${currentStep >= 2 ? 'active' : ''}`}>Client</span>
            <ChevronRight size={14} className="step-separator" />
            <span className={`step ${currentStep >= 3 ? 'active' : ''}`}>Items</span>
            <ChevronRight size={14} className="step-separator" />
            <span className={`step ${currentStep >= 4 ? 'active' : ''}`}>More</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${stepProgress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Invoice Preview Modal */}
      {showPreview && generatedInvoice && (
        <div className="invoice-preview-modal">
          <div className="invoice-preview-content">
            <div className="preview-header">
              <h2 className="preview-title">Invoice Generated</h2>
              <button className="close-preview" onClick={handleClosePreview}>
                <X size={20} />
              </button>
            </div>

            <div className="invoice-actions">
              <button className="action-btn download" onClick={handleDownload}>
                <Download size={16} />
                <span>Download PDF</span>
              </button>
              <button className="action-btn print" onClick={handlePrint}>
                <Printer size={16} />
                <span>Print</span>
              </button>
              <button className="action-btn new" onClick={handleCreateNew}>
                <Plus size={16} />
                <span>Create New</span>
              </button>
            </div>

            <div className="invoice-preview" id="invoice-preview">
              {/* Invoice Header */}
              <div className="invoice-header">
                <div className="invoice-logo">
                  <Receipt size={32} />
                </div>
                <div className="invoice-title-section">
                  <h1 className="invoice-title">INVOICE</h1>
                  <p className="invoice-number">#{generatedInvoice.number}</p>
                </div>
              </div>

              {/* Business & Client Info */}
              <div className="invoice-parties">
                <div className="business-info">
                  <h3 className="info-title">From:</h3>
                  <p className="business-name">{generatedInvoice.business.name}</p>
                  <p className="business-address">{generatedInvoice.business.address}</p>
                  {generatedInvoice.business.gstin && (
                    <p className="business-gst">GSTIN: {generatedInvoice.business.gstin}</p>
                  )}
                  {generatedInvoice.business.pan && (
                    <p className="business-pan">PAN: {generatedInvoice.business.pan}</p>
                  )}
                  <div className="business-contact">
                    {generatedInvoice.business.email && <span>{generatedInvoice.business.email}</span>}
                    {generatedInvoice.business.phone && <span>{generatedInvoice.business.phone}</span>}
                  </div>
                </div>

                <div className="client-info">
                  <h3 className="info-title">To:</h3>
                  <p className="client-name">{generatedInvoice.client.name}</p>
                  <p className="client-address">{generatedInvoice.client.address}</p>
                  {generatedInvoice.client.gstin && (
                    <p className="client-gst">GSTIN: {generatedInvoice.client.gstin}</p>
                  )}
                  <div className="client-contact">
                    {generatedInvoice.client.email && <span>{generatedInvoice.client.email}</span>}
                    {generatedInvoice.client.phone && <span>{generatedInvoice.client.phone}</span>}
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="invoice-details">
                <div className="detail-item">
                  <span className="detail-label">Invoice Date:</span>
                  <span className="detail-value">{generatedInvoice.date}</span>
                </div>
                {generatedInvoice.dueDate && (
                  <div className="detail-item">
                    <span className="detail-label">Due Date:</span>
                    <span className="detail-value">{generatedInvoice.dueDate}</span>
                  </div>
                )}
                {generatedInvoice.poNumber && (
                  <div className="detail-item">
                    <span className="detail-label">PO Number:</span>
                    <span className="detail-value">{generatedInvoice.poNumber}</span>
                  </div>
                )}
                {generatedInvoice.placeOfSupply && (
                  <div className="detail-item">
                    <span className="detail-label">Place of Supply:</span>
                    <span className="detail-value">{generatedInvoice.placeOfSupply}</span>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <table className="invoice-items-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>HSN/SAC</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedInvoice.items.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.description}</td>
                      <td>{item.hsn}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.rate.toFixed(2)}</td>
                      <td>₹{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary */}
              <div className="invoice-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{generatedInvoice.subtotal.toFixed(2)}</span>
                </div>
                
                {generatedInvoice.gst.type === 'cgst_sgst' ? (
                  <>
                    <div className="summary-row">
                      <span>CGST ({generatedInvoice.gst.cgst}%):</span>
                      <span>₹{generatedInvoice.tax.cgst.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>SGST ({generatedInvoice.gst.sgst}%):</span>
                      <span>₹{generatedInvoice.tax.sgst.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="summary-row">
                    <span>IGST ({generatedInvoice.gst.igst}%):</span>
                    <span>₹{generatedInvoice.tax.igst.toFixed(2)}</span>
                  </div>
                )}

                <div className="summary-row total">
                  <span>Total Payable:</span>
                  <span>₹{generatedInvoice.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Terms & Notes */}
              {(generatedInvoice.additional.paymentTerms || generatedInvoice.additional.notes) && (
                <div className="invoice-footer">
                  {generatedInvoice.additional.paymentTerms && (
                    <div className="footer-section">
                      <h4>Payment Terms:</h4>
                      <p>{generatedInvoice.additional.paymentTerms}</p>
                    </div>
                  )}
                  {generatedInvoice.additional.notes && (
                    <div className="footer-section">
                      <h4>Notes:</h4>
                      <p>{generatedInvoice.additional.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form className="invoice-form" onSubmit={(e) => e.preventDefault()}>
        {/* Step 1: Business Details */}
        {currentStep === 1 && (
          <div className="step-content">
            {/* GST Section */}
            <div className="form-section gst-section">
              <div className="section-header">
                <h2 className="section-title">
                  <Percent size={20} />
                  Apply GST on Invoice
                </h2>
                <div className="section-glow"></div>
              </div>

              <div className="gst-form">
                <div className="form-row">
                  <div className="form-field">
                    <label className="field-label">GST Rate (%)</label>
                    <div className="input-wrapper">
                      <Percent size={18} className="input-icon" />
                      <input
                        type="number"
                        value={gstData.rate}
                        onChange={(e) => setGstData(prev => ({ ...prev, rate: Number(e.target.value) }))}
                        placeholder="e.g. 18"
                        className="form-input"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="field-label">GST Type</label>
                    <div className="gst-type-selector">
                      <button
                        type="button"
                        className={`gst-type-btn ${gstData.type === 'cgst_sgst' ? 'active' : ''}`}
                        onClick={() => setGstData(prev => ({ ...prev, type: 'cgst_sgst' }))}
                      >
                        CGST + SGST
                      </button>
                      <button
                        type="button"
                        className={`gst-type-btn ${gstData.type === 'igst' ? 'active' : ''}`}
                        onClick={() => setGstData(prev => ({ ...prev, type: 'igst' }))}
                      >
                        IGST
                      </button>
                    </div>
                  </div>
                </div>

                <p className="gst-hint">
                  GST type auto-detects based on GSTINs: same first 2 digits = CGST+SGST, different = IGST
                </p>

                <div className="gst-active">
                  Active: <strong>
                    {gstData.type === 'cgst_sgst' 
                      ? `CGST (${gstData.cgst}%) + SGST (${gstData.sgst}%)`
                      : `IGST (${gstData.igst}%)`
                    }
                  </strong>
                </div>
              </div>
            </div>

            {/* Business Details Section */}
            <div className="form-section">
              <div className="section-header">
                <h2 className="section-title">
                  <Building2 size={20} />
                  Business Details
                </h2>
              </div>

              <div className="form-grid">
                <div className="form-field full-width">
                  <label className="field-label">
                    Business Name <span className="required">*</span>
                  </label>
                  <div className={`input-wrapper ${errors.businessName ? 'error' : ''}`}>
                    <Building2 size={18} className="input-icon" />
                    <input
                      type="text"
                      value={businessData.name}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Business Name"
                      className="form-input"
                    />
                    {errors.businessName && (
                      <div className="error-tooltip">
                        <AlertCircle size={14} />
                        <span>{errors.businessName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-field full-width">
                  <label className="field-label">
                    Address <span className="required">*</span>
                  </label>
                  <div className={`input-wrapper ${errors.businessAddress ? 'error' : ''}`}>
                    <MapPin size={18} className="input-icon" />
                    <input
                      type="text"
                      value={businessData.address}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Address"
                      className="form-input"
                    />
                    {errors.businessAddress && (
                      <div className="error-tooltip">
                        <AlertCircle size={14} />
                        <span>{errors.businessAddress}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">GSTIN</label>
                  <div className={`input-wrapper ${errors.businessGstin ? 'error' : ''}`}>
                    <Hash size={18} className="input-icon" />
                    <input
                      type="text"
                      value={businessData.gstin}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
                      placeholder="22AAAAA0000A1Z5"
                      className="form-input"
                      maxLength="15"
                    />
                    {errors.businessGstin && (
                      <div className="error-tooltip">
                        <AlertCircle size={14} />
                        <span>{errors.businessGstin}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">PAN Number</label>
                  <div className={`input-wrapper ${errors.businessPan ? 'error' : ''}`}>
                    <FileText size={18} className="input-icon" />
                    <input
                      type="text"
                      value={businessData.pan}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, pan: e.target.value.toUpperCase() }))}
                      placeholder="AAAAA0000A"
                      className="form-input"
                      maxLength="10"
                    />
                    {errors.businessPan && (
                      <div className="error-tooltip">
                        <AlertCircle size={14} />
                        <span>{errors.businessPan}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">Email</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      value={businessData.email}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="business@example.com"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">Phone</label>
                  <div className="input-wrapper">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      value={businessData.phone}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 9876543210"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Client Details */}
        {currentStep === 2 && (
          <div className="step-content">
            <div className="form-section">
              <div className="section-header">
                <h2 className="section-title">
                  <User size={20} />
                  Client Details
                </h2>
              </div>

              <div className="form-grid">
                <div className="form-field full-width">
                  <label className="field-label">Select Existing Client</label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <select
                      className="form-input select-input"
                      onChange={(e) => handleClientSelect(e.target.value)}
                      value={clientData.id}
                    >
                      <option value="">-- Select a client --</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.fullName} {client.company ? `(${client.company})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-field full-width">
                  <label className="field-label">
                    Client Name <span className="required">*</span>
                  </label>
                  <div className={`input-wrapper ${errors.clientName ? 'error' : ''}`}>
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      value={clientData.name}
                      onChange={(e) => setClientData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Client Name"
                      className="form-input"
                    />
                    {errors.clientName && (
                      <div className="error-tooltip">
                        <AlertCircle size={14} />
                        <span>{errors.clientName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-field full-width">
                  <label className="field-label">
                    Address <span className="required">*</span>
                  </label>
                  <div className={`input-wrapper ${errors.clientAddress ? 'error' : ''}`}>
                    <MapPin size={18} className="input-icon" />
                    <input
                      type="text"
                      value={clientData.address}
                      onChange={(e) => setClientData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Address"
                      className="form-input"
                    />
                    {errors.clientAddress && (
                      <div className="error-tooltip">
                        <AlertCircle size={14} />
                        <span>{errors.clientAddress}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">GSTIN</label>
                  <div className="input-wrapper">
                    <Hash size={18} className="input-icon" />
                    <input
                      type="text"
                      value={clientData.gstin}
                      onChange={(e) => setClientData(prev => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
                      placeholder="22AAAAA0000A1Z5"
                      className="form-input"
                      maxLength="15"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">Email</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      value={clientData.email}
                      onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="client@example.com"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">Phone</label>
                  <div className="input-wrapper">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      value={clientData.phone}
                      onChange={(e) => setClientData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 9876543210"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Details Section */}
            <div className="form-section">
              <div className="section-header">
                <h2 className="section-title">
                  <Receipt size={20} />
                  Invoice Details
                </h2>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label className="field-label">Invoice Number</label>
                  <div className="input-wrapper">
                    <Hash size={18} className="input-icon" />
                    <input
                      type="text"
                      value={invoiceData.number}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, number: e.target.value }))}
                      className="form-input"
                      readOnly
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">PO Number (optional)</label>
                  <div className="input-wrapper">
                    <FileText size={18} className="input-icon" />
                    <input
                      type="text"
                      value={invoiceData.poNumber}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, poNumber: e.target.value }))}
                      placeholder="PO-12345"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">Invoice Date</label>
                  <div className="input-wrapper">
                    <Calendar size={18} className="input-icon" />
                    <input
                      type="date"
                      value={invoiceData.date}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, date: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">Due Date (optional)</label>
                  <div className="input-wrapper">
                    <Calendar size={18} className="input-icon" />
                    <input
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="form-input"
                      placeholder="Tap to set due date"
                    />
                  </div>
                  <span className="field-hint">Optional</span>
                </div>

                <div className="form-field full-width">
                  <label className="field-label">Place of Supply</label>
                  <div className="input-wrapper">
                    <MapPin size={18} className="input-icon" />
                    <input
                      type="text"
                      value={invoiceData.placeOfSupply}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, placeOfSupply: e.target.value }))}
                      placeholder="State name"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Items */}
        {currentStep === 3 && (
          <div className="step-content">
            <div className="form-section">
              <div className="section-header">
                <h2 className="section-title">
                  <Package size={20} />
                  Item Details
                </h2>
                <button type="button" className="add-item-btn" onClick={addItem}>
                  <Plus size={16} />
                  <span>Add Line Item</span>
                </button>
              </div>

              <div className="items-container">
                {items.map((item, index) => (
                  <div key={item.id} className="item-card">
                    <div className="item-header">
                      <h3 className="item-title">Item #{index + 1}</h3>
                      {items.length > 1 && (
                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className="item-form">
                      <div className="form-row">
                        <div className="form-field full-width">
                          <label className="field-label">Description</label>
                          <div className={`input-wrapper ${errors[`item_${item.id}_desc`] ? 'error' : ''}`}>
                            <FileText size={18} className="input-icon" />
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              placeholder="Item description"
                              className="form-input"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-field">
                          <label className="field-label">HSN/SAC</label>
                          <div className="input-wrapper">
                            <Hash size={18} className="input-icon" />
                            <input
                              type="text"
                              value={item.hsn}
                              onChange={(e) => updateItem(item.id, 'hsn', e.target.value)}
                              placeholder="1"
                              className="form-input"
                            />
                          </div>
                        </div>

                        <div className="form-field">
                          <label className="field-label">Quantity</label>
                          <div className={`input-wrapper ${errors[`item_${item.id}_qty`] ? 'error' : ''}`}>
                            <Hash size={18} className="input-icon" />
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                              placeholder="1"
                              className="form-input"
                              min="1"
                              step="1"
                            />
                          </div>
                        </div>

                        <div className="form-field">
                          <label className="field-label">Rate (₹)</label>
                          <div className={`input-wrapper ${errors[`item_${item.id}_rate`] ? 'error' : ''}`}>
                            <DollarSign size={18} className="input-icon" />
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                              placeholder="0.00"
                              className="form-input"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>

                        <div className="form-field amount-field">
                          <label className="field-label">Amount</label>
                          <div className="amount-display">
                            ₹{item.amount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="items-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Additional Info */}
        {currentStep === 4 && (
          <div className="step-content">
            <div className="form-section">
              <div className="section-header">
                <h2 className="section-title">
                  <FileText size={20} />
                  Additional Info
                </h2>
              </div>

              <div className="form-grid">
                <div className="form-field full-width">
                  <label className="field-label">Payment Terms</label>
                  <div className="input-wrapper">
                    <CreditCard size={18} className="input-icon" />
                    <input
                      type="text"
                      value={additionalData.paymentTerms}
                      onChange={(e) => setAdditionalData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                      placeholder="Payment due within 15 days"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-field full-width">
                  <label className="field-label">Notes</label>
                  <div className="input-wrapper">
                    <FileText size={18} className="input-icon textarea-icon" />
                    <textarea
                      value={additionalData.notes}
                      onChange={(e) => setAdditionalData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Thank you for your business!"
                      className="form-input textarea"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Summary */}
            <div className="form-section summary-section">
              <div className="section-header">
                <h2 className="section-title">
                  <Receipt size={20} />
                  Invoice Summary
                </h2>
              </div>

              <div className="summary-details">
                <div className="summary-item">
                  <span>Subtotal</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>

                {gstData.type === 'cgst_sgst' ? (
                  <>
                    <div className="summary-item">
                      <span>CGST ({gstData.cgst}%)</span>
                      <span>₹{calculateTax().cgst.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                      <span>SGST ({gstData.sgst}%)</span>
                      <span>₹{calculateTax().sgst.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="summary-item">
                    <span>IGST ({gstData.igst}%)</span>
                    <span>₹{calculateTax().igst.toFixed(2)}</span>
                  </div>
                )}

                <div className="summary-item total">
                  <span>Total Payable</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-navigation">
          {currentStep > 1 && (
            <button type="button" className="nav-btn prev" onClick={handlePrevious}>
              <ChevronLeft size={18} />
              <span>Back</span>
            </button>
          )}
          
          {currentStep < 4 ? (
            <button type="button" className="nav-btn next" onClick={handleNext}>
              <span>Continue</span>
              <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              type="button" 
              className="nav-btn generate" 
              onClick={handleGenerateInvoice}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner-small"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Generate</span>
                  <Receipt size={18} />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}