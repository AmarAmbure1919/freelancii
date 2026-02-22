// components/Sidebar.jsx
"use client";

import React, { useState } from 'react';
import { 
  Home, 
  FileImage, 
  Calculator, 
  FileText, 
  DollarSign, 
  FilePlus, 
  KeyRound, 
  ShieldCheck, 
  Settings, 
  Info,
  ChevronRight,
  LayoutDashboard,
  CreditCard,
  Briefcase,
  Lock,
  Wallet,
  Receipt,
  Clock,
  StickyNote,
  Paintbrush,
  Package,
  Building2
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';

const Sidebar = () => {
  const { isExpanded, setIsExpanded } = useSidebar();
  const [activeTab, setActiveTab] = useState('');
  const router = useRouter();

  const menuSections = [
    {
      title: 'Create',
      icon: <Briefcase size={20} />,
      items: [
        { name: 'Tax Invoice', id: 'tax-invoice', icon: <Receipt size={18} /> },
        { name: 'Proforma Invoice', id: 'proforma-invoice', icon: <FileText size={18} /> },
        { name: 'Purchase Order', id: 'purchase-order', icon: <FilePlus size={18} /> },
        { name: 'Quotation', id: 'quotation', icon: <DollarSign size={18} /> }
      ]
    },
    {
      title: 'Financial',
      icon: <Wallet size={20} />,
      items: [
        { name: 'Payment', id: 'payment', icon: <CreditCard size={18} /> },
        { name: 'Expense', id: 'expense', icon: <Receipt size={18} /> },
        { name: 'Financial Summary', id: 'financial-summary', icon: <Calculator size={18} /> }
      ]
    },
    {
      title: 'Tools',
      icon: <LayoutDashboard size={20} />,
      items: [
        { name: 'Time Tracking', id: 'time-tracking', icon: <Clock size={18} /> },
        { name: 'Invoice Note', id: 'invoice-note', icon: <StickyNote size={18} /> },
        { name: 'Rate Calculator', id: 'rate-calc', icon: <Calculator size={18} /> },
        { name: 'Background Remover', id: 'bg-remover', icon: <Paintbrush size={18} /> },
      ]
    },
    {
      title: 'Vault',
      icon: <Lock size={20} />,
      items: [
        { name: 'Credential Vault', id: 'credential-vault', icon: <KeyRound size={18} /> },
        { name: '.env File Store', id: 'env-store', icon: <FileText size={18} /> },
        { name: 'SSH & Access Key', id: 'ssh-keys', icon: <ShieldCheck size={18} /> }
      ]
    },
    {
      title: 'App',
      icon: <Building2 size={20} />,
      items: [
        { name: 'My Business Info', id: 'my-business-info', icon: <Briefcase size={18} /> },
        { name: 'Stock Catalogue', id: 'stock-catalogue', icon: <Package size={18} /> },
        { name: 'Settings', id: 'settings', icon: <Settings size={18} /> },
        { name: 'About', id: 'about', icon: <Info size={18} /> }
      ]
    },
  ];

  return (
    <div 
      className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="neon-glow"></div>

      <div className="sidebar-header">
        <div className="logo-container">
          <Home size={28} className="logo-icon" />
          {isExpanded && <span className="brand-name">NEXUS</span>}
        </div>
      </div>

      <div className="sidebar-menu">
        {menuSections.map((section, idx) => (
          <div key={idx} className="menu-section">
            <div className="section-title">
              <span className="section-icon">{section.icon}</span>
              {isExpanded && <span className="section-text">{section.title}</span>}
              {isExpanded && <ChevronRight size={16} className="section-arrow" />}
            </div>

            <div className="section-items">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    router.push(`/${item.id}`);
                  }}
                >
                  <span className="item-icon">{item.icon}</span>
                  {isExpanded && (
                    <>
                      <span className="item-text">{item.name}</span>
                      <div className="item-glow"></div>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="footer-content">
          <div className="status-indicator"></div>
          {isExpanded && <span className="status-text">System Online</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;