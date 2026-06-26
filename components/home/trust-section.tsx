'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ShieldCheck, Users2, Sparkles, CalendarRange, HeartHandshake } from 'lucide-react';

interface StatCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
}

function StatCounter({ target, duration = 1200, suffix = '+' }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(containerRef.current);
      }
    };
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const startTimestamp = performance.now();
    
    const animate = (now: number) => {
      const elapsed = now - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic function
      const easeProgress = progress * (2 - progress);
      const currentCount = Math.floor(easeProgress * target);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [started, target, duration]);

  return (
    <div ref={containerRef} className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
      {count.toLocaleString('en-IN')}{suffix}
    </div>
  );
}

export default function TrustSection() {
  const highlights = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: 'Verified Listings',
      description: 'Every property is fully vetted and validated by our inspection team to prevent fraud.',
    },
    {
      icon: <Users2 className="h-6 w-6 text-primary" />,
      title: 'Direct Owner Connect',
      description: 'Interact directly with verified property owners and developers without hidden broker commissions.',
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: 'AI Matches & Comparisons',
      description: 'Utilize smart metrics and Side-by-Side comparisons to choose your ideal property.',
    },
    {
      icon: <CalendarRange className="h-6 w-6 text-primary" />,
      title: 'Hassle-free Site Visits',
      description: 'Book instant physical or virtual site tours with dedicated local advisors.',
    },
  ];

  const stats = [
    { target: 50000, label: 'Properties Listed', suffix: '+' },
    { target: 12000, label: 'Happy Customers', suffix: '+' },
    { target: 500, label: 'Cities Covered', suffix: '+' },
    { target: 250, label: 'Partner Developers', suffix: '+' },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-primary mb-3">
            <HeartHandshake className="h-3.5 w-3.5" /> Building Trust
          </span>
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Why Choose EstateX?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We are redefining real estate transactions with complete transparency, verified lists, and next-generation comparison tools.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-start p-6 bg-card rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-300"
            >
              <div className="p-3 rounded-xl bg-primary/10 mb-5">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Animated Stats Bar */}
        <div className="bg-muted/40 border border-border/30 rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <StatCounter target={stat.target} suffix={stat.suffix} />
                <span className="text-sm font-semibold text-muted-foreground mt-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
