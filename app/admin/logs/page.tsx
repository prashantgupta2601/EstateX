'use client';

import React, { useState, useMemo } from 'react';
import {
  mockActivityLogs,
  ActivityLogEntry,
  ActionType,
  TargetType,
} from '@/lib/mock-data/activity-logs';
import {
  ScrollText,
  Search,
  Filter,
  Download,
  Calendar,
  ShieldAlert,
  Info,
  ChevronDown,
  ChevronUp,
  User,
  Building2,
  CreditCard,
  Settings,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  LogIn,
  Layers,
  ChevronLeft,
  ChevronRight,
  Globe,
  Terminal,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';

const ACTION_CONFIG: Record<
  ActionType,
  { label: string; bg: string; text: string; border: string }
> = {
  approved_listing: {
    label: 'Approved Listing',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  rejected_listing: {
    label: 'Rejected Listing',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
  },
  banned_user: {
    label: 'Banned User',
    bg: 'bg-rose-500/15',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
  },
  unbanned_user: {
    label: 'Unbanned User',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  verified_broker: {
    label: 'Verified Broker',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  rejected_kyc: {
    label: 'Rejected KYC',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
  },
  plan_created: {
    label: 'Plan Created',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/20',
  },
  plan_updated: {
    label: 'Plan Updated',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/20',
  },
  refund_issued: {
    label: 'Refund Issued',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  settings_updated: {
    label: 'Settings Updated',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  admin_login: {
    label: 'Admin Login',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/20',
  },
};

const TARGET_TYPE_CONFIG: Record<
  TargetType,
  { label: string; icon: React.ElementType; color: string }
> = {
  listing: { label: 'Listing', icon: Building2, color: 'text-indigo-400' },
  user: { label: 'User', icon: User, color: 'text-sky-400' },
  plan: { label: 'Plan', icon: CreditCard, color: 'text-amber-400' },
  system: { label: 'System', icon: Settings, color: 'text-purple-400' },
};

export default function AdminActivityLogsPage() {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedTargetType, setSelectedTargetType] = useState<string>('all');
  const [selectedAdmin, setSelectedAdmin] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Pagination & Expanded Row State
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const itemsPerPage = 15;

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportStartDate, setExportStartDate] = useState('2026-05-01');
  const [exportEndDate, setExportEndDate] = useState('2026-08-06');
  const [isExporting, setIsExporting] = useState(false);

  // Extract distinct admin names for filter dropdown
  const adminOptions = useMemo(() => {
    const names = Array.from(new Set(mockActivityLogs.map((l) => l.adminName)));
    return names;
  }, []);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return mockActivityLogs.filter((log) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesAdmin = log.adminName.toLowerCase().includes(q);
        const matchesTarget = log.targetLabel.toLowerCase().includes(q) || log.targetId.toLowerCase().includes(q);
        const matchesDetails = log.details.toLowerCase().includes(q);
        const matchesIP = log.ipAddress.includes(q);
        if (!matchesAdmin && !matchesTarget && !matchesDetails && !matchesIP) return false;
      }

      // Action Type
      if (selectedAction !== 'all' && log.action !== selectedAction) {
        return false;
      }

      // Target Type
      if (selectedTargetType !== 'all' && log.targetType !== selectedTargetType) {
        return false;
      }

      // Admin Filter
      if (selectedAdmin !== 'all' && log.adminName !== selectedAdmin) {
        return false;
      }

      // Date Range Filter
      if (startDate) {
        const logDate = log.timestamp.split(' ')[0];
        if (logDate < startDate) return false;
      }
      if (endDate) {
        const logDate = log.timestamp.split(' ')[0];
        if (logDate > endDate) return false;
      }

      return true;
    });
  }, [searchQuery, selectedAction, selectedTargetType, selectedAdmin, startDate, endDate]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage]);

  const toggleExpandRow = (id: string) => {
    setExpandedLogId((prev) => (prev === id ? null : id));
  };

  // Export handlers
  const handleTriggerQuickExport = () => {
    toast('Exporting logs for the last 30 days...', 'success');
    setTimeout(() => {
      toast('Downloaded activity-logs.csv', 'success');
    }, 1000);
  };

  const handleConfirmCustomExport = () => {
    setIsExporting(true);
    toast('Exporting logs for selected date range...', 'success');
    setTimeout(() => {
      setIsExporting(false);
      setIsExportModalOpen(false);
      toast('Downloaded activity-logs.csv', 'success');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8">
      {/* Top Header & Export Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ScrollText className="h-6 w-6 stroke-[2.5]" />
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Activity Logs & Audit Trail
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Immutable log of administrative actions, moderation events, configuration updates, and security logins.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTriggerQuickExport}
            className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300 text-xs cursor-pointer"
          >
            <Clock className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
            Export Last 30 Days
          </Button>

          <Button
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Requirement 4: Log Retention Notice */}
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Info className="h-5 w-5 text-indigo-400 shrink-0" />
          <div>
            <span className="font-bold text-white text-xs block">Log Retention Notice</span>
            <span className="text-indigo-300/90 text-xs">
              Logs are retained for 90 days. Export regularly for compliance records.
            </span>
          </div>
        </div>
        <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[10px] hidden sm:block">
          90-Day Retention Policy
        </Badge>
      </div>

      {/* Requirement 2: Filters Toolbar */}
      <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
            <Filter className="h-4 w-4 text-indigo-400" />
            Filter & Search Logs
          </CardTitle>
          <span className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredLogs.length}</strong> of {mockActivityLogs.length} logs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search admin, target, IP..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          {/* Target Type Filter */}
          <div>
            <select
              value={selectedTargetType}
              onChange={(e) => {
                setSelectedTargetType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs cursor-pointer"
            >
              <option value="all">Target: All Types</option>
              <option value="listing">Target: Listing</option>
              <option value="user">Target: User</option>
              <option value="plan">Target: Subscription Plan</option>
              <option value="system">Target: System</option>
            </select>
          </div>

          {/* Action Type Filter */}
          <div>
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs cursor-pointer"
            >
              <option value="all">Action: All Actions</option>
              <option value="approved_listing">Approved Listing</option>
              <option value="rejected_listing">Rejected Listing</option>
              <option value="banned_user">Banned User</option>
              <option value="unbanned_user">Unbanned User</option>
              <option value="verified_broker">Verified Broker</option>
              <option value="rejected_kyc">Rejected KYC</option>
              <option value="plan_created">Plan Created</option>
              <option value="plan_updated">Plan Updated</option>
              <option value="refund_issued">Refund Issued</option>
              <option value="settings_updated">Settings Updated</option>
              <option value="admin_login">Admin Login</option>
            </select>
          </div>

          {/* Admin Filter */}
          <div>
            <select
              value={selectedAdmin}
              onChange={(e) => {
                setSelectedAdmin(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs cursor-pointer"
            >
              <option value="all">Admin: All Admins</option>
              {adminOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker Start/End */}
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px] focus:outline-none focus:border-indigo-500"
              title="Start Date"
            />
            <span className="text-slate-500 text-xs">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px] focus:outline-none focus:border-indigo-500"
              title="End Date"
            />
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Admin</th>
                <th className="py-3 px-3">Action</th>
                <th className="py-3 px-3">Target</th>
                <th className="py-3 px-3">Details</th>
                <th className="py-3 px-3">IP Address</th>
                <th className="py-3 px-3 text-right">Expand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No activity logs match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => {
                  const actionStyle = ACTION_CONFIG[log.action] || ACTION_CONFIG.admin_login;
                  const targetConfig = TARGET_TYPE_CONFIG[log.targetType] || TARGET_TYPE_CONFIG.system;
                  const TargetIcon = targetConfig.icon;
                  const isExpanded = expandedLogId === log.id;

                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        onClick={() => toggleExpandRow(log.id)}
                        className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${
                          isExpanded ? 'bg-slate-800/60' : ''
                        }`}
                      >
                        {/* Timestamp (Exact) */}
                        <td className="py-3.5 px-3 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                          {log.timestamp}
                        </td>

                        {/* Admin */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 border border-indigo-500/30 bg-indigo-500/10">
                              <AvatarFallback className="text-[10px] font-bold text-indigo-400">
                                {log.adminName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-white whitespace-nowrap">
                              {log.adminName}
                            </span>
                          </div>
                        </td>

                        {/* Action Badge */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <Badge
                            className={`${actionStyle.bg} ${actionStyle.text} ${actionStyle.border} border text-[10px] font-bold`}
                          >
                            {actionStyle.label}
                          </Badge>
                        </td>

                        {/* Target */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px] gap-1">
                              <TargetIcon className={`h-3 w-3 ${targetConfig.color}`} />
                              {targetConfig.label}
                            </Badge>
                            <span className="font-semibold text-slate-200 line-clamp-1 max-w-[180px]">
                              {log.targetLabel}
                            </span>
                          </div>
                        </td>

                        {/* Details (Truncated) */}
                        <td className="py-3.5 px-3 text-slate-300 line-clamp-1 max-w-[260px] pt-4">
                          {log.details}
                        </td>

                        {/* IP Address */}
                        <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                          {log.ipAddress}
                        </td>

                        {/* Expand Toggle */}
                        <td className="py-3.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpandRow(log.id);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-indigo-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Requirement 2: Row Expansion details */}
                      {isExpanded && (
                        <tr className="bg-slate-950/80 border-b border-slate-800">
                          <td colSpan={7} className="p-4 space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
                              {/* Left Column: Full Details & Browser User Agent */}
                              <div className="lg:col-span-6 space-y-3">
                                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Full Details Log
                                  </span>
                                  <p className="text-slate-200 leading-relaxed font-medium">
                                    {log.details}
                                  </p>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                                    <Globe className="h-3.5 w-3.5 text-indigo-400" />
                                    Browser User Agent Footprint
                                  </span>
                                  <p className="font-mono text-[11px] text-slate-400 break-all">
                                    {log.userAgent}
                                  </p>
                                </div>
                              </div>

                              {/* Right Column: Before / After State Diff */}
                              <div className="lg:col-span-6 space-y-3">
                                {log.beforeState || log.afterState ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {log.beforeState && (
                                      <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
                                        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                                          State Before Action
                                        </span>
                                        <pre className="font-mono text-[11px] text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-900 overflow-x-auto">
                                          {JSON.stringify(log.beforeState, null, 2)}
                                        </pre>
                                      </div>
                                    )}

                                    {log.afterState && (
                                      <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                                          State After Action
                                        </span>
                                        <pre className="font-mono text-[11px] text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-900 overflow-x-auto">
                                          {JSON.stringify(log.afterState, null, 2)}
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs italic flex items-center justify-center h-full">
                                    No state mutations recorded for this system event.
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
          <div>
            Showing{' '}
            <span className="font-semibold text-slate-200">
              {filteredLogs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-slate-200">
              {Math.min(currentPage * itemsPerPage, filteredLogs.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-200">{filteredLogs.length}</span> logs
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 h-8 text-xs cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <span className="px-3 font-semibold text-slate-200">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 h-8 text-xs cursor-pointer"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Requirement 3: Export CSV Dialog Modal */}
      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Download className="h-5 w-5 text-indigo-400" />
              Export Audit Logs to CSV
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Select date range to export audit trail for compliance and reporting.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-xs py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-400">Start Date</label>
                <input
                  type="date"
                  value={exportStartDate}
                  onChange={(e) => setExportStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-400">End Date</label>
                <input
                  type="date"
                  value={exportEndDate}
                  onChange={(e) => setExportEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
              <span className="font-bold block">Compliance Format</span>
              <p className="text-indigo-200/90 text-[11px] mt-0.5">
                Includes full admin IDs, IP addresses, timestamp ISOs, action flags, and target IDs.
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExportModalOpen(false)}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={isExporting}
              onClick={handleConfirmCustomExport}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
            >
              {isExporting ? 'Exporting...' : 'Export Selected Range'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
