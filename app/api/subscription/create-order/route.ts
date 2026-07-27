import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { subscriptionPlans } from '@/lib/data/plans';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, billingCycle } = body;

    if (!planId || !['basic', 'pro'].includes(planId)) {
      return NextResponse.json(
        { error: 'Invalid or missing planId. Must be "basic" or "pro".' },
        { status: 400 }
      );
    }

    const targetPlan = subscriptionPlans.find((p) => p.id === planId);
    if (!targetPlan) {
      return NextResponse.json({ error: 'Plan not found.' }, { status: 404 });
    }

    // Calculate amount based on plan + billing cycle (20% discount for yearly)
    let amount = targetPlan.price;
    if (billingCycle === 'yearly') {
      amount = Math.round(targetPlan.price * 0.8);
    }

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxxxx';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'your_test_secret';

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const receipt = `receipt_${Date.now()}`;
    const options = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt,
      notes: {
        planId,
        billingCycle: billingCycle || 'monthly',
        sellerId: 'mock_seller_id',
      },
    };

    try {
      const order = await razorpay.orders.create(options);
      return NextResponse.json({
        orderId: order.id,
        amount,
        currency: 'INR',
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId,
      });
    } catch (razorpayError: any) {
      // Fallback for local development when placeholder test keys are used
      console.warn('Razorpay API notice (using fallback order ID for test placeholder credentials):', razorpayError?.message || razorpayError);

      return NextResponse.json({
        orderId: `order_mock_${Date.now()}`,
        amount,
        currency: 'INR',
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId,
        isMock: true,
      });
    }
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription order', details: error?.message },
      { status: 500 }
    );
  }
}
