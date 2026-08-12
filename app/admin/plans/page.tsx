'use client';

import React, { useState } from 'react';
import {
  initialSubscriptionPlans,
  initialPromoCodes,
  SubscriptionPlanData,
  PromoCodeData,
  PlanFeatureConfig,
} from '@/lib/mock-data/admin-plans';
import {
  CreditCard,
  Plus,
  Edit2,
  Copy,
  Trash2,
  Sparkles,
  Tag,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Percent,
  IndianRupee,
  Calendar,
  Layers,
  Wand2,
  Check,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';

const PRESET_BADGE_COLORS: Array<{
  key: SubscriptionPlanData['badgeColor'];
  name: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}> = [
  { key: 'amber', name: 'Amber', bgClass: 'bg-amber-500/15', textClass: 'text-amber-400', borderClass: 'border-amber-500/30' },
  { key: 'indigo', name: 'Indigo', bgClass: 'bg-indigo-500/15', textClass: 'text-indigo-400', borderClass: 'border-indigo-500/30' },
  { key: 'emerald', name: 'Emerald', bgClass: 'bg-emerald-500/15', textClass: 'text-emerald-400', borderClass: 'border-emerald-500/30' },
  { key: 'sky', name: 'Sky', bgClass: 'bg-sky-500/15', textClass: 'text-sky-400', borderClass: 'border-sky-500/30' },
  { key: 'rose', name: 'Rose', bgClass: 'bg-rose-500/15', textClass: 'text-rose-400', borderClass: 'border-rose-500/30' },
  { key: 'violet', name: 'Violet', bgClass: 'bg-violet-500/15', textClass: 'text-violet-400', borderClass: 'border-violet-500/30' },
];

const DEFAULT_FEATURE_CONFIG: PlanFeatureConfig = {
  listingsLimit: 5,
  featuredListings: 1,
  photoLimit: 10,
  videoUpload: false,
  analyticsAccess: false,
  prioritySupport: false,
  verifiedBadge: true,
  phoneReveal: true,
  leadManagement: false,
};

export default function AdminSubscriptionPlansPage() {
  // State for Plans and Promo Codes
  const [plans, setPlans] = useState<SubscriptionPlanData[]>(initialSubscriptionPlans);
  const [promoCodes, setPromoCodes] = useState<PromoCodeData[]>(initialPromoCodes);

  // Modal state for Add/Edit Plan
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlanData | null>(null);

  // Form state for Plan
  const [planName, setPlanName] = useState('');
  const [description, setDescription] = useState('');
  const [badgeColor, setBadgeColor] = useState<SubscriptionPlanData['badgeColor']>('indigo');
  const [monthlyPrice, setMonthlyPrice] = useState<number>(999);
  const [yearlyPrice, setYearlyPrice] = useState<number>(9990);
  const [isPopular, setIsPopular] = useState(false);
  const [features, setFeatures] = useState<PlanFeatureConfig>(DEFAULT_FEATURE_CONFIG);

  // Modal state for Deactivation Warning
  const [deactivatingPlan, setDeactivatingPlan] = useState<SubscriptionPlanData | null>(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  // Modal state for Archive Confirmation
  const [archivingPlan, setArchivingPlan] = useState<SubscriptionPlanData | null>(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  // Modal state for Promo Code
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoDiscountType, setPromoDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [promoValue, setPromoValue] = useState<number>(20);
  const [promoMaxUses, setPromoMaxUses] = useState<number>(100);
  const [promoExpiry, setPromoExpiry] = useState<string>('2026-12-31');

  // Format INR Currency
  const formatINR = (val: number) => {
    if (val === 0) return 'Free';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingPlan(null);
    setPlanName('');
    setDescription('');
    setBadgeColor('indigo');
    setMonthlyPrice(999);
    setYearlyPrice(9990);
    setIsPopular(false);
    setFeatures(DEFAULT_FEATURE_CONFIG);
    setIsPlanModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (plan: SubscriptionPlanData) => {
    setEditingPlan(plan);
    setPlanName(plan.name);
    setDescription(plan.description);
    setBadgeColor(plan.badgeColor);
    setMonthlyPrice(plan.monthlyPrice);
    setYearlyPrice(plan.yearlyPrice);
    setIsPopular(plan.isPopular);
    setFeatures({ ...plan.features });
    setIsPlanModalOpen(true);
  };

  // Auto-suggest yearly price (10x monthly)
  const handleAutoSuggestYearly = () => {
    setYearlyPrice(monthlyPrice * 10);
    toast(`Yearly price auto-suggested to ₹${(monthlyPrice * 10).toLocaleString('en-IN')}`, 'success');
  };

  // Save Plan (Create or Update)
  const handleSavePlan = () => {
    if (!planName.trim()) {
      toast('Please enter a plan name.', 'error');
      return;
    }

    if (editingPlan) {
      // Update existing
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editingPlan.id
            ? {
                ...p,
                name: planName.trim(),
                description: description.trim(),
                badgeColor,
                monthlyPrice,
                yearlyPrice,
                isPopular,
                features,
              }
            : p
        )
      );
      toast(`Updated subscription plan "${planName}".`, 'success');
    } else {
      // Create new
      const newPlan: SubscriptionPlanData = {
        id: `plan-${Date.now()}`,
        name: planName.trim(),
        description: description.trim(),
        badgeColor,
        monthlyPrice,
        yearlyPrice,
        isPopular,
        isActive: true,
        activeSubscribers: 0,
        revenueThisMonth: 0,
        features,
      };
      setPlans((prev) => [...prev, newPlan]);
      toast(`Created new subscription plan "${planName}".`, 'success');
    }

    setIsPlanModalOpen(false);
  };

  // Duplicate Plan
  const handleDuplicatePlan = (plan: SubscriptionPlanData) => {
    const duplicatedPlan: SubscriptionPlanData = {
      ...plan,
      id: `plan-${Date.now()}`,
      name: `${plan.name} (Copy)`,
      activeSubscribers: 0,
      revenueThisMonth: 0,
      isActive: true,
    };
    setPlans((prev) => [...prev, duplicatedPlan]);
    toast(`Duplicated "${plan.name}" as "${duplicatedPlan.name}".`, 'success');
  };

  // Toggle Plan Active Status
  const handleTogglePlanStatus = (plan: SubscriptionPlanData, newChecked: boolean) => {
    if (!newChecked) {
      // Deactivating -> check subscriber warning
      setDeactivatingPlan(plan);
      setIsDeactivateModalOpen(true);
    } else {
      // Activating -> direct update
      setPlans((prev) =>
        prev.map((p) => (p.id === plan.id ? { ...p, isActive: true } : p))
      );
      toast(`Activated plan "${plan.name}".`, 'success');
    }
  };

  // Confirm Deactivation
  const handleConfirmDeactivation = () => {
    if (!deactivatingPlan) return;
    setPlans((prev) =>
      prev.map((p) => (p.id === deactivatingPlan.id ? { ...p, isActive: false } : p))
    );
    toast(`Deactivated plan "${deactivatingPlan.name}".`, 'success');
    setIsDeactivateModalOpen(false);
    setDeactivatingPlan(null);
  };

  // Confirm Archive/Delete
  const handleConfirmArchive = () => {
    if (!archivingPlan) return;
    setPlans((prev) => prev.filter((p) => p.id !== archivingPlan.id));
    toast(`Archived plan "${archivingPlan.name}".`, 'success');
    setIsArchiveModalOpen(false);
    setArchivingPlan(null);
  };

  // Generate Random Promo Code
  const handleGenerateRandomPromo = () => {
    const prefixes = ['ESTATE', 'PROMO', 'FLAT', 'SUPER', 'SUMMER', 'DEAL'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(10 + Math.random() * 90);
    setPromoCodeInput(`${randomPrefix}${randomNum}`);
  };

  // Save Promo Code
  const handleSavePromoCode = () => {
    if (!promoCodeInput.trim()) {
      toast('Please enter a promo code.', 'error');
      return;
    }

    const newCode: PromoCodeData = {
      id: `promo-${Date.now()}`,
      code: promoCodeInput.trim().toUpperCase(),
      discountType: promoDiscountType,
      discountValue: promoValue,
      currentUses: 0,
      maxUses: promoMaxUses,
      expiryDate: promoExpiry,
      isActive: true,
    };

    setPromoCodes((prev) => [newCode, ...prev]);
    toast(`Created promo code ${newCode.code}.`, 'success');
    setIsPromoModalOpen(false);
  };

  // Toggle Promo Active Status
  const handleTogglePromoStatus = (promoId: string, active: boolean) => {
    setPromoCodes((prev) =>
      prev.map((pc) => (pc.id === promoId ? { ...pc, isActive: active } : pc))
    );
    toast(`Promo code status updated.`, 'success');
  };

  // Helper for badge color lookup
  const getBadgeStyle = (colorKey: SubscriptionPlanData['badgeColor']) => {
    return PRESET_BADGE_COLORS.find((c) => c.key === colorKey) || PRESET_BADGE_COLORS[1];
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <CreditCard className="h-6 w-6 stroke-[2.5]" />
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Subscription Plans
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Configure seller plan tiers, feature limits, pricing rules, and promo code discounts.
          </p>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/10 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 mr-1.5 stroke-[2.5]" />
          Add New Plan
        </Button>
      </div>

      {/* Section 1: Current Plans Table */}
      <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-400" />
              Current Active Tiers & Pricing
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Manage seller subscription plans and active feature configurations.
            </CardDescription>
          </div>
          <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-xs">
            {plans.length} Total Plans
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-3">Plan Name</th>
                <th className="py-3 px-3 text-right">Monthly Price</th>
                <th className="py-3 px-3 text-right">Yearly Price</th>
                <th className="py-3 px-3 text-right">Subscribers</th>
                <th className="py-3 px-3 text-right">Monthly Revenue</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {plans.map((plan) => {
                const bStyle = getBadgeStyle(plan.badgeColor);
                return (
                  <tr
                    key={plan.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      !plan.isActive ? 'opacity-60 bg-slate-950/40' : ''
                    }`}
                  >
                    {/* Plan Name + Badges */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${bStyle.bgClass} ${bStyle.textClass} ${bStyle.borderClass}`}
                          >
                            {plan.name}
                          </span>
                          {plan.isPopular && (
                            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[9px] font-extrabold uppercase tracking-wide gap-1">
                              <Sparkles className="h-2.5 w-2.5" />
                              Most Popular
                            </Badge>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 line-clamp-1">
                          {plan.description}
                        </span>
                      </div>
                    </td>

                    {/* Monthly Price */}
                    <td className="py-3.5 px-3 text-right font-bold text-white">
                      {formatINR(plan.monthlyPrice)}
                    </td>

                    {/* Yearly Price */}
                    <td className="py-3.5 px-3 text-right font-semibold text-slate-300">
                      {formatINR(plan.yearlyPrice)}
                    </td>

                    {/* Active Subscribers */}
                    <td className="py-3.5 px-3 text-right font-bold text-indigo-400">
                      {plan.activeSubscribers}
                    </td>

                    {/* Revenue This Month */}
                    <td className="py-3.5 px-3 text-right font-bold text-emerald-400">
                      {formatINR(plan.revenueThisMonth)}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          checked={plan.isActive}
                          onCheckedChange={(checked) => handleTogglePlanStatus(plan, checked)}
                        />
                        <span
                          className={`text-[10px] font-bold uppercase ${
                            plan.isActive ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        >
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditModal(plan)}
                          className="h-7 px-2 text-[11px] font-medium text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicatePlan(plan)}
                          className="h-7 px-2 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 cursor-pointer"
                        >
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Duplicate
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setArchivingPlan(plan);
                            setIsArchiveModalOpen(true);
                          }}
                          className="h-7 px-2 text-[11px] font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Archive
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Section 2: Promo Codes Section */}
      <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="h-5 w-5 text-amber-400" />
              Promo Codes & Discount Campaigns
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-0.5">
              Create coupon codes for promotional seller signups and seasonal discount offers.
            </CardDescription>
          </div>

          <Button
            size="sm"
            onClick={() => setIsPromoModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Promo Code
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-3">Promo Code</th>
                <th className="py-3 px-3 text-right">Discount</th>
                <th className="py-3 px-3 text-center">Uses (Claimed / Max)</th>
                <th className="py-3 px-3">Expiry Date</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {promoCodes.map((pc) => (
                <tr key={pc.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Code */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md text-xs tracking-wider">
                        {pc.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(pc.code);
                          toast(`Copied ${pc.code} to clipboard!`, 'success');
                        }}
                        className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                        title="Copy code"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Discount */}
                  <td className="py-3.5 px-3 text-right font-bold text-white">
                    {pc.discountType === 'percentage' ? (
                      <span className="text-emerald-400">{pc.discountValue}% OFF</span>
                    ) : (
                      <span className="text-emerald-400">₹{pc.discountValue} OFF</span>
                    )}
                  </td>

                  {/* Uses */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold text-slate-200">
                        {pc.currentUses} / {pc.maxUses}
                      </span>
                      <div className="w-24 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{
                            width: `${Math.min((pc.currentUses / pc.maxUses) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Expiry Date */}
                  <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">
                    {pc.expiryDate}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        checked={pc.isActive}
                        onCheckedChange={(checked) => handleTogglePromoStatus(pc.id, checked)}
                      />
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          pc.isActive ? 'text-emerald-400' : 'text-slate-500'
                        }`}
                      >
                        {pc.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Plan Dialog */}
      <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-amber-400" />
              {editingPlan ? `Edit Plan: ${editingPlan.name}` : 'Create New Subscription Plan'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Define pricing rules, color tag, and feature allocations for this plan tier.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 text-xs py-2">
            {/* Plan Name & Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-400">Plan Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pro Seller Plan"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Badge Color Selector (6 Preset Colors) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-400">Badge Color</label>
                <div className="flex items-center gap-2 pt-1">
                  {PRESET_BADGE_COLORS.map((col) => (
                    <button
                      key={col.key}
                      type="button"
                      onClick={() => setBadgeColor(col.key)}
                      className={`h-7 w-7 rounded-full transition-all cursor-pointer flex items-center justify-center ${col.bgClass} ${col.borderClass} border-2 ${
                        badgeColor === col.key ? 'ring-2 ring-amber-400 scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                      title={col.name}
                    >
                      {badgeColor === col.key && <Check className={`h-3.5 w-3.5 ${col.textClass}`} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400">Description</label>
              <textarea
                rows={2}
                placeholder="Brief plan summary visible on pricing cards..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {/* Pricing Controls */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Pricing Settings
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-400">Monthly Price (₹)</label>
                  <input
                    type="number"
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-slate-400">Yearly Price (₹)</label>
                    <button
                      type="button"
                      onClick={handleAutoSuggestYearly}
                      className="text-[10px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <Wand2 className="h-3 w-3" /> Auto 10×
                    </button>
                  </div>
                  <input
                    type="number"
                    value={yearlyPrice}
                    onChange={(e) => setYearlyPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Features Config (JSON-like UI Table) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Plan Feature Allocations
              </span>
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                      <th className="p-3">Feature Name</th>
                      <th className="p-3 text-right">Value / Permission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    <tr>
                      <td className="p-3 font-semibold">Listings Limit (-1 for Unlimited)</td>
                      <td className="p-3 text-right">
                        <input
                          type="number"
                          value={features.listingsLimit}
                          onChange={(e) =>
                            setFeatures((f) => ({ ...f, listingsLimit: Number(e.target.value) }))
                          }
                          className="w-24 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-right text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Featured Property Slots</td>
                      <td className="p-3 text-right">
                        <input
                          type="number"
                          value={features.featuredListings}
                          onChange={(e) =>
                            setFeatures((f) => ({ ...f, featuredListings: Number(e.target.value) }))
                          }
                          className="w-24 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-right text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Photos per Listing</td>
                      <td className="p-3 text-right">
                        <input
                          type="number"
                          value={features.photoLimit}
                          onChange={(e) =>
                            setFeatures((f) => ({ ...f, photoLimit: Number(e.target.value) }))
                          }
                          className="w-24 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-right text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Video Upload Enabled</td>
                      <td className="p-3 text-right">
                        <Switch
                          checked={features.videoUpload}
                          onCheckedChange={(c) => setFeatures((f) => ({ ...f, videoUpload: c }))}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Analytics Dashboard Access</td>
                      <td className="p-3 text-right">
                        <Switch
                          checked={features.analyticsAccess}
                          onCheckedChange={(c) => setFeatures((f) => ({ ...f, analyticsAccess: c }))}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Priority Customer Support</td>
                      <td className="p-3 text-right">
                        <Switch
                          checked={features.prioritySupport}
                          onCheckedChange={(c) => setFeatures((f) => ({ ...f, prioritySupport: c }))}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Verified Seller Badge</td>
                      <td className="p-3 text-right">
                        <Switch
                          checked={features.verifiedBadge}
                          onCheckedChange={(c) => setFeatures((f) => ({ ...f, verifiedBadge: c }))}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Phone Number Direct Reveal</td>
                      <td className="p-3 text-right">
                        <Switch
                          checked={features.phoneReveal}
                          onCheckedChange={(c) => setFeatures((f) => ({ ...f, phoneReveal: c }))}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">CRM Lead Management Tools</td>
                      <td className="p-3 text-right">
                        <Switch
                          checked={features.leadManagement}
                          onCheckedChange={(c) => setFeatures((f) => ({ ...f, leadManagement: c }))}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Is Popular Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <div>
                  <span className="font-bold text-amber-300 block">Mark as "Most Popular" Plan</span>
                  <span className="text-[10px] text-amber-200/80 block">
                    Displays highlighted border and ribbon banner on pricing page.
                  </span>
                </div>
              </div>
              <Switch checked={isPopular} onCheckedChange={setIsPopular} />
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlanModalOpen(false)}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSavePlan}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Save Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Plan Deactivation Warning Dialog */}
      <Dialog open={isDeactivateModalOpen} onOpenChange={setIsDeactivateModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Deactivate Plan Warning
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 mt-1">
              Please review the subscriber impact before deactivating this plan tier.
            </DialogDescription>
          </DialogHeader>

          {deactivatingPlan && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-2">
              <span className="font-bold block text-amber-300 text-sm">
                {deactivatingPlan.activeSubscribers} sellers are currently on this plan.
              </span>
              <p className="leading-relaxed">
                Deactivating will prevent new subscriptions but won&apos;t affect existing subscribers. They will remain on this plan until renewal or cancellation.
              </p>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:justify-end mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeactivateModalOpen(false)}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmDeactivation}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Confirm Deactivation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Plan Archive Confirmation Dialog */}
      <Dialog open={isArchiveModalOpen} onOpenChange={setIsArchiveModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-rose-400" />
              Archive Subscription Plan
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 mt-1">
              Are you sure you want to archive this subscription plan?
            </DialogDescription>
          </DialogHeader>

          {archivingPlan && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Plan Name:</span>
                <span className="font-semibold text-white">{archivingPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Subscribers:</span>
                <span className="font-semibold text-amber-400">{archivingPlan.activeSubscribers}</span>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:justify-end mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsArchiveModalOpen(false)}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmArchive}
              className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs cursor-pointer"
            >
              Archive Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Promo Code Dialog */}
      <Dialog open={isPromoModalOpen} onOpenChange={setIsPromoModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Tag className="h-5 w-5 text-indigo-400" />
              Create Promo Coupon Code
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Set discount rules, max redemption cap, and expiration date.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-xs py-2">
            {/* Promo Code Input with Auto-Suggest */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase text-slate-400">Coupon Code</label>
                <button
                  type="button"
                  onClick={handleGenerateRandomPromo}
                  className="text-[10px] font-bold text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Wand2 className="h-3 w-3" /> Auto-Suggest Code
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. FESTIVE50"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono font-bold text-sm tracking-wider uppercase focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Discount Type Radio */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400">Discount Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPromoDiscountType('percentage')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    promoDiscountType === 'percentage'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Percent className="h-4 w-4" /> Percentage (% OFF)
                </button>
                <button
                  type="button"
                  onClick={() => setPromoDiscountType('fixed')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    promoDiscountType === 'fixed'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <IndianRupee className="h-4 w-4" /> Fixed (₹ OFF)
                </button>
              </div>
            </div>

            {/* Discount Value */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400">
                Discount Value ({promoDiscountType === 'percentage' ? '%' : '₹'})
              </label>
              <input
                type="number"
                value={promoValue}
                onChange={(e) => setPromoValue(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Max Uses & Expiry */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-400">Max Redemption Cap</label>
                <input
                  type="number"
                  value={promoMaxUses}
                  onChange={(e) => setPromoMaxUses(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-400">Expiry Date</label>
                <input
                  type="date"
                  value={promoExpiry}
                  onChange={(e) => setPromoExpiry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPromoModalOpen(false)}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSavePromoCode}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
            >
              Save Promo Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
