'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Ban, 
  UserCheck, 
  Clock, 
  MoreVertical, 
  ShieldAlert, 
  ShieldCheck, 
  Trash2, 
  UserPlus, 
  ChevronLeft, 
  ChevronRight,
  AlertTriangle,
  Building2,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogClose 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { toast } from '@/components/ui/toast';
import { mockAdminUsers, AdminUser } from '@/lib/mock-data/admin-users';

export default function AdminUserManagementPage() {
  // State for user records
  const [usersList, setUsersList] = useState<AdminUser[]>(mockAdminUsers);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'buyer' | 'seller' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned' | 'suspended'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most_active'>('newest');

  // Pagination state (15 users per page)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Dialog & Modal states
  const [banModalUser, setBanModalUser] = useState<AdminUser | null>(null);
  const [banReasonInput, setBanReasonInput] = useState('');

  const [isBulkBanModalOpen, setIsBulkBanModalOpen] = useState(false);
  const [bulkBanReason, setBulkBanReason] = useState('');

  const [deleteModalUser, setDeleteModalUser] = useState<AdminUser | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const [viewUserDetail, setViewUserDetail] = useState<AdminUser | null>(null);

  // Filtered and Sorted Users list
  const filteredUsers = useMemo(() => {
    return usersList.filter((user) => {
      // Search query (name, email, phone)
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery || 
        user.name.toLowerCase().includes(q) || 
        user.email.toLowerCase().includes(q) || 
        user.phone.toLowerCase().includes(q);

      // Role filter
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      // Status filter
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
      }
      if (sortBy === 'most_active') {
        const activeScoreA = (a.totalListings || 0) + (a.totalEnquiries || 0);
        const activeScoreB = (b.totalListings || 0) + (b.totalEnquiries || 0);
        return activeScoreB - activeScoreA;
      }
      return 0;
    });
  }, [usersList, searchQuery, roleFilter, statusFilter, sortBy]);

  // Pagination slice
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  // Select all handler for current page
  const isAllPageSelected = paginatedUsers.length > 0 && paginatedUsers.every(u => selectedUserIds.includes(u.id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedUsers.map(u => u.id);
      setSelectedUserIds(Array.from(new Set([...selectedUserIds, ...pageIds])));
    } else {
      const pageIds = paginatedUsers.map(u => u.id);
      setSelectedUserIds(selectedUserIds.filter(id => !pageIds.includes(id)));
    }
  };

  const handleSelectRow = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUserIds([...selectedUserIds, userId]);
    } else {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
    }
  };

  // Action handlers
  const handleExportCSV = () => {
    toast(`Exporting user directory (${filteredUsers.length} records) to CSV...`, 'success');
  };

  const handleExportSelected = () => {
    toast(`Exported ${selectedUserIds.length} selected user records to CSV.`, 'success');
  };

  const handleBanUserSubmit = () => {
    if (!banModalUser) return;
    if (!banReasonInput.trim()) {
      toast('Ban reason is required.', 'error');
      return;
    }

    setUsersList(prev => prev.map(u => {
      if (u.id === banModalUser.id) {
        return { ...u, status: 'banned', banReason: banReasonInput };
      }
      return u;
    }));

    toast(`User ${banModalUser.name} has been banned.`, 'success');
    setBanModalUser(null);
    setBanReasonInput('');
  };

  const handleUnbanUser = (user: AdminUser) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === user.id) {
        return { ...u, status: 'active', banReason: undefined };
      }
      return u;
    }));
    toast(`User ${user.name} has been unbanned.`, 'success');
  };

  const handleSuspend7Days = (user: AdminUser) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === user.id) {
        return { ...u, status: 'suspended', banReason: 'Temporary 7-day administrative suspension' };
      }
      return u;
    }));
    toast(`User ${user.name} suspended for 7 days.`, 'success');
  };

  const handleBulkBanSubmit = () => {
    if (!bulkBanReason.trim()) {
      toast('Ban reason is required.', 'error');
      return;
    }

    setUsersList(prev => prev.map(u => {
      if (selectedUserIds.includes(u.id)) {
        return { ...u, status: 'banned', banReason: bulkBanReason };
      }
      return u;
    }));

    toast(`Banned ${selectedUserIds.length} selected users.`, 'success');
    setIsBulkBanModalOpen(false);
    setBulkBanReason('');
    setSelectedUserIds([]);
  };

  const handleDeleteUserSubmit = () => {
    if (!deleteModalUser) return;
    if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') {
      toast('Please type DELETE to confirm account deletion.', 'error');
      return;
    }

    setUsersList(prev => prev.filter(u => u.id !== deleteModalUser.id));
    setSelectedUserIds(prev => prev.filter(id => id !== deleteModalUser.id));
    toast(`User account for ${deleteModalUser.name} has been permanently deleted.`, 'success');
    setDeleteModalUser(null);
    setDeleteConfirmText('');
  };

  // User initials for Avatar fallback
  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Counters summary
  const totalCount = usersList.length;
  const activeCount = usersList.filter(u => u.status === 'active').length;
  const bannedCount = usersList.filter(u => u.status === 'banned').length;
  const sellerCount = usersList.filter(u => u.role === 'seller').length;

  return (
    <div className="flex flex-col gap-6 text-left pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="h-7 w-7 text-blue-400" />
            <span>User Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global directory of buyers, sellers, brokers & admin accounts.
          </p>
        </div>

        {/* Export Button */}
        <Button
          onClick={handleExportCSV}
          className="rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs h-10 px-4 shrink-0 cursor-pointer border border-slate-700 shadow-xs flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Export Directory (CSV)</span>
        </Button>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Total Registered</span>
            <span className="text-xl font-black text-white">{totalCount} Users</span>
          </div>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Active Status</span>
            <span className="text-xl font-black text-emerald-400">{activeCount} Active</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Banned Accounts</span>
            <span className="text-xl font-black text-rose-400">{bannedCount} Banned</span>
          </div>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Ban className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Seller Accounts</span>
            <span className="text-xl font-black text-purple-400">{sellerCount} Sellers</span>
          </div>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Building2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FILTERS & TOOLBAR */}
      {/* ========================================================================= */}
      <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-5 flex flex-col gap-4 shadow-lg">
        
        {/* Top Controls: Search + Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by user name, email, or phone number..."
              className="pl-10 h-11 rounded-xl bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-amber-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Select */}
            <div className="flex items-center gap-2 bg-slate-950 p-1 px-3 rounded-xl border border-slate-800 text-xs font-bold text-slate-300">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[10px] uppercase font-black text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-extrabold text-xs"
              >
                <option value="newest" className="bg-slate-900 text-slate-100">Newest Joined</option>
                <option value="oldest" className="bg-slate-900 text-slate-100">Oldest Joined</option>
                <option value="most_active" className="bg-slate-900 text-slate-100">Most Active</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Tabs: Role Filter & Status Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
          
          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
            <span className="px-2.5 text-[10px] uppercase font-black text-slate-500">Role:</span>
            {(['all', 'buyer', 'seller', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRoleFilter(r);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                  roleFilter === r 
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r === 'all' ? 'All Roles' : `${r}s`}
              </button>
            ))}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
            <span className="px-2.5 text-[10px] uppercase font-black text-slate-500">Status:</span>
            {(['all', 'active', 'banned', 'suspended'] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                  statusFilter === s 
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s === 'all' ? 'All Status' : s}
              </button>
            ))}
          </div>

        </div>

      </Card>

      {/* ========================================================================= */}
      {/* BULK ACTIONS BAR (Visible when 1 or more selected) */}
      {/* ========================================================================= */}
      {selectedUserIds.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0" />
            <span className="text-xs font-black">
              {selectedUserIds.length} user{selectedUserIds.length > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportSelected}
              className="rounded-xl border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold cursor-pointer"
            >
              Export Selected ({selectedUserIds.length})
            </Button>
            <Button
              size="sm"
              onClick={() => setIsBulkBanModalOpen(true)}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs cursor-pointer shadow-xs"
            >
              <Ban className="h-3.5 w-3.5 mr-1.5" />
              <span>Ban Selected ({selectedUserIds.length})</span>
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* USERS TABLE */}
      {/* ========================================================================= */}
      <Card className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">
                <th className="py-4 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllPageSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded bg-slate-900 border-slate-700 accent-amber-500 cursor-pointer"
                  />
                </th>
                <th className="py-4 px-4">User</th>
                <th className="py-4 px-4">Phone</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Joined Date</th>
                <th className="py-4 px-4">Last Active</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs font-semibold">
                    No users match your current search and filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const isSelected = selectedUserIds.includes(user.id);
                  return (
                    <tr 
                      key={user.id} 
                      className={`group hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-amber-500/[0.04]' : ''
                      }`}
                    >
                      {/* Select Checkbox */}
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(user.id, e.target.checked)}
                          className="h-4 w-4 rounded bg-slate-900 border-slate-700 accent-amber-500 cursor-pointer"
                        />
                      </td>

                      {/* User (Avatar + Name + Email) */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-slate-700 bg-slate-800">
                            <AvatarFallback className="bg-slate-800 text-amber-400 font-black text-xs">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-extrabold text-slate-100 group-hover:text-amber-400 transition-colors">
                              {user.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 text-slate-300 font-mono text-[11px]">
                        {user.phone}
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-4">
                        <Badge className={`text-[10px] font-extrabold capitalize border px-2.5 py-0.5 ${
                          user.role === 'admin'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : user.role === 'seller'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {user.role}
                        </Badge>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        <Badge className={`text-[10px] font-extrabold capitalize border px-2.5 py-0.5 ${
                          user.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : user.status === 'banned'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {user.status}
                        </Badge>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-4 text-slate-400 font-semibold text-xs">
                        {user.joinedDate}
                      </td>

                      {/* Last Active */}
                      <td className="py-4 px-4 text-slate-400 font-semibold text-xs">
                        {user.lastActive}
                      </td>

                      {/* Actions Dropdown */}
                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          } />
                          <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-slate-800 text-slate-200">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-500">
                              User Actions
                            </DropdownMenuLabel>
                            
                            {/* View Profile */}
                            <DropdownMenuItem 
                              onClick={() => setViewUserDetail(user)}
                              className="text-xs font-bold cursor-pointer hover:bg-slate-800 hover:text-white"
                            >
                              <Eye className="h-4 w-4 mr-2 text-blue-400" />
                              <span>View Profile</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-slate-800" />

                            {/* Ban User (If not banned) */}
                            {user.status !== 'banned' && (
                              <DropdownMenuItem 
                                onClick={() => {
                                  setBanModalUser(user);
                                  setBanReasonInput('');
                                }}
                                className="text-xs font-bold text-amber-400 cursor-pointer hover:bg-amber-500/10 hover:text-amber-300"
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                <span>Ban User</span>
                              </DropdownMenuItem>
                            )}

                            {/* Unban User (If banned) */}
                            {user.status === 'banned' && (
                              <DropdownMenuItem 
                                onClick={() => handleUnbanUser(user)}
                                className="text-xs font-bold text-emerald-400 cursor-pointer hover:bg-emerald-500/10 hover:text-emerald-300"
                              >
                                <UserCheck className="h-4 w-4 mr-2" />
                                <span>Unban User</span>
                              </DropdownMenuItem>
                            )}

                            {/* Suspend 7 Days (If active) */}
                            {user.status === 'active' && (
                              <DropdownMenuItem 
                                onClick={() => handleSuspend7Days(user)}
                                className="text-xs font-bold text-amber-400 cursor-pointer hover:bg-amber-500/10 hover:text-amber-300"
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                <span>Suspend 7 Days</span>
                              </DropdownMenuItem>
                            )}

                            {/* Make Admin (Disabled for Superadmin Security) */}
                            <DropdownMenuItem 
                              disabled 
                              className="text-xs font-bold text-slate-600 cursor-not-allowed opacity-50"
                            >
                              <UserPlus className="h-4 w-4 mr-2 text-slate-600" />
                              <span>Make Admin (Locked)</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-slate-800" />

                            {/* Delete Account (Destructive) */}
                            <DropdownMenuItem 
                              onClick={() => {
                                setDeleteModalUser(user);
                                setDeleteConfirmText('');
                              }}
                              className="text-xs font-bold text-rose-400 cursor-pointer hover:bg-rose-500/10 hover:text-rose-300"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span>Delete Account</span>
                            </DropdownMenuItem>

                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-xs font-bold text-slate-400">
            Showing <strong className="text-slate-200">{filteredUsers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong>–<strong className="text-slate-200">{Math.min(currentPage * pageSize, filteredUsers.length)}</strong> of <strong className="text-slate-200">{filteredUsers.length}</strong> users
          </span>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-xl border-slate-800 text-xs font-bold text-slate-300 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Previous</span>
            </Button>

            <span className="text-xs font-bold text-slate-300 px-2">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-xl border-slate-800 text-xs font-bold text-slate-300 disabled:opacity-40 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* BAN USER DIALOG (With Reason Input) */}
      {/* ========================================================================= */}
      <Dialog open={!!banModalUser} onOpenChange={(open) => !open && setBanModalUser(null)}>
        <DialogContent className="sm:max-w-md p-6 rounded-3xl bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader className="text-left gap-1">
            <DialogTitle className="text-lg font-black text-rose-400 flex items-center gap-2">
              <Ban className="h-5 w-5" />
              <span>Ban User Account</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Are you sure you want to ban <strong className="text-slate-200">{banModalUser?.name}</strong> ({banModalUser?.email})? This action revokes login access and listing visibility.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 my-3 text-left">
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
              Reason for Ban <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={banReasonInput}
              onChange={(e) => setBanReasonInput(e.target.value)}
              placeholder="Specify rule violation (e.g. fraudulent listings, spam inquiries, policy violation)..."
              rows={3}
              className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setBanModalUser(null)}
              className="rounded-xl text-xs font-bold border-slate-800 text-slate-300 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBanUserSubmit}
              disabled={!banReasonInput.trim()}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs cursor-pointer shadow-md"
            >
              Confirm Ban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* BULK BAN DIALOG */}
      {/* ========================================================================= */}
      <Dialog open={isBulkBanModalOpen} onOpenChange={setIsBulkBanModalOpen}>
        <DialogContent className="sm:max-w-md p-6 rounded-3xl bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader className="text-left gap-1">
            <DialogTitle className="text-lg font-black text-rose-400 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              <span>Bulk Ban ({selectedUserIds.length}) Users</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              This will ban all {selectedUserIds.length} currently selected user accounts. Please provide a reason for audit logging.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 my-3 text-left">
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
              Bulk Ban Audit Reason <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={bulkBanReason}
              onChange={(e) => setBulkBanReason(e.target.value)}
              placeholder="Administrative bulk ban reason..."
              rows={3}
              className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsBulkBanModalOpen(false)}
              className="rounded-xl text-xs font-bold border-slate-800 text-slate-300 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkBanSubmit}
              disabled={!bulkBanReason.trim()}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs cursor-pointer shadow-md"
            >
              Ban {selectedUserIds.length} Users
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DELETE USER DIALOG (Double Confirmation) */}
      {/* ========================================================================= */}
      <Dialog open={!!deleteModalUser} onOpenChange={(open) => !open && setDeleteModalUser(null)}>
        <DialogContent className="sm:max-w-md p-6 rounded-3xl bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader className="text-left gap-1">
            <DialogTitle className="text-lg font-black text-rose-500 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              <span>Delete User Account</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 leading-relaxed">
              This action is <strong className="text-rose-400 uppercase">permanent and irreversible</strong>. All user listings, data, and access tokens for <strong className="text-white">{deleteModalUser?.name}</strong> will be erased.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 my-3 text-left">
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
              Type <span className="text-rose-400 font-mono font-bold">DELETE</span> to confirm
            </label>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE..."
              className="h-11 rounded-xl bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-rose-500"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteModalUser(null)}
              className="rounded-xl text-xs font-bold border-slate-800 text-slate-300 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteUserSubmit}
              disabled={deleteConfirmText.trim().toUpperCase() !== 'DELETE'}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs cursor-pointer shadow-md disabled:opacity-40"
            >
              Permanently Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* VIEW USER DETAILS DRAWER / SHEET */}
      {/* ========================================================================= */}
      <Sheet open={!!viewUserDetail} onOpenChange={(open) => !open && setViewUserDetail(null)}>
        <SheetContent className="w-full sm:max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 p-6 flex flex-col justify-between">
          <div>
            <SheetHeader className="text-left pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border border-slate-700 bg-slate-800">
                  <AvatarFallback className="bg-slate-800 text-amber-400 font-black text-sm">
                    {viewUserDetail ? getInitials(viewUserDetail.name) : 'US'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <SheetTitle className="text-lg font-black text-white">
                    {viewUserDetail?.name}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-slate-400 font-mono">
                    {viewUserDetail?.id} • Joined {viewUserDetail?.joinedDate}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            {viewUserDetail && (
              <div className="flex flex-col gap-5 my-6 text-xs">
                
                {/* Account Badges */}
                <div className="flex items-center gap-2">
                  <Badge className={`capitalize border px-3 py-1 font-bold text-xs ${
                    viewUserDetail.role === 'admin'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : viewUserDetail.role === 'seller'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {viewUserDetail.role}
                  </Badge>

                  <Badge className={`capitalize border px-3 py-1 font-bold text-xs ${
                    viewUserDetail.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : viewUserDetail.status === 'banned'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {viewUserDetail.status}
                  </Badge>
                </div>

                {/* Contact Info Card */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                    <span className="font-semibold">{viewUserDetail.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                    <span className="font-mono">{viewUserDetail.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>Last Active: <strong>{viewUserDetail.lastActive}</strong></span>
                  </div>
                </div>

                {/* Role Specific Stats */}
                {viewUserDetail.role === 'seller' && (
                  <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase text-purple-400">Seller Metrics</span>
                    <div className="flex items-center justify-between text-slate-200">
                      <span>Total Active Listings:</span>
                      <strong className="text-white text-sm">{viewUserDetail.totalListings} properties</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-200">
                      <span>Subscription Plan:</span>
                      <Badge className="bg-amber-500 text-slate-950 font-black uppercase text-[9px]">
                        {viewUserDetail.subscriptionPlan || 'free'}
                      </Badge>
                    </div>
                  </div>
                )}

                {viewUserDetail.role === 'buyer' && (
                  <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase text-blue-400">Buyer Engagement</span>
                    <div className="flex items-center justify-between text-slate-200">
                      <span>Total Property Inquiries:</span>
                      <strong className="text-white text-sm">{viewUserDetail.totalEnquiries} leads sent</strong>
                    </div>
                  </div>
                )}

                {/* Ban Reason Note if Banned */}
                {viewUserDetail.banReason && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex flex-col gap-1">
                    <span className="font-black uppercase text-[10px] text-rose-400">Ban / Suspension Reason:</span>
                    <p className="font-semibold">{viewUserDetail.banReason}</p>
                  </div>
                )}

              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Button
              onClick={() => setViewUserDetail(null)}
              className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs h-10 cursor-pointer"
            >
              Close Profile Drawer
            </Button>
          </div>
        </SheetContent>
      </Sheet>

    </div>
  );
}
