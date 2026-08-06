export type ReportType = 'listing' | 'user' | 'review';
export type ReportReason = 'spam' | 'fraud' | 'inappropriate' | 'duplicate' | 'wrong_info' | 'other';
export type ReportStatus = 'open' | 'reviewing' | 'resolved' | 'dismissed';

export interface ReportedItemDetails {
  image?: string;
  price?: string;
  location?: string;
  ownerName?: string;
  ownerEmail?: string;
  snippet?: string;
  rating?: number;
}

export interface Report {
  id: string;
  reportedItemType: ReportType;
  reportedItemId: string;
  reportedItemTitle: string;
  reporterName: string;
  reporterEmail: string;
  reason: ReportReason;
  description: string;
  reportedAt: string; // relative string
  status: ReportStatus;
  resolvedBy?: string;
  resolvedAt?: string;
  actionTaken?: string;
  reporterHistoryCount: number;
  previousReportsCount: number;
  dismissalReason?: string;
  itemDetails?: ReportedItemDetails;
}

export const mockReports: Report[] = [
  {
    id: 'REP-4001',
    reportedItemType: 'listing',
    reportedItemId: 'PROP-902',
    reportedItemTitle: '3 BHK Luxury Apartment in DLF Phase 5 (Fake Listing)',
    reporterName: 'Sunil Mehta',
    reporterEmail: 'sunil.mehta@gmail.com',
    reason: 'fraud',
    description: 'The seller asked for a 50,000 INR token advance via GPay before showing the property. Checked with DLF society office and no such flat owner exists.',
    reportedAt: '15 mins ago',
    status: 'open',
    reporterHistoryCount: 2,
    previousReportsCount: 3,
    itemDetails: {
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      price: '₹2.85 Cr',
      location: 'Golf Course Road, Gurugram',
      ownerName: 'FakeBroker_99',
      ownerEmail: 'fakebroker99@tempmail.com',
      snippet: 'Spacious 3 BHK luxury apartment with modern amenities and scenic views.',
    },
  },
  {
    id: 'REP-4002',
    reportedItemType: 'user',
    reportedItemId: 'USR-8821',
    reportedItemTitle: 'User Profile: RealEstateDeals_24x7',
    reporterName: 'Pooja Hegde',
    reporterEmail: 'pooja.hegde@outlook.com',
    reason: 'spam',
    description: 'This user account is posting duplicate spam listings across 10 different cities with identical images and fake phone numbers.',
    reportedAt: '45 mins ago',
    status: 'open',
    reporterHistoryCount: 5,
    previousReportsCount: 4,
    itemDetails: {
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      ownerName: 'RealEstateDeals_24x7',
      ownerEmail: 'spammer_deals@mail.com',
      snippet: 'Registered Seller Account • 18 active listings flagged for high frequency posting.',
    },
  },
  {
    id: 'REP-4003',
    reportedItemType: 'review',
    reportedItemId: 'REV-1092',
    reportedItemTitle: 'Review on Property #PROP-104 by User @Karan_M',
    reporterName: 'Vikram Malhotra',
    reporterEmail: 'vikram.malhotra@gmail.com',
    reason: 'inappropriate',
    description: 'This review contains abusive language and personal insults targeting the property owner rather than genuine property feedback.',
    reportedAt: '2 hours ago',
    status: 'reviewing',
    reporterHistoryCount: 1,
    previousReportsCount: 1,
    itemDetails: {
      rating: 1,
      ownerName: 'Karan M (Review Author)',
      snippet: '"Total scam owner! Do not buy anything from this terrible fraudster!"',
    },
  },
  {
    id: 'REP-4004',
    reportedItemType: 'listing',
    reportedItemId: 'PROP-551',
    reportedItemTitle: '4 BHK Duplex Villa in Bandra West',
    reporterName: 'Rohan Deshmukh',
    reporterEmail: 'rohan.deshmukh@yahoo.com',
    reason: 'duplicate',
    description: 'Exact copy of listing #PROP-332 posted by a different agent claiming lower price without owner authorization.',
    reportedAt: '3 hours ago',
    status: 'open',
    reporterHistoryCount: 3,
    previousReportsCount: 2,
    itemDetails: {
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      price: '₹9.5 Cr',
      location: 'Bandra West, Mumbai',
      ownerName: 'Agent Express Ltd',
      snippet: '4 BHK luxury villa with private pool and rooftop garden deck.',
    },
  },
  {
    id: 'REP-4005',
    reportedItemType: 'listing',
    reportedItemId: 'PROP-220',
    reportedItemTitle: '2 BHK Flat in Indiranagar 100ft Road',
    reporterName: 'Anand Kumar',
    reporterEmail: 'anand.k@techcorp.io',
    reason: 'wrong_info',
    description: 'Listing says 1400 sq ft, but actual carpet area is only 850 sq ft according to floor plan registered on RERA.',
    reportedAt: '5 hours ago',
    status: 'open',
    reporterHistoryCount: 1,
    previousReportsCount: 0,
    itemDetails: {
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      price: '₹1.35 Cr',
      location: 'Indiranagar, Bengaluru',
      ownerName: 'Rajesh Varma',
      snippet: '2 BHK sunlit apartment near metro station with wood flooring.',
    },
  },
  {
    id: 'REP-4006',
    reportedItemType: 'user',
    reportedItemId: 'USR-3190',
    reportedItemTitle: 'User Profile: QuickLeads_Bot',
    reporterName: 'Meera Kulkarni',
    reporterEmail: 'meera.k@gmail.com',
    reason: 'spam',
    description: 'Automated account sending automated WhatsApp spam messages to buyers who view property listings.',
    reportedAt: '7 hours ago',
    status: 'reviewing',
    reporterHistoryCount: 4,
    previousReportsCount: 5,
    itemDetails: {
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      ownerName: 'QuickLeads_Bot',
      ownerEmail: 'bot@quickleads.net',
      snippet: 'Automated Account • Suspicious bulk messaging activity detected.',
    },
  },
  {
    id: 'REP-4007',
    reportedItemType: 'review',
    reportedItemId: 'REV-8812',
    reportedItemTitle: 'Review on Property #PROP-702 by User @Anonymous99',
    reporterName: 'Amit Shah',
    reporterEmail: 'amit.shah@noida.in',
    reason: 'spam',
    description: 'Review contains promotional external links to an illegal crypto investment website.',
    reportedAt: '1 day ago',
    status: 'resolved',
    resolvedBy: 'Admin (Priya)',
    resolvedAt: '18 hours ago',
    actionTaken: 'Review removed & user account suspended.',
    reporterHistoryCount: 2,
    previousReportsCount: 1,
    itemDetails: {
      rating: 5,
      ownerName: 'Anonymous99',
      snippet: '"Earn 500% returns guaranteed! Visit bit.ly/crypto-fake-deals now!"',
    },
  },
  {
    id: 'REP-4008',
    reportedItemType: 'listing',
    reportedItemId: 'PROP-991',
    reportedItemTitle: '5 BHK Penthouse in Vasant Kunj',
    reporterName: 'Deepak Chopra',
    reporterEmail: 'deepak.c@delhi.org',
    reason: 'other',
    description: 'Images uploaded are stock photos from a European architectural website with watermark removed.',
    reportedAt: '1 day ago',
    status: 'resolved',
    resolvedBy: 'Admin (Rohan)',
    resolvedAt: '12 hours ago',
    actionTaken: 'Listing hidden & seller notified to re-upload authentic photographs.',
    reporterHistoryCount: 1,
    previousReportsCount: 2,
    itemDetails: {
      image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80',
      price: '₹6.8 Cr',
      location: 'Vasant Kunj, New Delhi',
      ownerName: 'Col. R. S. Rathore',
      snippet: 'Luxury penthouse with private pool terrace.',
    },
  },
  {
    id: 'REP-4009',
    reportedItemType: 'listing',
    reportedItemId: 'PROP-112',
    reportedItemTitle: '1 BHK Studio Flat in Whitefield',
    reporterName: 'Kavita Reddy',
    reporterEmail: 'kavita.r@gmail.com',
    reason: 'spam',
    description: 'Reported because price listed is 10 INR instead of 65 Lakhs to attract clicks.',
    reportedAt: '2 days ago',
    status: 'dismissed',
    resolvedBy: 'Admin (Priya)',
    resolvedAt: '1 day ago',
    dismissalReason: 'Seller updated the price to ₹65.00 L after system notification. No malice found.',
    reporterHistoryCount: 6,
    previousReportsCount: 0,
    itemDetails: {
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      price: '₹65.00 L',
      location: 'Whitefield, Bengaluru',
      ownerName: 'TechInvest Corp',
      snippet: 'Compact studio flat designed for IT professionals.',
    },
  },
  {
    id: 'REP-4010',
    reportedItemType: 'user',
    reportedItemId: 'USR-6612',
    reportedItemTitle: 'User Profile: ScammerAgent_X',
    reporterName: 'Sanjay Dutt',
    reporterEmail: 'sanjay.dutt@mumbai.gov.in',
    reason: 'fraud',
    description: 'Imprensonating registered RERA broker using stolen RERA license number.',
    reportedAt: '2 days ago',
    status: 'resolved',
    resolvedBy: 'Admin (Rohan)',
    resolvedAt: '1 day ago',
    actionTaken: 'User account permanently banned & reported to cyber cell.',
    reporterHistoryCount: 3,
    previousReportsCount: 6,
    itemDetails: {
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      ownerName: 'ScammerAgent_X',
      ownerEmail: 'scammerx@fakeagents.com',
      snippet: 'User claimingHARERA/GGM/2024/9999 registration.',
    },
  },
  {
    id: 'REP-4011',
    reportedItemType: 'review',
    reportedItemId: 'REV-4040',
    reportedItemTitle: 'Review on Property #PROP-303 by User @Critic_9',
    reporterName: 'Subhash Das',
    reporterEmail: 'subhash.das@kolkata.in',
    reason: 'other',
    description: 'Reviewer gave 1 star rating complaining about city traffic outside property.',
    reportedAt: '3 days ago',
    status: 'dismissed',
    resolvedBy: 'Admin (Priya)',
    resolvedAt: '2 days ago',
    dismissalReason: 'Review reflects user opinion on location surroundings. Does not violate policy.',
    reporterHistoryCount: 1,
    previousReportsCount: 0,
    itemDetails: {
      rating: 1,
      ownerName: 'Critic_9',
      snippet: '"Traffic in this locality during peak hours is horrible! Heavy noise!"',
    },
  },
  {
    id: 'REP-4012',
    reportedItemType: 'listing',
    reportedItemId: 'PROP-772',
    reportedItemTitle: '4 BHK Beachfront House in ECR Chennai',
    reporterName: 'S. Ramanathan',
    reporterEmail: 'ramanathan@chennaiproperty.com',
    reason: 'inappropriate',
    description: 'Listing photo contains visible private contact phone numbers spray painted on property wall.',
    reportedAt: '3 days ago',
    status: 'open',
    reporterHistoryCount: 2,
    previousReportsCount: 1,
    itemDetails: {
      image: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=800&q=80',
      price: '₹4.20 Cr',
      location: 'ECR Road, Chennai',
      ownerName: 'Coastal Realty',
      snippet: 'Beachfront villa with private sea path and coconut palms.',
    },
  },
];
