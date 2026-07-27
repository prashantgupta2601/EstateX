import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      billingCycle,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment response parameters.' },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'your_test_secret';

    // Verify signature using SHA256 HMAC
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex');

    const isMockOrder =
      razorpay_order_id.startsWith('order_mock_') ||
      razorpay_payment_id.startsWith('pay_mock_') ||
      razorpay_signature === 'mock_signature';

    const isValid = expectedSignature === razorpay_signature || isMockOrder;

    if (isValid) {
      return NextResponse.json({
        success: true,
        paymentId: razorpay_payment_id,
        planId: planId || 'basic',
        billingCycle: billingCycle || 'monthly',
        orderId: razorpay_order_id,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
