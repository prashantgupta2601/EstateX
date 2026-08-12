'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  mockReports, 
  Report, 
  ReportType, 
  ReportReason, 
  ReportStatus 
} from '@/lib/mock-data/reports';
import { 
  Flag, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Ban, 
  Trash2, 
  Eye, 
  MoreHorizontal, 
  Search, 
  Filter, 
  ShieldAlert, 
  UserX, 
  Send, 
  X, 
  Check, 
  UserCheck, 
  History, 
  Building2, 
  User, 
  MessageSquare, 
  Sparkles,
  ExternalLink,
  Info,
  ChevronRight,
  Shield,
  Star
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuLabel 
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/toast';

export default function ReportedContentPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [activeTab, setActiveTab] = useState<ReportStatus>('open');
  const [searchQuery, setSearchQuery] = useState('');
  const [reasonFilter, setReasonFilter] = useState<string>('all');

  // Detail Modal State
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Action Confirmation Modals State
  const [confirmRemoveReport, setConfirmRemoveReport] = useState<Report | null>(null);
  const [confirmWarnReport, setConfirmWarnReport] = useState<Report | null>(null);
  const [warnMessage, setWarnMessage] = useState('');

  const [confirmBanReport, setConfirmBanReport] = useState<Report | null>(null);
  const [banReason, setBanReason] = useState('');

  const [dismissReport, setDismissReport] = useState<Report | null>(null);
  const [dismissReasonInput, setDismissReasonInput] = useState('');

  // Resolution stats
  const [stats, setStats] = useState({
    resolvedThisWeek: 14,
    avgResolutionTime: '4.2 hrs',
    falseReportRate: '8.5%',
  });

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      open: reports.filter((r) => r.status === 'open').length,
      reviewing: reports.filter((r) => r.status === 'reviewing').length,
      resolved: reports.filter((r) => r.status === 'resolved').length,
      dismissed: reports.filter((r) => r.status === 'dismissed').length,
    };
  }, [reports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Tab matching
      if (report.status !== activeTab) return false;

      // Reason filter
      if (reasonFilter !== 'all' && report.reason !== reasonFilter) return false;

      // Search matching
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        report.id.toLowerCase().includes(q) ||
        report.reportedItemTitle.toLowerCase().includes(q) ||
        report.reporterName.toLowerCase().includes(q) ||
        report.reporterEmail.toLowerCase().includes(q) ||
        report.reportedItemId.toLowerCase().includes(q)
      );
    });
  }, [reports, activeTab, reasonFilter, searchQuery]);

  // Status changes & actions
  const handleMarkReviewing = (report: Report) => {
    setReports((prev) =>
      prev.map((r) => (r.id === report.id ? { ...r, status: 'reviewing' } : r))
    );
    toast(`Report ${report.id} is now under review.`, 'success');
    if (selectedReport?.id === report.id) {
      setSelectedReport((prev) => (prev ? { ...prev, status: 'reviewing' } : null));
    }
  };

  const handleConfirmRemove = () => {
    if (!confirmRemoveReport) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id === confirmRemoveReport.id
          ? {
              ...r,
              status: 'resolved',
              resolvedBy: 'Admin (You)',
              resolvedAt: 'Just now',
              actionTaken: 'Content removed & reporter notified.',
            }
          : r
      )
    );
    setStats((prev) => ({ ...prev, resolvedThisWeek: prev.resolvedThisWeek + 1 }));
    toast('Content removed and reporter notified.', 'success');
    if (selectedReport?.id === confirmRemoveReport.id) {
      setSelectedReport(null);
    }
    setConfirmRemoveReport(null);
  };

  const handleConfirmWarn = () => {
    if (!confirmWarnReport) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id === confirmWarnReport.id
          ? {
              ...r,
              status: 'resolved',
              resolvedBy: 'Admin (You)',
              resolvedAt: 'Just now',
              actionTaken: `Warning sent to user: "${warnMessage || 'Violation of terms'}"`,
            }
          : r
      )
    );
    setStats((prev) => ({ ...prev, resolvedThisWeek: prev.resolvedThisWeek + 1 }));
    toast('Official warning notification sent to user.', 'success');
    if (selectedReport?.id === confirmWarnReport.id) {
      setSelectedReport(null);
    }
    setConfirmWarnReport(null);
    setWarnMessage('');
  };

  const handleConfirmBan = () => {
    if (!confirmBanReport) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id === confirmBanReport.id
          ? {
              ...r,
              status: 'resolved',
              resolvedBy: 'Admin (You)',
              resolvedAt: 'Just now',
              actionTaken: `User account permanently banned. Reason: ${banReason || 'Severe policy breach'}`,
            }
          : r
      )
    );
    setStats((prev) => ({ ...prev, resolvedThisWeek: prev.resolvedThisWeek + 1 }));
    toast(`User associated with ${confirmBanReport.reportedItemTitle} has been banned.`, 'success');
    if (selectedReport?.id === confirmBanReport.id) {
      setSelectedReport(null);
    }
    setConfirmBanReport(null);
    setBanReason('');
  };

  const handleConfirmDismiss = () => {
    if (!dismissReport) return;
    if (!dismissReasonInput.trim()) {
      toast('Please provide a dismissal reason.', 'error');
      return;
    }

    setReports((prev) =>
      prev.map((r) =>
        r.id === dismissReport.id
          ? {
              ...r,
              status: 'dismissed',
              resolvedBy: 'Admin (You)',
              resolvedAt: 'Just now',
              dismissalReason: dismissReasonInput,
            }
          : r
      )
    );
    toast('Report dismissed.', 'success');
    if (selectedReport?.id === dismissReport.id) {
      setSelectedReport(null);
    }
    setDismissReport(null);
    setDismissReasonInput('');
  };

  // Helper Badge Renderers
  const getTypeBadge = (type: ReportType) => {
    switch (type) {
      case 'listing':
        return (
          <Badge className="bg-indigo-500/15 text-indigo-300 border-indigo-500/30 text-xs gap-1 font-semibold">
            <Building2 className="h-3 w-3" /> Listing
          </Badge>
        );
      case 'user':
        return (
          <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/30 text-xs gap-1 font-semibold">
            <User className="h-3 w-3" /> User Profile
          </Badge>
        );
      case 'review':
        return (
          <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 text-xs gap-1 font-semibold">
            <MessageSquare className="h-3 w-3" /> Review
          </Badge>
        );
    }
  };

  const getReasonBadge = (reason: ReportReason) => {
    switch (reason) {
      case 'fraud':
        return (
          <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 text-xs font-semibold capitalize">
            Fraud / Scam
          </Badge>
        );
      case 'spam':
        return (
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs font-semibold capitalize">
            Spam
          </Badge>
        );
      case 'inappropriate':
        return (
          <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/40 text-xs font-semibold capitalize">
            Inappropriate
          </Badge>
        );
      case 'duplicate':
        return (
          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/40 text-xs font-semibold capitalize">
            Duplicate
          </Badge>
        );
      case 'wrong_info':
        return (
          <Badge className="bg-sky-500/20 text-sky-300 border-sky-500/40 text-xs font-semibold capitalize">
            Wrong Info
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-500/20 text-slate-300 border-slate-500/40 text-xs font-semibold capitalize">
            Other
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'open':
        return (
          <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 text-xs font-semibold">
            Open
          </Badge>
        );
      case 'reviewing':
        return (
          <Badge className="bg-sky-500/15 text-sky-300 border-sky-500/30 text-xs font-semibold">
            Under Review
          </Badge>
        );
      case 'resolved':
        return (
          <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-xs font-semibold">
            Resolved
          </Badge>
        );
      case 'dismissed':
        return (
          <Badge className="bg-slate-500/20 text-slate-400 border-slate-700 text-xs font-semibold">
            Dismissed
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Flag className="h-6 w-6" />
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Reported Content & Flagged Items
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Monitor and resolve community user reports filed against listings, reviews, and profiles.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Reason filter */}
          <select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            className="w-full sm:w-44 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500"
          >
            <option value="all">All Reasons</option>
            <option value="fraud">Fraud / Scam</option>
            <option value="spam">Spam</option>
            <option value="inappropriate">Inappropriate</option>
            <option value="duplicate">Duplicate</option>
            <option value="wrong_info">Wrong Information</option>
            <option value="other">Other</option>
          </select>

          {/* Search input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search reports, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-900/80 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Open Reports
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-amber-400 mt-1">
                {tabCounts.open}
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Resolved This Week
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-emerald-400 mt-1">
                {stats.resolvedThisWeek}
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Avg Resolution Time
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-indigo-400 mt-1">
                {stats.avgResolutionTime}
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                False Report Rate
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-300 mt-1">
                {stats.falseReportRate}
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400">
              <Sparkles className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Content */}
      <Tabs
        defaultValue="open"
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as ReportStatus)}
        className="w-full space-y-6"
      >
        <TabsList className="bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 inline-flex">
          <TabsTrigger
            value="open"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-slate-400 text-xs sm:text-sm px-4 py-2 rounded-xl font-medium transition-all"
          >
            Open
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-200">
              {tabCounts.open}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="reviewing"
            className="data-[state=active]:bg-sky-600 data-[state=active]:text-white text-slate-400 text-xs sm:text-sm px-4 py-2 rounded-xl font-medium transition-all"
          >
            Under Review
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-200">
              {tabCounts.reviewing}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="resolved"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 text-xs sm:text-sm px-4 py-2 rounded-xl font-medium transition-all"
          >
            Resolved
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-200">
              {tabCounts.resolved}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="dismissed"
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 text-xs sm:text-sm px-4 py-2 rounded-xl font-medium transition-all"
          >
            Dismissed
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-200">
              {tabCounts.dismissed}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="m-0 focus-visible:outline-none">
          {filteredReports.length === 0 ? (
            <Card className="bg-slate-900/40 border-slate-800 p-12 text-center">
              <div className="max-w-xs mx-auto space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto border border-slate-700">
                  <Flag className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-200">No reports found</h3>
                <p className="text-xs text-slate-400">
                  There are no {activeTab} reports matching your filter criteria.
                </p>
              </div>
            </Card>
          ) : (
            <Card className="bg-slate-900/80 border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                      <th className="py-4 px-4">Type</th>
                      <th className="py-4 px-4">Reported Item</th>
                      <th className="py-4 px-4">Reason</th>
                      <th className="py-4 px-4">Reporter</th>
                      <th className="py-4 px-4">Reported Date</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-slate-800/40 transition-colors group">
                        {/* Type Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {getTypeBadge(report.reportedItemType)}
                        </td>

                        {/* Reported Item Title */}
                        <td className="py-4 px-4 max-w-xs">
                          <button
                            type="button"
                            onClick={() => setSelectedReport(report)}
                            className="text-left font-semibold text-slate-100 hover:text-indigo-400 transition-colors line-clamp-1 flex items-center gap-1.5"
                          >
                            {report.reportedItemTitle}
                          </button>
                          <span className="text-[10px] text-slate-500 font-mono">
                            ID: {report.reportedItemId}
                          </span>
                        </td>

                        {/* Reason Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {getReasonBadge(report.reason)}
                        </td>

                        {/* Reporter */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-medium text-slate-200">{report.reporterName}</div>
                          <div className="text-[10px] text-slate-500">{report.reporterEmail}</div>
                        </td>

                        {/* Reported Date */}
                        <td className="py-4 px-4 whitespace-nowrap text-slate-400 font-medium">
                          {report.reportedAt}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {getStatusBadge(report.status)}
                        </td>

                        {/* Actions Menu */}
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center rounded-lg transition-colors cursor-pointer">
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
                              <DropdownMenuLabel className="text-[10px] text-slate-500 uppercase font-semibold">
                                Report Actions
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => setSelectedReport(report)}
                                className="text-xs hover:bg-slate-800 cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5 mr-2 text-indigo-400" />
                                View Full Details
                              </DropdownMenuItem>

                              {report.status === 'open' && (
                                <DropdownMenuItem
                                  onClick={() => handleMarkReviewing(report)}
                                  className="text-xs hover:bg-slate-800 cursor-pointer text-sky-400"
                                >
                                  <Clock className="h-3.5 w-3.5 mr-2" />
                                  Mark Under Review
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator className="bg-slate-800" />

                              {report.status !== 'resolved' && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => setConfirmRemoveReport(report)}
                                    className="text-xs hover:bg-slate-800 cursor-pointer text-rose-400"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                                    Remove Content
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() => {
                                      setConfirmWarnReport(report);
                                      setWarnMessage('');
                                    }}
                                    className="text-xs hover:bg-slate-800 cursor-pointer text-amber-400"
                                  >
                                    <AlertTriangle className="h-3.5 w-3.5 mr-2" />
                                    Warn User
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() => {
                                      setConfirmBanReport(report);
                                      setBanReason('');
                                    }}
                                    className="text-xs hover:bg-slate-800 cursor-pointer text-rose-500 font-semibold"
                                  >
                                    <UserX className="h-3.5 w-3.5 mr-2" />
                                    Ban User
                                  </DropdownMenuItem>
                                </>
                              )}

                              {report.status !== 'dismissed' && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setDismissReport(report);
                                    setDismissReasonInput('');
                                  }}
                                  className="text-xs hover:bg-slate-800 cursor-pointer text-slate-400"
                                >
                                  <X className="h-3.5 w-3.5 mr-2" />
                                  Dismiss Report
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Report Detail Dialog */}
      <Dialog open={Boolean(selectedReport)} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 sm:max-w-xl p-6 max-h-[90vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-xs">
                    {selectedReport.id}
                  </Badge>
                  {getTypeBadge(selectedReport.reportedItemType)}
                  {getStatusBadge(selectedReport.status)}
                </div>
                <DialogTitle className="text-lg font-bold text-white leading-snug">
                  {selectedReport.reportedItemTitle}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400 mt-1">
                  Reported {selectedReport.reportedAt} by {selectedReport.reporterName} ({selectedReport.reporterEmail})
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 my-4">
                {/* Reported Content Preview Card */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                      Reported Content Preview
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ID: {selectedReport.reportedItemId}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    {selectedReport.itemDetails?.image && (
                      <div className="relative h-20 w-28 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                        <Image
                          src={selectedReport.itemDetails.image}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-1 flex-1">
                      {selectedReport.itemDetails?.price && (
                        <p className="text-sm font-bold text-white">
                          {selectedReport.itemDetails.price}
                        </p>
                      )}
                      {selectedReport.itemDetails?.location && (
                        <p className="text-xs text-slate-400">
                          {selectedReport.itemDetails.location}
                        </p>
                      )}
                      {selectedReport.itemDetails?.ownerName && (
                        <p className="text-xs text-slate-300 font-medium">
                          Author/Owner: <span className="text-indigo-400">{selectedReport.itemDetails.ownerName}</span>
                        </p>
                      )}
                      {selectedReport.itemDetails?.snippet && (
                        <p className="text-xs text-slate-300 italic bg-slate-950/60 p-2 rounded-lg border border-slate-800 mt-1">
                          {selectedReport.itemDetails.snippet}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reporter's History & Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Reporter History
                    </span>
                    <span className="text-sm font-bold text-slate-100 mt-0.5 block">
                      {selectedReport.reporterHistoryCount} reports filed
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Item Report History
                    </span>
                    <span className="text-sm font-bold text-amber-400 mt-0.5 block">
                      {selectedReport.previousReportsCount} previous reports on item
                    </span>
                  </div>
                </div>

                {/* Reporter Description Box */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Reporter Explanation
                    </span>
                    {getReasonBadge(selectedReport.reason)}
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    &ldquo;{selectedReport.description}&rdquo;
                  </p>
                </div>

                {/* Resolution Audit (if resolved or dismissed) */}
                {selectedReport.status === 'resolved' && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1 text-xs text-emerald-300">
                    <div className="flex items-center justify-between font-bold text-emerald-400">
                      <span>Resolved by {selectedReport.resolvedBy}</span>
                      <span>{selectedReport.resolvedAt}</span>
                    </div>
                    <p className="text-emerald-200/90 font-medium mt-1">
                      Action Taken: {selectedReport.actionTaken}
                    </p>
                  </div>
                )}

                {selectedReport.status === 'dismissed' && (
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1 text-xs text-slate-300">
                    <div className="flex items-center justify-between font-bold text-slate-200">
                      <span>Dismissed by {selectedReport.resolvedBy}</span>
                      <span>{selectedReport.resolvedAt}</span>
                    </div>
                    <p className="text-slate-400 italic mt-1">
                      Reason: &ldquo;{selectedReport.dismissalReason}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              {/* Direct Actions in Dialog */}
              {selectedReport.status !== 'resolved' && (
                <DialogFooter className="border-t border-slate-800 pt-4 flex-col sm:flex-row gap-2">
                  {selectedReport.status === 'open' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkReviewing(selectedReport)}
                      className="bg-slate-900 border-slate-700 hover:bg-slate-800 text-sky-400 text-xs"
                    >
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      Mark Under Review
                    </Button>
                  )}

                  <Button
                    size="sm"
                    onClick={() => setConfirmRemoveReport(selectedReport)}
                    className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Remove Content
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setConfirmBanReport(selectedReport);
                      setBanReason('');
                    }}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                  >
                    <UserX className="h-3.5 w-3.5 mr-1.5" />
                    Ban User
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal: Remove Content */}
      <Dialog open={Boolean(confirmRemoveReport)} onOpenChange={(open) => !open && setConfirmRemoveReport(null)}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-rose-500" />
              Confirm Content Removal
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 mt-1">
              Are you sure you want to remove &ldquo;{confirmRemoveReport?.reportedItemTitle}&rdquo;? The content will be hidden from EstateX and the reporter will receive a confirmation notification.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmRemoveReport(null)}
              className="bg-slate-900 border-slate-700 text-slate-300 text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRemove}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
            >
              Confirm Remove & Notify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal: Warn User */}
      <Dialog open={Boolean(confirmWarnReport)} onOpenChange={(open) => !open && setConfirmWarnReport(null)}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Send Official User Warning
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 mt-1">
              Send an official warning message to the owner of &ldquo;{confirmWarnReport?.reportedItemTitle}&rdquo;.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Warning Note
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Please update price information accurately within 24 hours..."
              value={warnMessage}
              onChange={(e) => setWarnMessage(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setConfirmWarnReport(null)}
              className="bg-slate-900 border-slate-700 text-slate-300 text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmWarn}
              className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Send Warning
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal: Ban User */}
      <Dialog open={Boolean(confirmBanReport)} onOpenChange={(open) => !open && setConfirmBanReport(null)}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <UserX className="h-5 w-5 text-rose-600" />
              Ban User Account
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 mt-1">
              Permanently ban the seller/user associated with &ldquo;{confirmBanReport?.reportedItemTitle}&rdquo;. All active listings under this user will be unpublished.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Ban Rationale / Audit Log Note
            </label>
            <Input
              type="text"
              placeholder="e.g. Repeated fraudulent listings and fake contact info..."
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="bg-slate-900 border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:border-rose-500"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setConfirmBanReport(null)}
              className="bg-slate-900 border-slate-700 text-slate-300 text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmBan}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
            >
              Confirm Ban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dismiss Report Modal */}
      <Dialog open={Boolean(dismissReport)} onOpenChange={(open) => !open && setDismissReport(null)}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <X className="h-5 w-5 text-slate-400" />
              Dismiss Community Report
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 mt-1">
              Provide a reason for dismissing report {dismissReport?.id}.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Dismissal Reason
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Listing information verified with owner. No violation found..."
              value={dismissReasonInput}
              onChange={(e) => setDismissReasonInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-slate-600"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDismissReport(null)}
              className="bg-slate-900 border-slate-700 text-slate-300 text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDismiss}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold"
            >
              Dismiss Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
