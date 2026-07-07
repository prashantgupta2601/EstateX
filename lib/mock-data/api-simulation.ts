import { mockProperties } from './properties';
import { mockSavedSearches, SavedSearch } from './saved-searches';
import { mockEnquiries, Enquiry } from './enquiries';
import { mockPriceAlerts, PriceAlert } from './price-alerts';
import { Property } from '@/types/property';

export type { SavedSearch };
export type { Enquiry };
export type { PriceAlert };
export type { Property };

const DELAY = 800;

const delay = <T>(value: T): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY));
};

export async function getProperties(): Promise<Property[]> {
  return delay(mockProperties);
}

export async function getPropertyById(id: string): Promise<Property | undefined> {
  const property = mockProperties.find((p) => p.id === id);
  return delay(property);
}

export async function getSavedSearches(): Promise<SavedSearch[]> {
  return delay(mockSavedSearches);
}

export async function getEnquiries(): Promise<Enquiry[]> {
  return delay(mockEnquiries);
}

export async function getPriceAlerts(): Promise<PriceAlert[]> {
  return delay(mockPriceAlerts);
}
