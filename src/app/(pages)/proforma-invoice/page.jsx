/* eslint-disable react-hooks/set-state-in-effect */
// app/(pages)/proforma-invoices/create/page.jsx
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
  ChevronRight,
  ChevronLeft,
  Landmark,
  QrCode,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import './create-proforma.css';

export default function CreateProformaPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedProforma, setGeneratedProforma] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [clients, setClients] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Generate proforma number only once on component mount
  const generateProformaNumber = useCallback(() => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000);
    return `PI-${year}${String(random).padStart(4, '0')}`;
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

  // Proforma Details State
  const [proformaData, setProformaData] = useState({
    number: '',
    poNumber: '',
    issueDate: '',
    validUntil: '',
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

  // Bank Details State
  const [bankData, setBankData] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    upiId: ''
  });

  // Additional Info State
  const [additionalData, setAdditionalData] = useState({
    deliveryTimeline: '7-10 working days',
    paymentTerms: 'Payment due within 15 days',
    notes: 'Thank you for your business!'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize proforma data after component mounts
  useEffect(() => {
    setProformaData({
      number: generateProformaNumber(),
      poNumber: '',
      issueDate: getTodayDate(),
      validUntil: '',
      placeOfSupply: ''
    });
    setIsInitialized(true);
  }, [generateProformaNumber, getTodayDate]);

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

      case 4: // Bank Details
        if (!bankData.bankName.trim()) newErrors.bankName = 'Bank name is required';
        if (!bankData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
        if (!bankData.ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required';
        if (!bankData.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
        break;

      case 5: // Additional Info
        // No required fields
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentStep, businessData, clientData, items, bankData]);

  // Handle next step
  const handleNext = useCallback(() => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  }, [validateStep]);

  // Handle previous step
  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  // Generate proforma
  const handleGenerateProforma = useCallback(() => {
    if (!validateStep()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const subtotal = calculateSubtotal();
      const tax = calculateTax();
      const total = calculateTotal();

      const proforma = {
        id: `PRO-${Date.now()}`,
        number: proformaData.number,
        issueDate: proformaData.issueDate,
        validUntil: proformaData.validUntil,
        business: businessData,
        client: clientData,
        items: items.map(item => ({ ...item })),
        gst: gstData,
        bank: bankData,
        subtotal,
        tax,
        total,
        additional: additionalData,
        createdAt: new Date().toISOString()
      };

      setGeneratedProforma(proforma);
      setShowSuccess(true);
      setShowPreview(true);
      setIsSubmitting(false);

      // Save to localStorage
      try {
        const savedProformas = localStorage.getItem('proformas') || '[]';
        const proformas = JSON.parse(savedProformas);
        proformas.push(proforma);
        localStorage.setItem('proformas', JSON.stringify(proformas));
      } catch (error) {
        console.error('Error saving proforma:', error);
      }

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1500);
  }, [validateStep, calculateSubtotal, calculateTax, calculateTotal, proformaData, businessData, clientData, items, gstData, bankData, additionalData]);

  // Download proforma as PDF (simulated)
  const handleDownload = useCallback(() => {
    alert('Downloading proforma invoice... (PDF generation would be implemented here)');
  }, []);

  // Print proforma
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Close preview and return to proformas list
  const handleClosePreview = useCallback(() => {
    setShowPreview(false);
    router.push('/proforma-invoices');
  }, [router]);

  // Create new proforma
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
    setProformaData({
      number: generateProformaNumber(),
      poNumber: '',
      issueDate: getTodayDate(),
      validUntil: '',
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
    setBankData({
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      upiId: ''
    });
    setAdditionalData({
      deliveryTimeline: '7-10 working days',
      paymentTerms: 'Payment due within 15 days',
      notes: 'Thank you for your business!'
    });
    setErrors({});
    setShowPreview(false);
  }, [generateProformaNumber, getTodayDate]);

  // Calculate step progress
  const stepProgress = useMemo(() => {
    return ((currentStep - 1) / 5) * 100;
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
    <div className="create-proforma-container">
      {/* Success Message */}
      {showSuccess && (
        <div className="success-message">
          <CheckCircle size={20} />
          <span>Proforma invoice generated successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="page-title">Proforma Invoice</h1>
            <p className="page-subtitle">
              Step {currentStep} of 5 · {currentStep === 1 ? 'Business' : 
                currentStep === 2 ? 'Client' : 
                currentStep === 3 ? 'Items' : 
                currentStep === 4 ? 'Bank' : 'More'}
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
            <span className={`step ${currentStep >= 4 ? 'active' : ''}`}>Bank</span>
            <ChevronRight size={14} className="step-separator" />
            <span className={`step ${currentStep >= 5 ? 'active' : ''}`}>More</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${stepProgress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Proforma Preview Modal */}
      {showPreview && generatedProforma && (
        <div className="proforma-preview-modal">
          <div className="proforma-preview-content">
            <div className="preview-header">
              <h2 className="preview-title">Proforma Invoice Generated</h2>
              <button className="close-preview" onClick={handleClosePreview}>
                <X size={20} />
              </button>
            </div>

            <div className="preview-actions">
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

            <div className="proforma-preview" id="proforma-preview">
              {/* Proforma Header */}
              <div className="proforma-header">
                <div className="proforma-logo">
                  <Receipt size={40} />
                </div>
                <div className="proforma-title-section">
                  <h1 className="proforma-title">PROFORMA INVOICE</h1>
                  <p className="proforma-number">#{generatedProforma.number}</p>
                  <p className="proforma-warning">
                    <AlertTriangle size={14} />
                    This is a preliminary bill. Not a legal tax document.
                  </p>
                </div>
              </div>

              {/* Business & Client Info */}
              <div className="proforma-parties">
                <div className="business-info">
                  <h3 className="info-title">From:</h3>
                  <p className="business-name">{generatedProforma.business.name}</p>
                  <p className="business-address">{generatedProforma.business.address}</p>
                  {generatedProforma.business.gstin && (
                    <p className="business-gst">GSTIN: {generatedProforma.business.gstin}</p>
                  )}
                  {generatedProforma.business.pan && (
                    <p className="business-pan">PAN: {generatedProforma.business.pan}</p>
                  )}
                  <div className="business-contact">
                    {generatedProforma.business.email && <span>{generatedProforma.business.email}</span>}
                    {generatedProforma.business.phone && <span>{generatedProforma.business.phone}</span>}
                  </div>
                </div>

                <div className="client-info">
                  <h3 className="info-title">To:</h3>
                  <p className="client-name">{generatedProforma.client.name}</p>
                  <p className="client-address">{generatedProforma.client.address}</p>
                  {generatedProforma.client.gstin && (
                    <p className="client-gst">GSTIN: {generatedProforma.client.gstin}</p>
                  )}
                  <div className="client-contact">
                    {generatedProforma.client.email && <span>{generatedProforma.client.email}</span>}
                    {generatedProforma.client.phone && <span>{generatedProforma.client.phone}</span>}
                  </div>
                </div>
              </div>

              {/* Proforma Details */}
              <div className="proforma-details">
                <div className="detail-item">
                  <span className="detail-label">Issue Date:</span>
                  <span className="detail-value">{generatedProforma.issueDate}</span>
                </div>
                {generatedProforma.validUntil && (
                  <div className="detail-item">
                    <span className="detail-label">Valid Until:</span>
                    <span className="detail-value">{generatedProforma.validUntil}</span>
                  </div>
                )}
                {generatedProforma.poNumber && (
                  <div className="detail-item">
                    <span className="detail-label">PO Number:</span>
                    <span className="detail-value">{generatedProforma.poNumber}</span>
                  </div>
                )}
                {generatedProforma.placeOfSupply && (
                  <div className="detail-item">
                    <span className="detail-label">Place of Supply:</span>
                    <span className="detail-value">{generatedProforma.placeOfSupply}</span>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <table className="proforma-items-table">
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
                  {generatedProforma.items.map((item, index) => (
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

              {/* Bank Details */}
              {generatedProforma.bank && (
                <div className="bank-details">
                  <h3 className="bank-title">Bank Account Details</h3>
                  <div className="bank-grid">
                    <div className="bank-item">
                      <span className="bank-label">Bank Name:</span>
                      <span className="bank-value">{generatedProforma.bank.bankName}</span>
                    </div>
                    <div className="bank-item">
                      <span className="bank-label">Account Number:</span>
                      <span className="bank-value">{generatedProforma.bank.accountNumber}</span>
                    </div>
                    <div className="bank-item">
                      <span className="bank-label">IFSC Code:</span>
                      <span className="bank-value">{generatedProforma.bank.ifscCode}</span>
                    </div>
                    <div className="bank-item">
                      <span className="bank-label">Account Holder:</span>
                      <span className="bank-value">{generatedProforma.bank.accountHolderName}</span>
                    </div>
                    {generatedProforma.bank.upiId && (
                      <div className="bank-item upi">
                        <span className="bank-label">UPI ID:</span>
                        <span className="bank-value upi-value">{generatedProforma.bank.upiId}</span>
                      </div>
                    )}
                  </div>
                  {generatedProforma.bank.upiId && (
                    <p className="upi-hint">
                      <QrCode size={14} />
                      UPI ID for quick advance payment
                    </p>
                  )}
                </div>
              )}

              {/* Summary */}
              <div className="proforma-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{generatedProforma.subtotal.toFixed(2)}</span>
                </div>
                
                {generatedProforma.gst.type === 'cgst_sgst' ? (
                  <>
                    <div className="summary-row">
                      <span>CGST ({generatedProforma.gst.cgst}%):</span>
                      <span>₹{generatedProforma.tax.cgst.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>SGST ({generatedProforma.gst.sgst}%):</span>
                      <span>₹{generatedProforma.tax.sgst.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="summary-row">
                    <span>IGST ({generatedProforma.gst.igst}%):</span>
                    <span>₹{generatedProforma.tax.igst.toFixed(2)}</span>
                  </div>
                )}

                <div className="summary-row total">
                  <span>Total Payable:</span>
                  <span>₹{generatedProforma.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery & Payment Terms */}
              {(generatedProforma.additional.deliveryTimeline || generatedProforma.additional.paymentTerms || generatedProforma.additional.notes) && (
                <div className="proforma-footer">
                  {generatedProforma.additional.deliveryTimeline && (
                    <div className="footer-section">
                      <h4>Delivery Timeline:</h4>
                      <p>{generatedProforma.additional.deliveryTimeline}</p>
                    </div>
                  )}
                  {generatedProforma.additional.paymentTerms && (
                    <div className="footer-section">
                      <h4>Payment Terms:</h4>
                      <p>{generatedProforma.additional.paymentTerms}</p>
                    </div>
                  )}
                  {generatedProforma.additional.notes && (
                    <div className="footer-section">
                      <h4>Notes:</h4>
                      <p>{generatedProforma.additional.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Legal Disclaimer */}
              <div className="legal-disclaimer">
                <AlertTriangle size={16} />
                <p>A Proforma Invoice is a preliminary bill of sale sent before delivery. It is not a legal tax document. Goods/services are dispatched after payment confirmation.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form className="proforma-form" onSubmit={(e) => e.preventDefault()}>
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
                  Auto-detects from GSTINs: same first 2 digits = CGST+SGST, different = IGST
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

            {/* Proforma Details Section */}
            <div className="form-section">
              <div className="section-header">
                <h2 className="section-title">
                  <Receipt size={20} />
                  Proforma Details
                </h2>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label className="field-label">PI Number</label>
                  <div className="input-wrapper">
                    <Hash size={18} className="input-icon" />
                    <input
                      type="text"
                      value={proformaData.number}
                      onChange={(e) => setProformaData(prev => ({ ...prev, number: e.target.value }))}
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
                      value={proformaData.poNumber}
                      onChange={(e) => setProformaData(prev => ({ ...prev, poNumber: e.target.value }))}
                      placeholder="PO-12345"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">Issue Date</label>
                  <div className="input-wrapper">
                    <Calendar size={18} className="input-icon" />
                    <input
                      type="date"
                      value={proformaData.issueDate}
                      onChange={(e) => setProformaData(prev => ({ ...prev, issueDate: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">Valid Until (optional)</label>
                  <div className="input-wrapper">
                    <Calendar size={18} className="input-icon" />
                    <input
                      type="date"
                      value={proformaData.validUntil}
                      onChange={(e) => setProformaData(prev => ({ ...prev, validUntil: e.target.value }))}
                      className="form-input"
                      placeholder="Tap to set validity date"
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
                      value={proformaData.placeOfSupply}
                      onChange={(e) => setProformaData(prev => ({ ...prev, placeOfSupply: e.target.value }))}
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

                      <div className="form-row three-col">
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
            </div>
          </div>
        )}

        {/* Step 4: Bank Details */}
        {currentStep === 4 && (
          <div className="step-content">
            <div className="form-section">
              <div className="section-header">
                <h2 className="section-title">
                  <Landmark size={20} />
                  Bank Account
                </h2>
              </div>

              <div className="form-grid">
                <div className="form-field full-width">
                  <label className="field-label">Bank Name</label>
                  <div className={`input-wrapper ${errors.bankName ? 'error' : ''}`}>
                    <Landmark size={18} className="input-icon" />
                    <input
                      type="text"
                      value={bankData.bankName}
                      onChange={(e) => setBankData(prev => ({ ...prev, bankName: e.target.value }))}
                      placeholder="Bank Name"
                      className="form-input"
                    />
                    {errors.bankName && (
                      <div className="error-tooltip">
                        <AlertCircle size={14} />
                        <span>{errors.bankName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-field full-width">
                  <label className="field-label">Account Number</label>
                  <div className={`input-wrapper ${errors.accountNumber ? 'error' : ''}`}>
                    <Hash size={18} className="input-icon" />
                    <input
                      type="text"
                      value={bankData.accountNumber}
                      onChange={(e) => setBankData(prev => ({ ...prev, accountNumber: e.target.value }))}
                      placeholder="Account Number"
                      className="form-input"
                    />
                    {errors.accountNumber && (
                      <div className="error-tooltip">
                        <AlertCircle size={14} />
                        <span>{errors.accountNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">IFSC Code</label>
                  <div className={`input-wrapper ${errors.ifscCode ? 'error' : ''}`}>
                    <Hash size={18} className="input-icon" />
                    <input
                      type="text"
                      value={bankData.ifscCode}
                      onChange={(e) => setBankData(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                      placeholder="IFSC Code"
                      className="form-input"
                      maxLength="11"
                    />
                    {errors.ifscCode && (
                      <div className="error-tooltip">
                        <AlertCircle size={14} />
                        <span>{errors.ifscCode}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">Account Holder Name</label>
                  <div className={`input-wrapper ${errors.accountHolderName ? 'error' : ''}`}>
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      value={bankData.accountHolderName}
                      onChange={(e) => setBankData(prev => ({ ...prev, accountHolderName: e.target.value }))}
                      placeholder="Account Holder Name"
                      className="form-input"
                    />
                    {errors.accountHolderName && (
                      <div className="error-tooltip">
                        <AlertCircle size={14} />
                        <span>{errors.accountHolderName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* UPI Payment Section */}
            <div className="form-section">
              <div className="section-header">
                <h2 className="section-title">
                  <QrCode size={20} />
                  UPI Payment
                </h2>
              </div>

              <div className="form-grid">
                <div className="form-field full-width">
                  <label className="field-label">UPI ID</label>
                  <div className="input-wrapper">
                    <QrCode size={18} className="input-icon" />
                    <input
                      type="text"
                      value={bankData.upiId}
                      onChange={(e) => setBankData(prev => ({ ...prev, upiId: e.target.value }))}
                      placeholder="username@bank"
                      className="form-input"
                    />
                  </div>
                  <p className="upi-hint">
                    UPI ID will appear on the proforma for quick advance payment.
                  </p>
                </div>
              </div>
            </div>

            {/* Proforma Summary Preview */}
            <div className="form-section summary-preview">
              <div className="section-header">
                <h2 className="section-title">
                  <Receipt size={20} />
                  Proforma Summary
                </h2>
              </div>

              <div className="summary-preview-grid">
                <div className="summary-preview-item">
                  <span>Subtotal</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                {gstData.type === 'cgst_sgst' ? (
                  <>
                    <div className="summary-preview-item">
                      <span>CGST ({gstData.cgst}%)</span>
                      <span>₹{calculateTax().cgst.toFixed(2)}</span>
                    </div>
                    <div className="summary-preview-item">
                      <span>SGST ({gstData.sgst}%)</span>
                      <span>₹{calculateTax().sgst.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="summary-preview-item">
                    <span>IGST ({gstData.igst}%)</span>
                    <span>₹{calculateTax().igst.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-preview-item total">
                  <span>Total Payable</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Additional Info */}
        {currentStep === 5 && (
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
                  <label className="field-label">Delivery Timeline</label>
                  <div className="input-wrapper">
                    <Clock size={18} className="input-icon" />
                    <input
                      type="text"
                      value={additionalData.deliveryTimeline}
                      onChange={(e) => setAdditionalData(prev => ({ ...prev, deliveryTimeline: e.target.value }))}
                      placeholder="7-10 working days"
                      className="form-input"
                    />
                  </div>
                </div>

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

            {/* Legal Disclaimer */}
            <div className="legal-disclaimer">
              <AlertTriangle size={20} />
              <p>
                A Proforma Invoice is a preliminary bill of sale sent before delivery. 
                It is not a legal tax document. Goods/services are dispatched after payment confirmation.
              </p>
            </div>

            {/* Proforma Summary */}
            <div className="form-section summary-section">
              <div className="section-header">
                <h2 className="section-title">
                  <Receipt size={20} />
                  Proforma Summary
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
          
          {currentStep < 5 ? (
            <button type="button" className="nav-btn next" onClick={handleNext}>
              <span>Continue</span>
              <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              type="button" 
              className="nav-btn generate" 
              onClick={handleGenerateProforma}
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