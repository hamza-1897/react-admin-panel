import React, { useState, useEffect } from 'react';
import { Flag, Search, CheckCircle2, Trash2, Eye } from 'lucide-react';
import { reportsAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Message from '../components/common/Message';

const reportStatusLabels = {
  pending: 'Pending',
  rejected: 'Rejected',
  resolved: 'Resolved',
};

const sectionTabs = [
  { value: 'provider', label: 'Provider Reports' },
  { value: 'support', label: 'Support Messages' },
];

const reportTypes = [
  { value: 'spam', label: 'Spam' },
  { value: 'unusual_activity', label: 'Unusual Activity' },
  { value: 'policy_violation', label: 'Policy Violation' },
  { value: 'fake_profile', label: 'Fake Profile' },
];

const supportTypes = [
  { value: 'general_support', label: 'General Support' },
  { value: 'help', label: 'Help Request' },
];

const Reports = () => {
  const [section, setSection] = useState('provider');
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const getTypeLabel = (report) => {
    if (report.category === 'support') {
      return supportTypes.find((type) => type.value === report.supportType)?.label || 'Support';
    }
    return reportTypes.find((type) => type.value === report.type)?.label || 'Report';
  };

  useEffect(() => {
    setTypeFilter('all');
    setStatusFilter('all');
    setSearchTerm('');
  }, [section]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await reportsAPI.getAllReports();
        setReports(data);
        setFilteredReports(data);
      } catch (err) {
        console.error('Error loading reports:', err);
        setError('Could not load reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    let filtered = reports.filter((report) => report.category === section);

    if (typeFilter !== 'all') {
      filtered = filtered.filter((report) =>
        section === 'support'
          ? report.supportType === typeFilter
          : report.type === typeFilter
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((report) => report.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((report) =>
        report.reporterName.toLowerCase().includes(term) ||
        (report.targetName && report.targetName.toLowerCase().includes(term)) ||
        (report.subject && report.subject.toLowerCase().includes(term)) ||
        (report.reason && report.reason.toLowerCase().includes(term)) ||
        (report.message && report.message.toLowerCase().includes(term)) ||
        (report.type && report.type.toLowerCase().includes(term)) ||
        (report.supportType && report.supportType.toLowerCase().includes(term))
      );
    }

    setFilteredReports(filtered);
  }, [reports, section, typeFilter, statusFilter, searchTerm]);

  const sectionReports = reports.filter((report) => report.category === section);
  const statusCounts = {
    all: sectionReports.length,
    pending: sectionReports.filter((report) => report.status === 'pending').length,
    rejected: sectionReports.filter((report) => report.status === 'rejected').length,
    resolved: sectionReports.filter((report) => report.status === 'resolved').length,
  };

  const handleResolve = async (reportId) => {
    try {
      setLoading(true);
      await reportsAPI.updateReportStatus(reportId, 'resolved');
      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId ? { ...report, status: 'resolved' } : report
        )
      );
    } catch (err) {
      console.error('Unable to update report status:', err);
      setError('Failed to mark report as resolved.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reportId) => {
    const confirmed = window.confirm('Are you sure you want to delete this report?');
    if (!confirmed) return;

    try {
      setLoading(true);
      await reportsAPI.deleteReport(reportId);
      setReports((prev) => prev.filter((report) => report.id !== reportId));
    } catch (err) {
      console.error('Unable to delete report:', err);
      setError('Failed to delete the report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {sectionTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSection(tab.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${section === tab.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Flag className="h-6 w-6 text-indigo-600" />
              {section === 'support' ? 'Support Messages' : 'Provider Reports'}
            </h1>
            <p className="text-gray-600 mt-1 max-w-2xl">
              {section === 'support'
                ? 'View user support and help requests submitted through the platform.'
                : 'Review reports submitted against providers for spam, policy violations, and unusual activity.'}
            </p>
          </div>

          <div className="text-sm text-gray-500">
            Total {section === 'support' ? 'support messages' : 'reports'}: {statusCounts.all} | Pending: {statusCounts.pending} | Rejected: {statusCounts.rejected} | Resolved: {statusCounts.resolved}
          </div>
        </div>
      </div>

      {error && <Message type="error" message={error} onClose={() => setError(null)} />}

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {section === 'support' ? 'Search support messages' : 'Search reports'}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={section === 'support' ? 'Search by reporter, subject, or message' : 'Search by reporter, target, or reason'}
              className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {section === 'support' ? 'Support type' : 'Report type'}
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All types</option>
              {(section === 'support' ? supportTypes : reportTypes).map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading reports..." />
      ) : (
        <div className="grid gap-4">
          {filteredReports.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-600">No reports match the selected filters.</p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div key={report.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="space-y-2 min-w-0">
                    <p className="text-sm text-gray-500 uppercase tracking-[0.2em]">{getTypeLabel(report)}</p>
                    <h2 className="text-xl font-semibold text-gray-900 truncate">{section === 'support' ? report.subject : report.targetName}</h2>
                    <p className="text-sm text-gray-500">{section === 'support' ? 'Submitted by' : 'Reported by'} <span className="font-medium text-gray-900">{report.reporterName}</span> on {report.reportedAt}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className={`inline-flex rounded-full px-3 py-1 font-medium ${report.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : report.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-sky-100 text-sky-800'}`}>
                      {reportStatusLabels[report.status] || report.status}
                    </span>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{report.views} views</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto] items-start">
                  <div className="space-y-3">
                    <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                      <p className="text-gray-500 text-sm">{section === 'support' ? 'Message' : 'Reason'}</p>
                      <p className="mt-2 text-gray-900 whitespace-pre-line">{section === 'support' ? report.message : report.reason}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full lg:w-auto">
                    {report.status !== 'resolved' && report.status !== 'rejected' && (
                      <button
                        onClick={() => handleResolve(report.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Mark as Resolved
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(report.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Report
                    </button>

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-sm font-medium text-gray-900">{section === 'support' ? 'Request type' : 'Reported item'}</p>
                      <p className="mt-2 text-gray-700">
                        {section === 'support' ? getTypeLabel(report) : report.itemType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
