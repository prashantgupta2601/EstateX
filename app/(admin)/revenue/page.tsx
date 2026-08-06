'use client';

import React, { useState, useMemo } from 'react';
import {
  monthlyRevenue,
  allPayments,
  subscriptionBreakdown,
  PaymentData,
} from '@/lib/mock-data/admin-revenue';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Repeat,
  CreditCard,
  Download,
  Search,
  FileText,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  IndianRupee,
  ShieldCheck,
  RefreshCw,
  Eye,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';

type PaymentStatusFilter = 'all' | 'success' | 'failed' | 'refunded';

export default function AdminRevenueDashboard() {
  // Local state for payments (allows updating status on refund)
  const [payments, setPayments] = useState<PaymentData[]>(allPayments);
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // State for Refund Confirmation Modal
  const [selectedRefundPayment, setSelectedRefundPayment] = useState<PaymentData | null>(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

  // State for Invoice View Modal
  const [selectedInvoicePayment, setSelectedInvoicePayment] = useState<PaymentData | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Key Metrics Calculations
  const latestMonth = monthlyRevenue[monthlyRevenue.length - 1]; // Aug 2026
  const prevMonth = monthlyRevenue[monthlyRevenue.length - 2]; // Jul 2026

  const currentMRR = latestMonth.mrr;
  const currentARR = currentMRR * 12;
  const totalActivePaidSubscriptions = subscriptionBreakdown.basic + subscriptionBreakdown.pro;
  const currentChurnRate = 2.4; // 2.4%
  const arpu = Math.round(currentMRR / totalActivePaidSubscriptions);

  // Percent changes vs last month
  const mrrChange = (((currentMRR - prevMonth.mrr) / prevMonth.mrr) * 100).toFixed(1);
  const arrChange = mrrChange;
  const subChange = '+8.8';
  const churnChange = '-0.6';
  const arpuChange = '+3.3';

  // Format INR Currency
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Filtered payment records based on status tab and search text
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      // Status filter
      if (statusFilter !== 'all' && payment.status !== statusFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = payment.sellerName.toLowerCase().includes(q);
        const matchesEmail = payment.sellerEmail.toLowerCase().includes(q);
        const matchesId = payment.id.toLowerCase().includes(q);
        const matchesRazorpay = payment.razorpayPaymentId.toLowerCase().includes(q);
        const matchesPlan = payment.plan.toLowerCase().includes(q);
        return matchesName || matchesEmail || matchesId || matchesRazorpay || matchesPlan;
      }
      return true;
    });
  }, [payments, statusFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage) || 1;
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(start, start + itemsPerPage);
  }, [filteredPayments, currentPage]);

  // Reset to page 1 when filter/search changes
  const handleStatusFilterChange = (status: PaymentStatusFilter) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    toast(`Exported ${filteredPayments.length} payment records to CSV.`, 'success');
  };

  // View Invoice Handler
  const handleOpenInvoice = (payment: PaymentData) => {
    setSelectedInvoicePayment(payment);
    setIsInvoiceModalOpen(true);
  };

  const handleDownloadInvoice = (paymentId: string) => {
    toast(`Downloading invoice ${paymentId}...`, 'success');
  };

  // Issue Refund Handlers
  const handleOpenRefundModal = (payment: PaymentData) => {
    setSelectedRefundPayment(payment);
    setIsRefundModalOpen(true);
  };

  const handleConfirmRefund = () => {
    if (!selectedRefundPayment) return;
    setIsProcessingRefund(true);
    setTimeout(() => {
      setPayments((prev) =>
        prev.map((p) => (p.id === selectedRefundPayment.id ? { ...p, status: 'refunded' } : p))
      );
      setIsProcessingRefund(false);
      setIsRefundModalOpen(false);
      toast(
        `Refund of ${formatINR(selectedRefundPayment.total)} issued for ${selectedRefundPayment.id}`,
        'success'
      );
      setSelectedRefundPayment(null);
    }, 600);
  };

  // Donut chart colors for Subscription breakdown
  const DONUT_COLORS = {
    free: '#64748b', // Slate 500
    basic: '#6366f1', // Indigo 500
    pro: '#f59e0b', // Amber 500
  };

  const pieData = [
    { name: 'Free Tier', value: subscriptionBreakdown.free, color: DONUT_COLORS.free },
    { name: 'Basic Plan', value: subscriptionBreakdown.basic, color: DONUT_COLORS.basic },
    { name: 'Pro Plan', value: subscriptionBreakdown.pro, color: DONUT_COLORS.pro },
  ];

  const totalUsersCount =
    subscriptionBreakdown.free + subscriptionBreakdown.basic + subscriptionBreakdown.pro;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <DollarSign className="h-6 w-6 stroke-[2.5]" />
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Revenue & Subscriptions Dashboard
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time financial performance, recurring revenue metrics, plan breakdown, and payment transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={handleExportCSV}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/10 cursor-pointer"
          >
            <Download className="h-4 w-4 mr-1.5 stroke-[2.5]" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Row 1 — Key Metrics (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* MRR */}
        <Card className="bg-slate-900/70 border-slate-800 backdrop-blur-sm relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                MRR (Monthly)
              </p>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white mt-2">
              {formatINR(currentMRR)}
            </h3>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+{mrrChange}% vs last mo</span>
            </div>
          </CardContent>
        </Card>

        {/* ARR */}
        <Card className="bg-slate-900/70 border-slate-800 backdrop-blur-sm relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                ARR (Annual)
              </p>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white mt-2">
              {formatINR(currentARR)}
            </h3>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+{arrChange}% vs last mo</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Subscriptions */}
        <Card className="bg-slate-900/70 border-slate-800 backdrop-blur-sm relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Active Paid Subs
              </p>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white mt-2">
              {totalActivePaidSubscriptions}
            </h3>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{subChange}% vs last mo</span>
            </div>
          </CardContent>
        </Card>

        {/* Churn Rate */}
        <Card className="bg-slate-900/70 border-slate-800 backdrop-blur-sm relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Churn Rate
              </p>
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Repeat className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white mt-2">
              {currentChurnRate}%
            </h3>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold mt-1">
              <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
              <span>{churnChange}% vs last mo</span>
            </div>
          </CardContent>
        </Card>

        {/* ARPU */}
        <Card className="bg-slate-900/70 border-slate-800 backdrop-blur-sm relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                ARPU
              </p>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white mt-2">
              {formatINR(arpu)}
            </h3>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{arpuChange}% vs last mo</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2 — Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stacked Bar Chart: Basic vs Pro Revenue (Last 12 Months) */}
        <Card className="bg-slate-900/80 border-slate-800 p-6 flex flex-col justify-between">
          <div className="space-y-1 pb-4 border-b border-slate-800">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-400" />
              Monthly Revenue (Last 12 Months)
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Stacked breakdown of Basic Plan revenue vs Pro Plan revenue.
            </CardDescription>
          </div>

          <div className="h-[320px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(val: any, name: any) => [
                    formatINR(Number(val)),
                    name === 'basicPlanRevenue' ? 'Basic Plan' : 'Pro Plan',
                  ]}
                  labelStyle={{ fontWeight: 'bold', color: '#94a3b8', marginBottom: '4px' }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={32}
                  formatter={(val) => (
                    <span className="text-xs font-semibold text-slate-300">
                      {val === 'basicPlanRevenue' ? 'Basic Plan' : 'Pro Plan'}
                    </span>
                  )}
                />
                <Bar
                  dataKey="basicPlanRevenue"
                  stackId="a"
                  fill="#6366f1"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="proPlanRevenue"
                  stackId="a"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Line Chart: MRR Growth Trend */}
        <Card className="bg-slate-900/80 border-slate-800 p-6 flex flex-col justify-between">
          <div className="space-y-1 pb-4 border-b border-slate-800">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              MRR Growth Trend
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Monthly Recurring Revenue (MRR) expansion trajectory over 12 months.
            </CardDescription>
          </div>

          <div className="h-[320px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(val: any) => [formatINR(Number(val)), 'MRR']}
                  labelStyle={{ fontWeight: 'bold', color: '#94a3b8', marginBottom: '4px' }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={32}
                  formatter={() => (
                    <span className="text-xs font-semibold text-slate-300">
                      MRR (Monthly Recurring Revenue)
                    </span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="mrr"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }}
                  activeDot={{ r: 7, fill: '#34d399' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 3 — Subscription Breakdown */}
      <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-6">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-amber-400" />
              Subscription Distribution & Revenue Share
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Active user segmentation across Free, Basic, and Pro plan tiers.
            </CardDescription>
          </div>
          <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-xs w-fit">
            Total Sellers: {totalUsersCount}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Donut Chart (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="h-[240px] w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#f8fafc',
                    }}
                    formatter={(val: any, name: any) => [`${val} Users`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Inner Center Label */}
              <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-2xl font-black text-white">{totalActivePaidSubscriptions}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Paid Sellers
                </span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="flex items-center justify-center gap-6 mt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <span className="h-3 w-3 rounded-full bg-slate-500" />
                <span>Free ({subscriptionBreakdown.free})</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <span className="h-3 w-3 rounded-full bg-indigo-500" />
                <span>Basic ({subscriptionBreakdown.basic})</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span>Pro ({subscriptionBreakdown.pro})</span>
              </div>
            </div>
          </div>

          {/* Right Table Alongside (7 cols) */}
          <div className="lg:col-span-7 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-3">Plan Tier</th>
                  <th className="py-3 px-3 text-right">Users</th>
                  <th className="py-3 px-3 text-right">Plan Price</th>
                  <th className="py-3 px-3 text-right">Monthly Revenue</th>
                  <th className="py-3 px-3 text-right">% of Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-slate-300 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-500 shrink-0" />
                    Free Tier
                  </td>
                  <td className="py-3.5 px-3 text-right font-medium text-slate-400">
                    {subscriptionBreakdown.free}
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-500">₹0 / mo</td>
                  <td className="py-3.5 px-3 text-right font-bold text-slate-400">₹0</td>
                  <td className="py-3.5 px-3 text-right text-slate-500 font-semibold">0.0%</td>
                </tr>

                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-white flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shrink-0" />
                    Basic Seller Plan
                  </td>
                  <td className="py-3.5 px-3 text-right font-medium text-slate-200">
                    {subscriptionBreakdown.basic}
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-400">₹999 / mo</td>
                  <td className="py-3.5 px-3 text-right font-bold text-indigo-400">
                    {formatINR(latestMonth.basicPlanRevenue)}
                  </td>
                  <td className="py-3.5 px-3 text-right text-indigo-400 font-bold">
                    {((latestMonth.basicPlanRevenue / latestMonth.mrr) * 100).toFixed(1)}%
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-white flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
                    Pro Seller Plan
                  </td>
                  <td className="py-3.5 px-3 text-right font-medium text-slate-200">
                    {subscriptionBreakdown.pro}
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-400">₹7,499 / mo</td>
                  <td className="py-3.5 px-3 text-right font-bold text-amber-400">
                    {formatINR(latestMonth.proPlanRevenue)}
                  </td>
                  <td className="py-3.5 px-3 text-right text-amber-400 font-bold">
                    {((latestMonth.proPlanRevenue / latestMonth.mrr) * 100).toFixed(1)}%
                  </td>
                </tr>

                <tr className="bg-slate-950/80 font-bold text-white border-t-2 border-slate-800">
                  <td className="py-3.5 px-3 text-slate-100">Total Active Paid</td>
                  <td className="py-3.5 px-3 text-right text-white">{totalActivePaidSubscriptions}</td>
                  <td className="py-3.5 px-3 text-right text-slate-500">—</td>
                  <td className="py-3.5 px-3 text-right text-emerald-400 font-black">
                    {formatINR(latestMonth.mrr)}
                  </td>
                  <td className="py-3.5 px-3 text-right text-emerald-400 font-black">100.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Row 4 — Payment History Table */}
      <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-6">
        {/* Table Header: Filters & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-indigo-400" />
              Payment History & Transactions
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-0.5">
              Comprehensive log of seller payment invoices, GST calculations, Razorpay transaction IDs, and actions.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search seller, ID, plan..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 w-[220px]"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              {(['all', 'success', 'failed', 'refunded'] as PaymentStatusFilter[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStatusFilterChange(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-3">Seller Details</th>
                <th className="py-3 px-3">Plan Tier</th>
                <th className="py-3 px-3 text-right">Base Amount</th>
                <th className="py-3 px-3 text-right">GST (18%)</th>
                <th className="py-3 px-3 text-right">Total Paid</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Razorpay ID</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 text-xs">
                    No payment records match your selected filter or search term.
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Seller Name & Email */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{payment.sellerName}</span>
                        <span className="text-[10px] text-slate-400">{payment.sellerEmail}</span>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-3 px-3">
                      <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px] font-medium">
                        {payment.plan}
                      </Badge>
                    </td>

                    {/* Base Amount */}
                    <td className="py-3 px-3 text-right font-medium text-slate-300">
                      {formatINR(payment.amount)}
                    </td>

                    {/* GST */}
                    <td className="py-3 px-3 text-right text-slate-400">
                      {formatINR(payment.gst)}
                    </td>

                    {/* Total */}
                    <td className="py-3 px-3 text-right font-bold text-white">
                      {formatINR(payment.total)}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {payment.date}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      {payment.status === 'success' && (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-bold gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Success
                        </Badge>
                      )}
                      {payment.status === 'failed' && (
                        <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[10px] font-bold gap-1">
                          <XCircle className="h-3 w-3" />
                          Failed
                        </Badge>
                      )}
                      {payment.status === 'refunded' && (
                        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] font-bold gap-1">
                          <RotateCcw className="h-3 w-3" />
                          Refunded
                        </Badge>
                      )}
                    </td>

                    {/* Razorpay ID */}
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                      {payment.razorpayPaymentId}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenInvoice(payment)}
                          className="h-7 px-2 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 cursor-pointer"
                        >
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          Invoice
                        </Button>

                        {payment.status === 'success' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenRefundModal(payment)}
                            className="h-7 px-2 text-[11px] font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
                          >
                            <RotateCcw className="h-3.5 w-3.5 mr-1" />
                            Refund
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
          <div>
            Showing{' '}
            <span className="font-semibold text-slate-200">
              {filteredPayments.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-slate-200">
              {Math.min(currentPage * itemsPerPage, filteredPayments.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-200">{filteredPayments.length}</span> payments
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

      {/* Confirmation Dialog Modal for Refund */}
      <Dialog open={isRefundModalOpen} onOpenChange={setIsRefundModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-rose-400" />
              Confirm Payment Refund
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 mt-1">
              Are you sure you want to issue a full refund for this payment transaction?
            </DialogDescription>
          </DialogHeader>

          {selectedRefundPayment && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Invoice ID:</span>
                <span className="font-semibold text-white">{selectedRefundPayment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Seller:</span>
                <span className="font-semibold text-white">{selectedRefundPayment.sellerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Plan:</span>
                <span className="font-semibold text-slate-300">{selectedRefundPayment.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Refund Amount:</span>
                <span className="font-black text-rose-400">{formatINR(selectedRefundPayment.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Razorpay Payment ID:</span>
                <span className="font-mono text-slate-400">{selectedRefundPayment.razorpayPaymentId}</span>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:justify-end mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRefundModalOpen(false)}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={isProcessingRefund}
              onClick={handleConfirmRefund}
              className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs cursor-pointer"
            >
              {isProcessingRefund ? 'Processing...' : 'Confirm Refund'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Details Dialog Modal */}
      <Dialog open={isInvoiceModalOpen} onOpenChange={setIsInvoiceModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-400" />
                Tax Invoice {selectedInvoicePayment?.id}
              </span>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                Paid
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              EstateX GST Tax Invoice & Receipt Details
            </DialogDescription>
          </DialogHeader>

          {selectedInvoicePayment && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Billed To</span>
                  <span className="font-bold text-white block mt-0.5">{selectedInvoicePayment.sellerName}</span>
                  <span className="text-slate-400 block">{selectedInvoicePayment.sellerEmail}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Invoice Date</span>
                  <span className="font-semibold text-white block mt-0.5">{selectedInvoicePayment.date}</span>
                  <span className="text-[10px] font-mono text-slate-500 block">
                    {selectedInvoicePayment.razorpayPaymentId}
                  </span>
                </div>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    <tr>
                      <td className="p-3">{selectedInvoicePayment.plan}</td>
                      <td className="p-3 text-right font-medium">{formatINR(selectedInvoicePayment.amount)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-400">GST (18% Goods & Services Tax)</td>
                      <td className="p-3 text-right text-slate-400">{formatINR(selectedInvoicePayment.gst)}</td>
                    </tr>
                    <tr className="font-bold bg-slate-950 text-white">
                      <td className="p-3">Total Billed Amount</td>
                      <td className="p-3 text-right text-emerald-400">{formatINR(selectedInvoicePayment.total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:justify-end mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsInvoiceModalOpen(false)}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 text-xs cursor-pointer"
            >
              Close
            </Button>
            {selectedInvoicePayment && (
              <Button
                size="sm"
                onClick={() => handleDownloadInvoice(selectedInvoicePayment.id)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Download PDF
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
