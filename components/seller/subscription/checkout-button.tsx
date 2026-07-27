'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { SubscriptionPlan } from '@/lib/data/plans';
import { sellerProfile } from '@/lib/mock-data/seller';
import { Zap, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

interface CheckoutButtonProps {
  plan: SubscriptionPlan;
  billingCycle: 'monthly' | 'yearly';
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  children?: React.ReactNode;
}

export function CheckoutButton({
  plan,
  billingCycle,
  className = '',
  disabled = false,
  variant = 'default',
  children,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      // 1. Call backend API to create order
      const orderRes = await fetch('/api/subscription/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          billingCycle,
        }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create order');
      }

      const orderData = await orderRes.json();
      const { orderId, amount, currency, keyId, isMock } = orderData;

      // Helper function to call verify payment endpoint
      const verifyAndRedirect = async (paymentId: string, orderId: string, signature: string) => {
        try {
          const verifyRes = await fetch('/api/subscription/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: orderId,
              razorpay_payment_id: paymentId,
              razorpay_signature: signature,
              planId: plan.id,
              billingCycle,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            try {
              localStorage.setItem('estatex_current_plan', plan.id);
            } catch (e) {
              console.error('Error updating local plan', e);
            }
            toast(`Payment verified! Welcome to ${plan.name} Plan.`, 'success');
            router.push(`/seller/subscription/success?paymentId=${verifyData.paymentId || paymentId}&plan=${plan.id}`);
          } else {
            toast('Payment verification failed', 'error');
            router.push('/seller/subscription/failed');
          }
        } catch (err) {
          console.error('Payment verification error:', err);
          router.push('/seller/subscription/failed');
        }
      };

      // 2. Handle mock order fallback for placeholder keys in local test environments
      if (isMock) {
        toast('Demo Mode: Processing mock Razorpay order...', 'success');
        setTimeout(() => {
          verifyAndRedirect(`pay_mock_${Date.now()}`, orderId, 'mock_signature');
        }, 1000);
        return;
      }

      // 3. Load Razorpay script dynamically
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast('Failed to load Razorpay SDK. Please check your network connection.', 'error');
        setIsLoading(false);
        return;
      }

      // 4. Open Razorpay checkout modal
      const options = {
        key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, // paise
        currency: currency || 'INR',
        name: 'EstateHub',
        description: `${plan.name} Plan - ${billingCycle}`,
        order_id: orderId,
        prefill: {
          name: sellerProfile.name,
          email: sellerProfile.email,
          contact: sellerProfile.phone,
        },
        theme: { color: '#1E40AF' },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          await verifyAndRedirect(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            toast('Payment session cancelled.', 'error');
            router.push('/seller/subscription/failed');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setIsLoading(false);
        toast(response.error?.description || 'Payment failed.', 'error');
        router.push('/seller/subscription/failed');
      });
      rzp.open();
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast(error?.message || 'Something went wrong initiating checkout.', 'error');
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={disabled || isLoading}
      variant={variant}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Initiating...</span>
        </>
      ) : children ? (
        children
      ) : (
        <>
          <Zap className="h-4 w-4 fill-current mr-2" />
          <span>Upgrade to {plan.name}</span>
        </>
      )}
    </Button>
  );
}
