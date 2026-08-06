'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Building2, 
  Eye, 
  Check, 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  Maximize2,
  Calendar,
  Mail,
  Phone,
  BadgeAlert
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { mockKYCSubmissions, KYCSubmission } from '@/lib/mock-data/kyc-submissions';

export default function BrokerKYCVerificationPage() {
  const [submissions, setSubmissions] = useState<KYCSubmission[]>(mockKYCSubmissions);
  const [statusTab, setStatusTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states
  const [viewDocSubmission, setViewDocSubmission] = useState<KYCSubmission | null>(null);
  const [approveConfirmSubmission, setApproveConfirmSubmission] = useState<KYCSubmission | null>(null);

  const [rejectModalSubmission, setRejectModalSubmission] = useState<KYCSubmission | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);

  // Stats calculation
  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const rejectedCount = submissions.filter((s) => s.status === 'rejected').length;
  const avgReviewTime = '4.2 hours';

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery || 
        item.sellerName.toLowerCase().includes(q) || 
        item.sellerEmail.toLowerCase().includes(q) || 
        item.sellerPhone.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        (item.reraNumber && item.reraNumber.toLowerCase().includes(q));

      const matchesStatus = statusTab === 'all' || item.status === statusTab;

      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchQuery, statusTab]);

  // Approve handler
  const handleConfirmApprove = () => {
    if (!approveConfirmSubmission) return;

    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === approveConfirmSubmission.id) {
          return {
            ...s,
            status: 'approved',
            reviewedBy: 'Super Admin',
            reviewedAt: 'Just now',
          };
        }
        return s;
      })
    );

    toast('Broker verified. Verification badge added.', 'success');
    setApproveConfirmSubmission(null);
    if (viewDocSubmission?.id === approveConfirmSubmission.id) {
      setViewDocSubmission(null);
    }
  };

  // Reject handler
  const handleConfirmReject = () => {
    if (!rejectModalSubmission) return;
    if (rejectionReasonInput.trim().length < 20) {
      toast('Rejection reason must be at least 20 characters long.', 'error');
      return;
    }

    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === rejectModalSubmission.id) {
          return {
            ...s,
            status: 'rejected',
            rejectionReason: rejectionReasonInput,
            reviewedBy: 'Super Admin',
            reviewedAt: 'Just now',
          };
        }
        return s;
      })
    );

    toast('KYC rejected. Seller notified.', 'success');
    setRejectModalSubmission(null);
    setRejectionReasonInput('');
    if (viewDocSubmission?.id === rejectModalSubmission.id) {
      setViewDocSubmission(null);
    }
  };

  const getDocumentBadgeColor = (docType: string) => {
    switch (docType) {
      case 'aadhaar':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'pan':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'passport':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left pb-16">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <UserCheck className="h-7 w-7 text-amber-400" />
            <span>Broker Verification Review Queue</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit identity documents & RERA registration certificates for seller badge verification.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STATS ROW AT TOP (4 INDICATOR CARDS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pending Reviews */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-lg">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Pending Reviews</span>
            <span className="text-2xl font-black text-amber-400 mt-0.5">{pendingCount} Queue</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        {/* Approved This Month */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-lg">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Approved This Month</span>
            <span className="text-2xl font-black text-emerald-400 mt-0.5">{approvedCount} Verified</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* Rejected This Month */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-lg">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Rejected This Month</span>
            <span className="text-2xl font-black text-rose-400 mt-0.5">{rejectedCount} Submissions</span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Avg Review Time */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-lg">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Avg Review Time</span>
            <span className="text-2xl font-black text-blue-400 mt-0.5">{avgReviewTime}</span>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* STATUS TABS & SEARCH TOOLBAR */}
      {/* ========================================================================= */}
      <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
          <span className="px-2.5 text-[10px] uppercase font-black text-slate-500">Filter:</span>
          {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusTab(st)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                statusTab === st 
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st === 'all' ? 'All Submissions' : st}
              {st === 'pending' && pendingCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-amber-950 text-amber-300 text-[10px] font-black rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search seller name, RERA #, or phone..."
            className="pl-10 h-10 rounded-xl bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-amber-500"
          />
        </div>

      </Card>

      {/* ========================================================================= */}
      {/* VERIFICATION CARDS GRID */}
      {/* ========================================================================= */}
      {filteredSubmissions.length === 0 ? (
        <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center flex flex-col items-center justify-center gap-3">
          <FileText className="h-10 w-10 text-slate-600" />
          <span className="text-sm font-bold text-slate-400">No verification submissions found matching your filters.</span>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubmissions.map((submission) => (
            <Card
              key={submission.id}
              className={`rounded-3xl border bg-slate-900 p-6 flex flex-col justify-between gap-5 shadow-xl transition-all hover:border-slate-700 ${
                submission.status === 'pending'
                  ? 'border-amber-500/30 ring-1 ring-amber-500/10'
                  : 'border-slate-800'
              }`}
            >
              {/* Card Header: Seller Info & Document Badge */}
              <div className="flex flex-col gap-3">
                
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
                      <span>{submission.sellerName}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{submission.id} • Joined {submission.joinedDate}</span>
                  </div>

                  {/* Status Badge */}
                  <Badge
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 border ${
                      submission.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : submission.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                    }`}
                  >
                    {submission.status}
                  </Badge>
                </div>

                {/* Seller Contact & RERA snippet */}
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Mail className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span className="truncate max-w-[180px]">{submission.sellerEmail}</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Phone className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>{submission.sellerPhone}</span>
                    </span>
                  </div>

                  {submission.reraNumber && (
                    <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-bold">RERA No:</span>
                      <span className="font-mono text-amber-400 font-bold">{submission.reraNumber}</span>
                    </div>
                  )}
                </div>

                {/* Doc Details Pill */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400 font-bold">Document Type:</span>
                  <Badge className={`uppercase text-[10px] font-black border ${getDocumentBadgeColor(submission.documentType)}`}>
                    {submission.documentType}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold">Listings Overview:</span>
                  <span className="font-bold text-slate-200">
                    {submission.listingsCount} total ({submission.activeListingsCount} active)
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Submitted:</span>
                  <span>{submission.submittedAt}</span>
                </div>

                {/* Rejection Note if Rejected */}
                {submission.status === 'rejected' && submission.rejectionReason && (
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] flex flex-col gap-1">
                    <span className="font-bold text-rose-400 uppercase text-[9px]">Rejection Reason:</span>
                    <span>{submission.rejectionReason}</span>
                  </div>
                )}

              </div>

              {/* Card Actions Footer */}
              <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
                
                {/* View Documents Button */}
                <Button
                  onClick={() => setViewDocSubmission(submission)}
                  variant="outline"
                  className="w-full rounded-xl border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-bold cursor-pointer h-9 flex items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4 text-blue-400" />
                  <span>View Documents & Proofs</span>
                </Button>

                {/* Pending Actions (Approve / Reject) */}
                {submission.status === 'pending' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => setApproveConfirmSubmission(submission)}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-9 cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Check className="h-4 w-4 stroke-[3]" />
                      <span>Approve</span>
                    </Button>

                    <Button
                      onClick={() => {
                        setRejectModalSubmission(submission);
                        setRejectionReasonInput('');
                      }}
                      className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs h-9 cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <X className="h-4 w-4 stroke-[3]" />
                      <span>Reject</span>
                    </Button>
                  </div>
                )}

              </div>

            </Card>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW DOCUMENTS DIALOG (Large Zoomable Previews & Detailed Proofs) */}
      {/* ========================================================================= */}
      <Dialog open={!!viewDocSubmission} onOpenChange={(open) => !open && setViewDocSubmission(null)}>
        <DialogContent className="sm:max-w-2xl p-6 rounded-3xl bg-slate-900 border-slate-800 text-slate-100 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-left gap-1">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-black text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
                <span>KYC Document Audit — {viewDocSubmission?.sellerName}</span>
              </DialogTitle>
              <Badge className={`uppercase text-[10px] font-black border ${
                viewDocSubmission?.status === 'approved' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : viewDocSubmission?.status === 'rejected'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {viewDocSubmission?.status}
              </Badge>
            </div>
            <DialogDescription className="text-xs text-slate-400">
              {viewDocSubmission?.id} • Submitted {viewDocSubmission?.submittedAt}
            </DialogDescription>
          </DialogHeader>

          {viewDocSubmission && (
            <div className="flex flex-col gap-6 my-2 text-xs">
              
              {/* Seller Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase text-slate-500">Seller Profile</span>
                  <span className="font-bold text-white text-sm">{viewDocSubmission.sellerName}</span>
                  <span className="text-slate-400 font-mono">{viewDocSubmission.sellerEmail}</span>
                  <span className="text-slate-400 font-mono">{viewDocSubmission.sellerPhone}</span>
                </div>

                <div className="flex flex-col gap-1 sm:border-l sm:border-slate-800 sm:pl-4">
                  <span className="text-[10px] font-black uppercase text-slate-500">Listings & RERA Status</span>
                  <span className="text-slate-200 font-bold">
                    {viewDocSubmission.listingsCount} total listings ({viewDocSubmission.activeListingsCount} active on market)
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-slate-400 font-bold">RERA No:</span>
                    <span className="font-mono text-amber-400 font-black">{viewDocSubmission.reraNumber || 'Not Provided'}</span>
                  </div>
                </div>
              </div>

              {/* Document Images Section */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Uploaded Identity Proof ({viewDocSubmission.documentType.toUpperCase()})
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Front Image */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-slate-300">Front Side Document:</span>
                    <div 
                      onClick={() => setZoomedImageUrl(viewDocSubmission.frontImageUrl)}
                      className="relative h-48 w-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden group cursor-pointer"
                    >
                      <Image
                        src={viewDocSubmission.frontImageUrl}
                        alt="Front ID"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white font-bold text-xs">
                        <Maximize2 className="h-4 w-4" />
                        <span>Click to Zoom</span>
                      </div>
                    </div>
                  </div>

                  {/* Back Image */}
                  {viewDocSubmission.backImageUrl ? (
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-bold text-slate-300">Back Side Document:</span>
                      <div 
                        onClick={() => setZoomedImageUrl(viewDocSubmission.backImageUrl || null)}
                        className="relative h-48 w-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden group cursor-pointer"
                      >
                        <Image
                          src={viewDocSubmission.backImageUrl}
                          alt="Back ID"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white font-bold text-xs">
                          <Maximize2 className="h-4 w-4" />
                          <span>Click to Zoom</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 justify-center items-center h-48 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 text-slate-500 font-bold">
                      <span>No Back Side Required for {viewDocSubmission.documentType.toUpperCase()}</span>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            {viewDocSubmission?.status === 'pending' && (
              <div className="flex items-center gap-2 w-full justify-end">
                <Button
                  onClick={() => {
                    setRejectModalSubmission(viewDocSubmission);
                    setRejectionReasonInput('');
                  }}
                  className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-10 px-4 cursor-pointer"
                >
                  Reject KYC
                </Button>
                <Button
                  onClick={() => setApproveConfirmSubmission(viewDocSubmission)}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-10 px-4 cursor-pointer"
                >
                  Approve KYC
                </Button>
              </div>
            )}
            {viewDocSubmission?.status !== 'pending' && (
              <Button
                variant="outline"
                onClick={() => setViewDocSubmission(null)}
                className="rounded-xl text-xs font-bold border-slate-800 text-slate-300 cursor-pointer"
              >
                Close Audit View
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* APPROVAL CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <Dialog open={!!approveConfirmSubmission} onOpenChange={(open) => !open && setApproveConfirmSubmission(null)}>
        <DialogContent className="sm:max-w-md p-6 rounded-3xl bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader className="text-left gap-1">
            <DialogTitle className="text-lg font-black text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Confirm Broker Verification</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 leading-relaxed pt-1">
              Approve KYC verification for <strong className="text-white">{approveConfirmSubmission?.sellerName}</strong>? This will grant a <strong className="text-emerald-400">Verified Seller Trust Badge</strong> across all their property listings.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              onClick={() => setApproveConfirmSubmission(null)}
              className="rounded-xl text-xs font-bold border-slate-800 text-slate-300 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmApprove}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs cursor-pointer shadow-md"
            >
              Confirm & Grant Badge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* REJECTION REASON DIALOG (Required, min 20 chars) */}
      {/* ========================================================================= */}
      <Dialog open={!!rejectModalSubmission} onOpenChange={(open) => !open && setRejectModalSubmission(null)}>
        <DialogContent className="sm:max-w-md p-6 rounded-3xl bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader className="text-left gap-1">
            <DialogTitle className="text-lg font-black text-rose-400 flex items-center gap-2">
              <BadgeAlert className="h-5 w-5" />
              <span>Reject KYC Verification</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Provide a clear reason for rejecting <strong className="text-white">{rejectModalSubmission?.sellerName}</strong>&apos;s identity submission (minimum 20 characters required).
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 my-3 text-left">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                Rejection Reason <span className="text-rose-400">*</span>
              </label>
              <span className={`text-[10px] font-mono font-bold ${
                rejectionReasonInput.trim().length >= 20 ? 'text-emerald-400' : 'text-slate-500'
              }`}>
                {rejectionReasonInput.trim().length}/20 chars min
              </span>
            </div>

            <textarea
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="Explain why the documents were rejected (e.g., Unclear scan quality, name mismatch on PAN card, invalid RERA number)..."
              rows={4}
              className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setRejectModalSubmission(null)}
              className="rounded-xl text-xs font-bold border-slate-800 text-slate-300 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReject}
              disabled={rejectionReasonInput.trim().length < 20}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs cursor-pointer shadow-md disabled:opacity-40"
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* FULLSCREEN IMAGE ZOOM MODAL */}
      {/* ========================================================================= */}
      <Dialog open={!!zoomedImageUrl} onOpenChange={(open) => !open && setZoomedImageUrl(null)}>
        <DialogContent className="sm:max-w-4xl p-2 bg-slate-950 border-slate-800 rounded-3xl overflow-hidden">
          {zoomedImageUrl && (
            <div className="relative h-[80vh] w-full bg-slate-950 flex items-center justify-center">
              <Image
                src={zoomedImageUrl}
                alt="Zoomed Document"
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
