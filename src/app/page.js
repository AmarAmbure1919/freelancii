// app/page.js
"use client";

import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  CreditCard, 
  DollarSign, 
  Users, 
  Briefcase,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Calendar,
  CheckCircle,
  Circle,
  PlayCircle,
  PauseCircle,
  BarChart3,
  Target,
  Receipt
} from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

export default function DashboardPage() {
  // Sample data - replace with real data from your backend
  const metrics = {
    totalEarned: 12450,
    pending: 3200,
    expenses: 2100,
    netProfit: 10350,
    clients: 24,
    projects: 12
  };

  const monthlyEarnings = [
    { month: 'Jan', amount: 3200 },
    { month: 'Feb', amount: 4100 },
    { month: 'Mar', amount: 3800 },
    { month: 'Apr', amount: 5200 },
    { month: 'May', amount: 4800 },
    { month: 'Jun', amount: 6100 }
  ];

  const projectStatus = {
    planning: 4,
    ongoing: 8,
    onHold: 2,
    done: 6
  };

  const quickInsights = {
    avgProjectValue: 8750,
    completionRate: 68
  };

  const recentPayments = [];

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-subtitle">Welcome back, Alex! Here&apos;s your financial summary</p>
        </div>
        <div className="header-actions">
          <button className="action-btn">
            <Calendar size={18} />
            <span>This Month</span>
          </button>
          <button className="action-btn primary">
            <TrendingUp size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Net Profit Card */}
      <div className="profit-card">
        <div className="profit-card-header">
          <div>
            <h2 className="profit-title">Net Profit</h2>
            <p className="profit-subtitle">Earnings after expenses</p>
          </div>
          <button className="card-menu">
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="profit-metrics-grid">
          <div className="metric-item">
            <div className="metric-icon earned">
              <TrendingUp size={20} />
            </div>
            <div className="metric-content">
              <span className="metric-label">Total Earned</span>
              <span className="metric-value">£{metrics.totalEarned.toLocaleString()}</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon pending">
              <Clock size={20} />
            </div>
            <div className="metric-content">
              <span className="metric-label">Pending</span>
              <span className="metric-value">£{metrics.pending.toLocaleString()}</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon expenses">
              <CreditCard size={20} />
            </div>
            <div className="metric-content">
              <span className="metric-label">Expenses</span>
              <span className="metric-value">£{metrics.expenses.toLocaleString()}</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon profit">
              <DollarSign size={20} />
            </div>
            <div className="metric-content">
              <span className="metric-label">Net Profit</span>
              <span className="metric-value profit-value">£{metrics.netProfit.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="profit-footer">
          <div className="footer-stats">
            <div className="stat">
              <Users size={16} />
              <span>{metrics.clients} Clients</span>
            </div>
            <div className="stat">
              <Briefcase size={16} />
              <span>{metrics.projects} Projects</span>
            </div>
          </div>
          <div className="profit-trend">
            <ArrowUp size={16} />
            <span>+12.5% from last month</span>
          </div>
        </div>
      </div>

      {/* Monthly Earnings Section */}
      <div className="monthly-earnings-section">
        <div className="section-header">
          <h2 className="section-title">Monthly Earnings</h2>
          <div className="section-actions">
            <button className="tab-btn active">This Year</button>
            <button className="tab-btn">Last Year</button>
          </div>
        </div>

        <div className="earnings-cards">
          {/* Total Monthly Earnings Card */}
          <div className="total-earnings-card">
            <div className="total-earnings-header">
              <span className="total-label">Total this month</span>
              <span className="total-value">£6,100</span>
            </div>
            <div className="total-earnings-footer">
              <span className="trend-up">
                <ArrowUp size={14} />
                8.2%
              </span>
              <span className="trend-label">vs last month</span>
            </div>
          </div>

          {/* Monthly Earnings Chart Representation */}
          <div className="earnings-grid">
            {monthlyEarnings.map((item, index) => (
              <div key={index} className="month-card">
                <span className="month-name">{item.month}</span>
                <div className="month-bar">
                  <div 
                    className="bar-fill"
                    style={{ 
                      height: `${(item.amount / 6500) * 100}%`,
                      background: `linear-gradient(180deg, #00ffff, ${index === 5 ? '#ff00ff' : '#00ccff'})`
                    }}
                  ></div>
                </div>
                <span className="month-amount">£{item.amount}</span>
              </div>
            ))}
          </div>

          {/* Summary Card */}
          <div className="earnings-summary">
            <div className="summary-item">
              <span className="summary-label">Average Monthly</span>
              <span className="summary-value">£4,533</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Highest Month</span>
              <span className="summary-value highlight">£6,100 (Jun)</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Growth Rate</span>
              <span className="summary-value trend-up">+15.3%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Status and Insights Row */}
      <div className="project-insights-row">
        {/* Project Status Card */}
        <div className="project-status-card">
          <div className="card-header">
            <h3 className="card-title">
              <BarChart3 size={20} />
              Project Status
            </h3>
            <button className="card-menu">
              <MoreVertical size={18} />
            </button>
          </div>
          
          <div className="status-list">
            <div className="status-item">
              <div className="status-info">
                <Circle size={16} className="status-icon planning" />
                <span className="status-label">Planning</span>
              </div>
              <div className="status-bar-container">
                <div 
                  className="status-bar planning" 
                  style={{ width: `${(projectStatus.planning / 20) * 100}%` }}
                ></div>
              </div>
              <span className="status-count">{projectStatus.planning}</span>
            </div>

            <div className="status-item">
              <div className="status-info">
                <PlayCircle size={16} className="status-icon ongoing" />
                <span className="status-label">Ongoing</span>
              </div>
              <div className="status-bar-container">
                <div 
                  className="status-bar ongoing" 
                  style={{ width: `${(projectStatus.ongoing / 20) * 100}%` }}
                ></div>
              </div>
              <span className="status-count">{projectStatus.ongoing}</span>
            </div>

            <div className="status-item">
              <div className="status-info">
                <PauseCircle size={16} className="status-icon onhold" />
                <span className="status-label">On Hold</span>
              </div>
              <div className="status-bar-container">
                <div 
                  className="status-bar onhold" 
                  style={{ width: `${(projectStatus.onHold / 20) * 100}%` }}
                ></div>
              </div>
              <span className="status-count">{projectStatus.onHold}</span>
            </div>

            <div className="status-item">
              <div className="status-info">
                <CheckCircle size={16} className="status-icon done" />
                <span className="status-label">Done</span>
              </div>
              <div className="status-bar-container">
                <div 
                  className="status-bar done" 
                  style={{ width: `${(projectStatus.done / 20) * 100}%` }}
                ></div>
              </div>
              <span className="status-count">{projectStatus.done}</span>
            </div>
          </div>

          <div className="total-projects">
            <span>Total Projects</span>
            <span className="total-count">20</span>
          </div>
        </div>

        {/* Quick Insights Card */}
        <div className="quick-insights-card">
          <div className="card-header">
            <h3 className="card-title">
              <Target size={20} />
              Quick Insights
            </h3>
            <button className="card-menu">
              <MoreVertical size={18} />
            </button>
          </div>

          <div className="insights-content">
            <div className="insight-item">
              <div className="insight-label">
                <span>Avg. Project Value</span>
                <small>Per project</small>
              </div>
              <div className="insight-value">
                £{quickInsights.avgProjectValue.toLocaleString()}
              </div>
              <div className="insight-trend">
                <ArrowUp size={14} />
                <span>12% vs last month</span>
              </div>
            </div>

            <div className="insight-divider"></div>

            <div className="insight-item">
              <div className="insight-label">
                <span>Completion Rate</span>
                <small>Projects done</small>
              </div>
              <div className="insight-value">
                {quickInsights.completionRate}%
              </div>
              <div className="progress-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path
                    className="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="circle"
                    strokeDasharray={`${quickInsights.completionRate}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="percentage">
                    {quickInsights.completionRate}%
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Payments Card */}
        <div className="recent-payments-card">
          <div className="card-header">
            <h3 className="card-title">
              <Receipt size={20} />
              Recent Payments
            </h3>
            <button className="card-menu">
              <MoreVertical size={18} />
            </button>
          </div>

          {recentPayments.length === 0 ? (
            <div className="no-payments">
              <Receipt size={48} className="no-payments-icon" />
              <p className="no-payments-text">No payments yet</p>
              <p className="no-payments-subtext">Payments will appear here once received</p>
            </div>
          ) : (
            <div className="payments-list">
              {/* Payment items will go here */}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="quick-stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Earned</span>
            <div className="stat-card-icon earned">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="stat-card-value">£12,450</div>
          <div className="stat-card-footer">
            <span className="trend-up">↑ 23%</span>
            <span>vs last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Pending</span>
            <div className="stat-card-icon pending">
              <Clock size={20} />
            </div>
          </div>
          <div className="stat-card-value">£3,200</div>
          <div className="stat-card-footer">
            <span className="trend-down">↓ 5%</span>
            <span>vs last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Expenses</span>
            <div className="stat-card-icon expenses">
              <CreditCard size={20} />
            </div>
          </div>
          <div className="stat-card-value">£2,100</div>
          <div className="stat-card-footer">
            <span className="trend-up">↑ 8%</span>
            <span>vs last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Net Profit</span>
            <div className="stat-card-icon profit">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="stat-card-value">£10,350</div>
          <div className="stat-card-footer">
            <span className="trend-up">↑ 18%</span>
            <span>vs last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Clients</span>
            <div className="stat-card-icon clients">
              <Users size={20} />
            </div>
          </div>
          <div className="stat-card-value">24</div>
          <div className="stat-card-footer">
            <span className="trend-up">↑ 4</span>
            <span>new this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Projects</span>
            <div className="stat-card-icon projects">
              <Briefcase size={20} />
            </div>
          </div>
          <div className="stat-card-value">12</div>
          <div className="stat-card-footer">
            <span className="trend-up">↑ 3</span>
            <span>active projects</span>
          </div>
        </div>
      </div>
    </div>
  );
}