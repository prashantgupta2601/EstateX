'use client';

import React, { useState, useMemo } from 'react';
import {
  calculateEMI,
  formatIndianCurrency,
  formatIndianCurrencyShort,
} from '@/lib/utils/emi-calculator';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Wallet, Percent, Calendar, IndianRupee } from 'lucide-react';

export default function EMICalculator() {
  // Range limits
  const MIN_AMOUNT = 100000; // 1 Lac
  const MAX_AMOUNT = 50000000; // 5 Cr
  const MIN_RATE = 5;
  const MAX_RATE = 15;
  const MIN_TENURE = 1;
  const MAX_TENURE = 30;

  // Synced States
  const [amount, setAmount] = useState<number>(5000000); // Default 50 Lac
  const [rate, setRate] = useState<number>(8.5); // Default 8.5%
  const [tenure, setTenure] = useState<number>(20); // Default 20 Years

  // Input string states for smooth user typing experience
  const [amountInput, setAmountInput] = useState<string>('5000000');
  const [rateInput, setRateInput] = useState<string>('8.5');
  const [tenureInput, setTenureInput] = useState<string>('20');

  // Compute EMI, Interest, and Total Payable
  const results = useMemo(() => {
    return calculateEMI(amount, rate, tenure);
  }, [amount, rate, tenure]);

  // Data for Recharts Pie Chart
  const chartData = useMemo(() => {
    return [
      { name: 'Principal Amount', value: amount, color: 'hsl(var(--primary))' },
      { name: 'Total Interest', value: results.totalInterest, color: 'hsl(var(--secondary))' },
    ];
  }, [amount, results.totalInterest]);

  // Handler for Amount Input Change
  const handleAmountChange = (val: number) => {
    const clamped = Math.max(MIN_AMOUNT, Math.min(MAX_AMOUNT, val));
    setAmount(clamped);
    setAmountInput(clamped.toString());
  };

  const handleAmountInputChange = (valStr: string) => {
    setAmountInput(valStr);
    const parsed = parseInt(valStr.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed)) {
      // Allow user to exceed or go under temporarily while typing, but clamp value on state
      const clamped = Math.max(MIN_AMOUNT, Math.min(MAX_AMOUNT, parsed));
      setAmount(clamped);
    }
  };

  const handleAmountBlur = () => {
    const parsed = parseInt(amountInput.replace(/[^0-9]/g, ''), 10);
    if (isNaN(parsed) || parsed < MIN_AMOUNT) {
      handleAmountChange(MIN_AMOUNT);
    } else if (parsed > MAX_AMOUNT) {
      handleAmountChange(MAX_AMOUNT);
    } else {
      handleAmountChange(parsed);
    }
  };

  // Handler for Rate Input Change
  const handleRateChange = (val: number) => {
    const clamped = Math.max(MIN_RATE, Math.min(MAX_RATE, val));
    setRate(parseFloat(clamped.toFixed(2)));
    setRateInput(clamped.toFixed(1));
  };

  const handleRateInputChange = (valStr: string) => {
    setRateInput(valStr);
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed)) {
      const clamped = Math.max(MIN_RATE, Math.min(MAX_RATE, parsed));
      setRate(clamped);
    }
  };

  const handleRateBlur = () => {
    const parsed = parseFloat(rateInput);
    if (isNaN(parsed) || parsed < MIN_RATE) {
      handleRateChange(MIN_RATE);
    } else if (parsed > MAX_RATE) {
      handleRateChange(MAX_RATE);
    } else {
      handleRateChange(parsed);
    }
  };

  // Handler for Tenure Input Change
  const handleTenureChange = (val: number) => {
    const clamped = Math.max(MIN_TENURE, Math.min(MAX_TENURE, val));
    setTenure(clamped);
    setTenureInput(clamped.toString());
  };

  const handleTenureInputChange = (valStr: string) => {
    setTenureInput(valStr);
    const parsed = parseInt(valStr.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(MIN_TENURE, Math.min(MAX_TENURE, parsed));
      setTenure(clamped);
    }
  };

  const handleTenureBlur = () => {
    const parsed = parseInt(tenureInput.replace(/[^0-9]/g, ''), 10);
    if (isNaN(parsed) || parsed < MIN_TENURE) {
      handleTenureChange(MIN_TENURE);
    } else if (parsed > MAX_TENURE) {
      handleTenureChange(MAX_TENURE);
    } else {
      handleTenureChange(parsed);
    }
  };

  // Custom tooltips for Recharts
  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = amount + results.totalInterest;
      const percent = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-popover border border-border p-3 rounded-xl shadow-lg text-left">
          <p className="text-sm font-bold text-popover-foreground">{data.name}</p>
          <p className="text-sm font-semibold text-primary mt-1">
            {formatIndianCurrency(data.value)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{percent}% of Total Payable</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full max-w-5xl mx-auto border-border/60 shadow-xl rounded-3xl overflow-hidden bg-card">
      <CardContent className="p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
          
          {/* Inputs Column */}
          <div className="md:col-span-6 flex flex-col gap-8 text-left">
            <div>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                <IndianRupee className="h-6 w-6 text-primary" /> Loan Parameters
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Adjust sliders or input values directly to calculate your monthly EMI.
              </p>
            </div>

            {/* Loan Amount Input Group */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary" /> Loan Amount
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    {formatIndianCurrencyShort(amount)}
                  </span>
                  <div className="relative max-w-[130px]">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">₹</span>
                    <Input
                      type="text"
                      value={amountInput}
                      onChange={(e) => handleAmountInputChange(e.target.value)}
                      onBlur={handleAmountBlur}
                      className="h-9 w-full pl-6 pr-2 rounded-lg text-right font-bold text-sm bg-background/50 focus-visible:bg-background border-border"
                    />
                  </div>
                </div>
              </div>
              <Slider
                value={amount}
                min={MIN_AMOUNT}
                max={MAX_AMOUNT}
                step={50000}
                onValueChange={(val) => handleAmountChange(val as number)}
              />
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground/70">
                <span>₹1 Lac</span>
                <span>₹5 Cr</span>
              </div>
            </div>

            {/* Interest Rate Input Group */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                  <Percent className="h-4 w-4 text-primary" /> Interest Rate (p.a.)
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative max-w-[90px]">
                    <Input
                      type="number"
                      step="0.1"
                      value={rateInput}
                      onChange={(e) => handleRateInputChange(e.target.value)}
                      onBlur={handleRateBlur}
                      className="h-9 w-full pr-6 pl-2.5 rounded-lg text-right font-bold text-sm bg-background/50 focus-visible:bg-background border-border"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">%</span>
                  </div>
                </div>
              </div>
              <Slider
                value={rate}
                min={MIN_RATE}
                max={MAX_RATE}
                step={0.1}
                onValueChange={(val) => handleRateChange(val as number)}
              />
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground/70">
                <span>5%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Tenure Input Group */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" /> Loan Tenure
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative max-w-[100px]">
                    <Input
                      type="number"
                      value={tenureInput}
                      onChange={(e) => handleTenureInputChange(e.target.value)}
                      onBlur={handleTenureBlur}
                      className="h-9 w-full pr-10 pl-2.5 rounded-lg text-right font-bold text-sm bg-background/50 focus-visible:bg-background border-border"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">Yrs</span>
                  </div>
                </div>
              </div>
              <Slider
                value={tenure}
                min={MIN_TENURE}
                max={MAX_TENURE}
                step={1}
                onValueChange={(val) => handleTenureChange(val as number)}
              />
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground/70">
                <span>1 Year</span>
                <span>30 Years</span>
              </div>
            </div>
          </div>

          {/* Divider for desktop */}
          <div className="hidden md:block col-span-1 justify-self-center w-px bg-border/60 h-full" />

          {/* Results + Chart Column */}
          <div className="md:col-span-5 flex flex-col justify-between gap-8 text-left">
            <div>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                Breakdown Summary
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Estimations of monthly installments and total payout ratios.
              </p>
            </div>

            {/* Stats display */}
            <div className="flex flex-col gap-4">
              {/* Monthly EMI Card */}
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4.5 flex flex-col justify-center">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Monthly EMI Payable
                </span>
                <span className="text-2xl md:text-3xl font-extrabold text-primary mt-1">
                  {formatIndianCurrency(results.emi)}
                </span>
              </div>

              {/* Grid for Total Interest and Total Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted/40 border border-border/40 rounded-xl p-4 flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    Total Interest
                  </span>
                  <span className="text-lg font-bold text-foreground mt-1">
                    {formatIndianCurrency(results.totalInterest)}
                  </span>
                </div>
                <div className="bg-muted/40 border border-border/40 rounded-xl p-4 flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    Total Amount
                  </span>
                  <span className="text-lg font-bold text-foreground mt-1">
                    {formatIndianCurrency(results.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Pie Chart Display */}
            <div className="h-[180px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={renderCustomTooltip} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span className="text-xs font-semibold text-muted-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Ratio Label */}
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Interest Ratio
                </span>
                <span className="text-base font-extrabold text-foreground mt-0.5">
                  {((results.totalInterest / results.totalAmount) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
