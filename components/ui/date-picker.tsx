'use client';

import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DatePickerProps {
  value: string | null; // Format: YYYY-MM-DD
  onChange: (date: string | null) => void;
  placeholder?: string;
}

export default function DatePicker({ value, onChange, placeholder = 'Pick a date' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse the initial value or default to current date
  const parsedDate = useMemo(() => {
    if (!value) return null;
    const parts = value.split('-');
    if (parts.length !== 3) return null;
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }, [value]);

  // Current year/month shown in the calendar view
  const [viewYear, setViewYear] = useState(() => parsedDate?.getFullYear() || new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => parsedDate?.getMonth() || new Date().getMonth());
  const [prevValue, setPrevValue] = useState<string | null>(null);

  // Keep view in sync when value changes externally during render
  if (value !== prevValue) {
    setPrevValue(value);
    if (parsedDate) {
      setViewYear(parsedDate.getFullYear());
      setViewMonth(parsedDate.getMonth());
    }
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Calculate days to display in the grid
  const daysGrid = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    // Day of week for 1st day of the month (0 = Sun, 1 = Mon...)
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();

    const grid = [];

    // 1. Previous month's trailing days
    const prevMonthDaysCount = new Date(viewYear, viewMonth, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      grid.push({
        day: prevMonthDaysCount - i,
        monthOffset: -1,
        date: new Date(viewYear, viewMonth - 1, prevMonthDaysCount - i),
      });
    }

    // 2. Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      grid.push({
        day: i,
        monthOffset: 0,
        date: new Date(viewYear, viewMonth, i),
      });
    }

    // 3. Next month's leading days (pad to fill rows of 7, up to 42 total items)
    const remainingSlots = 42 - grid.length;
    for (let i = 1; i <= remainingSlots; i++) {
      grid.push({
        day: i,
        monthOffset: 1,
        date: new Date(viewYear, viewMonth + 1, i),
      });
    }

    return grid;
  }, [viewYear, viewMonth]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  // Format date for button label
  const formattedLabel = useMemo(() => {
    if (!parsedDate) return placeholder;
    return parsedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, [parsedDate, placeholder]);

  return (
    <div className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-full items-center justify-between rounded-2xl border border-border/80 bg-background px-3.5 py-2 text-sm text-foreground hover:border-primary/50 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className={parsedDate ? 'text-foreground font-semibold' : 'text-muted-foreground'}>
            {formattedLabel}
          </span>
        </div>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Clear date"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </button>

      {/* Popover Calendar Dropdown */}
      {isOpen && (
        <>
          {/* Overlay to handle click outside */}
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-full left-0 mt-2 z-50 p-4 w-[280px] bg-card border border-border shadow-2xl rounded-2xl animate-in zoom-in-95 duration-200">
            {/* Header controls */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg border border-border hover:bg-muted text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-bold text-foreground">
                {monthNames[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg border border-border hover:bg-muted text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-muted-foreground/60 mb-2">
              {weekDays.map((d) => (
                <div key={d} className="h-7 flex items-center justify-center">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {daysGrid.map(({ day, monthOffset, date }, index) => {
                const isSelected =
                  parsedDate &&
                  date.getFullYear() === parsedDate.getFullYear() &&
                  date.getMonth() === parsedDate.getMonth() &&
                  date.getDate() === parsedDate.getDate();

                const isToday =
                  new Date().getFullYear() === date.getFullYear() &&
                  new Date().getMonth() === date.getMonth() &&
                  new Date().getDate() === date.getDate();

                const isCurrentMonth = monthOffset === 0;

                return (
                  <button
                    key={`${monthOffset}-${day}-${index}`}
                    type="button"
                    onClick={() => handleSelectDay(date)}
                    className={`h-7 w-7 rounded-lg flex items-center justify-center font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-primary-foreground font-extrabold shadow-sm scale-105'
                        : isToday
                        ? 'border border-primary text-primary hover:bg-primary/10'
                        : isCurrentMonth
                        ? 'text-foreground hover:bg-muted hover:text-foreground'
                        : 'text-muted-foreground/30 hover:bg-muted/40'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
