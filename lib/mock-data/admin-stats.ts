export interface PlatformStats {
  totalUsers: number;
  totalSellers: number;
  totalBuyers: number;
  newUsersToday: number;
  totalProperties: number;
  activeListings: number;
  pendingApprovals: number;
  rejectedListings: number;
  totalLeads: number;
  leadsToday: number;
  totalRevenue: number;
  revenueThisMonth: number;
  activeSubscriptions: number;
  churnRate: number;
}

export interface DailyStat {
  date: string;
  newUsers: number;
  newListings: number;
  revenue: number;
  leads: number;
}

export interface PendingApprovalItem {
  id: string;
  title: string;
  seller: string;
  location: string;
  price: string;
  type: string;
  submittedAt: string;
}

export interface RecentUserItem {
  id: string;
  name: string;
  email: string;
  role: 'Buyer' | 'Seller' | 'Broker';
  registeredAt: string;
  status: 'Active' | 'Pending KYC' | 'Verified';
}

export const platformStats: PlatformStats = {
  totalUsers: 14850,
  totalSellers: 3240,
  totalBuyers: 11610,
  newUsersToday: 84,
  totalProperties: 5420,
  activeListings: 4180,
  pendingApprovals: 24,
  rejectedListings: 112,
  totalLeads: 28450,
  leadsToday: 342,
  totalRevenue: 14850000,
  revenueThisMonth: 1480000,
  activeSubscriptions: 1840,
  churnRate: 2.1,
};

export const weeklyStats: DailyStat[] = [
  { date: 'Jul 28', newUsers: 68, newListings: 42, revenue: 185000, leads: 290 },
  { date: 'Jul 29', newUsers: 72, newListings: 48, revenue: 210000, leads: 310 },
  { date: 'Jul 30', newUsers: 79, newListings: 51, revenue: 195000, leads: 325 },
  { date: 'Jul 31', newUsers: 85, newListings: 55, revenue: 240000, leads: 350 },
  { date: 'Aug 01', newUsers: 90, newListings: 58, revenue: 265000, leads: 368 },
  { date: 'Aug 02', newUsers: 82, newListings: 49, revenue: 225000, leads: 330 },
  { date: 'Aug 03', newUsers: 84, newListings: 52, revenue: 235000, leads: 342 },
];

export const mockPendingApprovals: PendingApprovalItem[] = [
  {
    id: 'PROP-9021',
    title: 'DLF Cyber City Premium Office Suite',
    seller: 'Gurgaon Realty Ltd',
    location: 'Cyber City, Gurgaon',
    price: '₹4.2 Cr',
    type: 'Commercial',
    submittedAt: '10 mins ago',
  },
  {
    id: 'PROP-9022',
    title: 'Luxury 4BHK Villa in Jubilee Hills',
    seller: 'Telangana Homes',
    location: 'Jubilee Hills, Hyderabad',
    price: '₹8.5 Cr',
    type: 'Villa',
    submittedAt: '25 mins ago',
  },
  {
    id: 'PROP-9023',
    title: 'Sea Facing 3BHK Apartment',
    seller: 'Apex Developers',
    location: 'Bandra West, Mumbai',
    price: '₹12.0 Cr',
    type: 'Apartment',
    submittedAt: '1 hour ago',
  },
  {
    id: 'PROP-9024',
    title: 'Modern Tech Park Office Space',
    seller: 'Brigade Group',
    location: 'Whitefield, Bangalore',
    price: '₹6.7 Cr',
    type: 'Commercial',
    submittedAt: '2 hours ago',
  },
  {
    id: 'PROP-9025',
    title: 'Penthouse with Private Terrace',
    seller: 'Skyline Properties',
    location: 'Koregaon Park, Pune',
    price: '₹5.1 Cr',
    type: 'Penthouse',
    submittedAt: '3 hours ago',
  },
];

export const mockRecentRegistrations: RecentUserItem[] = [
  {
    id: 'USR-8801',
    name: 'Vikram Malhotra',
    email: 'vikram.m@gmail.com',
    role: 'Broker',
    registeredAt: '5 mins ago',
    status: 'Pending KYC',
  },
  {
    id: 'USR-8802',
    name: 'Priya Sharma',
    email: 'priya.sharma@outlook.com',
    role: 'Buyer',
    registeredAt: '18 mins ago',
    status: 'Active',
  },
  {
    id: 'USR-8803',
    name: 'Rajesh Developers',
    email: 'contact@rajeshdev.com',
    role: 'Seller',
    registeredAt: '45 mins ago',
    status: 'Verified',
  },
  {
    id: 'USR-8804',
    name: 'Ananya Roy',
    email: 'ananya.roy@yahoo.com',
    role: 'Buyer',
    registeredAt: '1 hour ago',
    status: 'Active',
  },
  {
    id: 'USR-8805',
    name: 'Karan Mehta',
    email: 'karan.m@mehtarealty.in',
    role: 'Broker',
    registeredAt: '2 hours ago',
    status: 'Verified',
  },
];
