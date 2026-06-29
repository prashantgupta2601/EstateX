export interface EMICalculationResult {
  emi: number;
  totalInterest: number;
  totalAmount: number;
}

/**
 * Calculates the Equated Monthly Installment (EMI), total interest, and total amount payable.
 * Formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1)
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureYears: number
): EMICalculationResult {
  if (tenureYears <= 0) {
    return { emi: 0, totalInterest: 0, totalAmount: 0 };
  }

  const monthlyRate = annualRate / 12 / 100;
  const numberOfMonths = tenureYears * 12;

  if (monthlyRate === 0) {
    const emi = principal / numberOfMonths;
    const totalAmount = principal;
    const totalInterest = 0;
    return { emi: Math.round(emi), totalInterest, totalAmount };
  }

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) /
    (Math.pow(1 + monthlyRate, numberOfMonths) - 1);

  const totalAmount = emi * numberOfMonths;
  const totalInterest = totalAmount - principal;

  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalAmount: Math.round(totalAmount),
  };
}

/**
 * Formats a number to standard Indian Rupees (e.g. ₹5,00,000)
 */
export function formatIndianCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats a number to short Indian Rupees with Lac/Cr labels (e.g. ₹5.00 Lac, ₹2.50 Cr)
 */
export function formatIndianCurrencyShort(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} Lac`;
  } else {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}
