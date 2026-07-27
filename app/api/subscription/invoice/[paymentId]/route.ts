import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { Document, Page, Text, View, StyleSheet, renderToStream } from '@react-pdf/renderer';
import { subscriptionPlans } from '@/lib/data/plans';
import { sellerProfile } from '@/lib/mock-data/seller';

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: '#1e40af',
    paddingBottom: 16,
    marginBottom: 20,
  },
  brandName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  brandTagline: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'right',
  },
  invoiceSubtitle: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'right',
    marginTop: 2,
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metaCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  boldText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subText: {
    fontSize: 9,
    color: '#475569',
    marginTop: 2,
  },
  table: {
    marginTop: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e40af',
    padding: 8,
  },
  thText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    padding: 8,
  },
  colDesc: { width: '45%' },
  colCycle: { width: '20%', textAlign: 'center' },
  colRate: { width: '15%', textAlign: 'right' },
  colTotal: { width: '20%', textAlign: 'right' },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  summaryBox: {
    width: '45%',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 9,
    color: '#64748b',
  },
  summaryVal: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    marginVertical: 4,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  grandTotalVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  paymentInfoBox: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 4,
    padding: 10,
    marginBottom: 24,
  },
  paymentInfoText: {
    fontSize: 9,
    color: '#166534',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 36,
    right: 36,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
  },
});

interface InvoicePDFProps {
  paymentId: string;
  planName: string;
  billingCycle: string;
  totalAmount: number;
  dateStr: string;
}

function InvoicePDF({
  paymentId,
  planName,
  billingCycle,
  totalAmount,
  dateStr,
}: InvoicePDFProps) {
  const shortPaymentId = paymentId.slice(-8).toUpperCase();
  const invoiceNum = `INV-${shortPaymentId}`;

  // GST 18% calculation
  const baseAmount = Math.round((totalAmount / 1.18) * 100) / 100;
  const gstTotal = Math.round((totalAmount - baseAmount) * 100) / 100;
  const cgst = Math.round((gstTotal / 2) * 100) / 100;
  const sgst = Math.round((gstTotal - cgst) * 100) / 100;

  return React.createElement(
    Document,
    { title: `Invoice-${invoiceNum}` },
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.brandName }, 'EstateHub'),
          React.createElement(Text, { style: styles.brandTagline }, 'Premium Seller Subscription Services')
        ),
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.invoiceTitle }, 'TAX INVOICE'),
          React.createElement(Text, { style: styles.invoiceSubtitle }, invoiceNum),
          React.createElement(Text, { style: styles.invoiceSubtitle }, `Date: ${dateStr}`)
        )
      ),
      // Meta Grid
      React.createElement(
        View,
        { style: styles.metaGrid },
        React.createElement(
          View,
          { style: styles.metaCard },
          React.createElement(Text, { style: styles.cardTitle }, 'Billed To (Seller):'),
          React.createElement(Text, { style: styles.boldText }, sellerProfile.name),
          React.createElement(Text, { style: styles.subText }, sellerProfile.email),
          React.createElement(Text, { style: styles.subText }, sellerProfile.phone)
        ),
        React.createElement(
          View,
          { style: styles.metaCard },
          React.createElement(Text, { style: styles.cardTitle }, 'Issued By:'),
          React.createElement(Text, { style: styles.boldText }, 'EstateHub Technologies Pvt Ltd'),
          React.createElement(Text, { style: styles.subText }, 'GSTIN: 07AAAAA0000A1Z5'),
          React.createElement(Text, { style: styles.subText }, 'Support: support@estatehub.com')
        )
      ),
      // Table
      React.createElement(
        View,
        { style: styles.table },
        React.createElement(
          View,
          { style: styles.tableHeader },
          React.createElement(Text, { style: [styles.thText, styles.colDesc] }, 'Description'),
          React.createElement(Text, { style: [styles.thText, styles.colCycle] }, 'Billing Cycle'),
          React.createElement(Text, { style: [styles.thText, styles.colRate] }, 'Base Amount'),
          React.createElement(Text, { style: [styles.thText, styles.colTotal] }, 'Total (incl. GST)')
        ),
        React.createElement(
          View,
          { style: styles.tableRow },
          React.createElement(Text, { style: styles.colDesc }, `${planName} Seller Plan Subscription`),
          React.createElement(
            Text,
            { style: styles.colCycle },
            billingCycle === 'yearly' ? 'Yearly (365 Days)' : 'Monthly (30 Days)'
          ),
          React.createElement(Text, { style: styles.colRate }, `₹${baseAmount.toLocaleString()}`),
          React.createElement(Text, { style: styles.colTotal }, `₹${totalAmount.toLocaleString()}`)
        )
      ),
      // Summary
      React.createElement(
        View,
        { style: styles.summaryContainer },
        React.createElement(
          View,
          { style: styles.summaryBox },
          React.createElement(
            View,
            { style: styles.summaryRow },
            React.createElement(Text, { style: styles.summaryLabel }, 'Base Amount:'),
            React.createElement(Text, { style: styles.summaryVal }, `₹${baseAmount.toLocaleString()}`)
          ),
          React.createElement(
            View,
            { style: styles.summaryRow },
            React.createElement(Text, { style: styles.summaryLabel }, 'CGST (9%):'),
            React.createElement(Text, { style: styles.summaryVal }, `₹${cgst.toLocaleString()}`)
          ),
          React.createElement(
            View,
            { style: styles.summaryRow },
            React.createElement(Text, { style: styles.summaryLabel }, 'SGST (9%):'),
            React.createElement(Text, { style: styles.summaryVal }, `₹${sgst.toLocaleString()}`)
          ),
          React.createElement(View, { style: styles.divider }),
          React.createElement(
            View,
            { style: styles.grandTotalRow },
            React.createElement(Text, { style: styles.grandTotalLabel }, 'Total Paid:'),
            React.createElement(Text, { style: styles.grandTotalVal }, `₹${totalAmount.toLocaleString()}`)
          )
        )
      ),
      // Payment Info
      React.createElement(
        View,
        { style: styles.paymentInfoBox },
        React.createElement(Text, { style: styles.paymentInfoText }, `Paid via Razorpay (Payment ID: ${paymentId})`)
      ),
      // Footer
      React.createElement(
        View,
        { style: styles.footer },
        React.createElement(Text, { style: styles.footerText }, 'This is a computer generated invoice.')
      )
    )
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const resolvedParams = await params;
    const paymentId = resolvedParams?.paymentId || `PAY-${Date.now()}`;

    const url = new URL(req.url);
    const planId = url.searchParams.get('plan') || 'basic';
    const billingCycle = url.searchParams.get('cycle') || 'monthly';

    const plan = subscriptionPlans.find((p) => p.id === planId) || subscriptionPlans[1];
    let totalAmount = plan.price;
    if (billingCycle === 'yearly') {
      totalAmount = Math.round(plan.price * 0.8);
    }

    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const doc = InvoicePDF({
      paymentId,
      planName: plan.name,
      billingCycle,
      totalAmount,
      dateStr,
    });

    const stream = await renderToStream(doc);

    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=Invoice-${paymentId}.pdf`,
      },
    });
  } catch (error: any) {
    console.error('Error generating PDF invoice:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF invoice', details: error?.message },
      { status: 500 }
    );
  }
}
