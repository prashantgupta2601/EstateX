export interface Enquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  sellerName: string;
  message: string;
  status: 'pending' | 'replied' | 'closed';
  createdAt: string;
}

export const mockEnquiries: Enquiry[] = [
  {
    id: 'enq-1',
    propertyId: 'prop-1',
    propertyTitle: '3 BHK Premium Apartment in DLF Phase 5',
    propertyImage: 'https://placehold.co/800x600/1e293b/ffffff?text=Property+1',
    sellerName: 'Rajesh Kumar',
    message: 'Hi Rajesh, I am very interested in this 3 BHK apartment. I wanted to know if the price is negotiable and when we could schedule a site visit.',
    status: 'pending',
    createdAt: '2026-07-06T10:00:00Z',
  },
  {
    id: 'enq-2',
    propertyId: 'prop-3',
    propertyTitle: '2 BHK Modern Flat near Sector 62',
    propertyImage: 'https://placehold.co/800x600/0f172a/ffffff?text=Property+3',
    sellerName: 'Amit Sharma',
    message: 'Hello Amit, could you please share details about the monthly maintenance charges and availability of power backup?',
    status: 'replied',
    createdAt: '2026-07-05T12:30:00Z',
  },
  {
    id: 'enq-3',
    propertyId: 'prop-4',
    propertyTitle: 'Spacious Office Space in Hitech City',
    propertyImage: 'https://placehold.co/800x600/334155/ffffff?text=Property+4',
    sellerName: 'Srinivas Rao',
    message: 'Hi Srinivas, is this commercial office space available for immediate move-in? We require at least 15 parking spots for our team.',
    status: 'replied',
    createdAt: '2026-07-02T16:15:00Z',
  },
  {
    id: 'enq-4',
    propertyId: 'prop-5',
    propertyTitle: 'Residential Plot in Devanahalli',
    propertyImage: 'https://placehold.co/800x600/475569/ffffff?text=Property+5',
    sellerName: 'Karan Johar',
    message: 'Dear Karan, is the clear title documentation available for verification? I would like to schedule a call to discuss the registry procedure.',
    status: 'closed',
    createdAt: '2026-06-28T09:00:00Z',
  },
  {
    id: 'enq-5',
    propertyId: 'prop-6',
    propertyTitle: '3 BHK Luxury Apartment in Whitefield',
    propertyImage: 'https://placehold.co/800x600/64748b/ffffff?text=Property+6',
    sellerName: 'Nisha Patel',
    message: 'Hi Nisha, does this flat face the swimming pool? Also, is there an option for semi-furnishing before handover? Let me know.',
    status: 'pending',
    createdAt: '2026-07-06T14:45:00Z',
  },
  {
    id: 'enq-6',
    propertyId: 'prop-7',
    propertyTitle: '2 BHK Apartment for Rent in Gachibowli',
    propertyImage: 'https://placehold.co/800x600/1e293b/ffffff?text=Property+7',
    sellerName: 'Vikram Malhotra',
    message: 'Hi Vikram, what is the security deposit for this apartment? Also, is parking included in the rent or charged separately?',
    status: 'closed',
    createdAt: '2026-06-25T11:00:00Z',
  },
];
