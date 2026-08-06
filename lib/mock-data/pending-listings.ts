export interface PendingListing {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'Apartment' | 'Villa' | 'Penthouse' | 'Plot' | 'Commercial' | 'Independent House';
  bhk: number;
  area: number; // in sq ft
  city: string;
  locality: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerVerified: boolean;
  submittedAt: string; // relative time format
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  flagReason?: string;
  rejectionReason?: string[];
  rejectionNotes?: string;
  reviewedAt?: string;
}

export const mockPendingListings: PendingListing[] = [
  {
    id: 'PL-1001',
    title: '3 BHK Premium Sky Suite in DLF Phase 5',
    description: 'Ultra-luxurious 3 BHK apartment featuring floor-to-ceiling glass walls, Italian marble flooring, automated smart lighting, double balcony overlooking golf greens, and 3 reserved basement parking spots.',
    price: 28500000, // 2.85 Cr
    type: 'Apartment',
    bhk: 3,
    area: 2150,
    city: 'Gurugram',
    locality: 'Golf Course Road',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    ],
    sellerId: 'SLR-801',
    sellerName: 'Vikram Malhotra',
    sellerVerified: true,
    submittedAt: '12 mins ago',
    status: 'pending',
    flagReason: 'Suspicious pricing (35% lower than Golf Course Road median)',
  },
  {
    id: 'PL-1002',
    title: '4 BHK Independent Modern Villa with Private Pool',
    description: 'Architect-designed 4 BHK duplex villa with private infinity pool, solar-paneled rooftop deck, modular Hafele kitchen, staff quarters, and landscaped private lawn in Bandra West.',
    price: 95000000, // 9.5 Cr
    type: 'Villa',
    bhk: 4,
    area: 4200,
    city: 'Mumbai',
    locality: 'Bandra West',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    ],
    sellerId: 'SLR-802',
    sellerName: 'Ananya Sharma',
    sellerVerified: true,
    submittedAt: '28 mins ago',
    status: 'pending',
  },
  {
    id: 'PL-1003',
    title: '2 BHK Sunlit Modern Apartment in Indiranagar',
    description: 'Charming 2 BHK flat in prime Indiranagar location. Close to 100ft road cafes and metro station. Comes fully furnished with premium appliances and wood flooring.',
    price: 13500000, // 1.35 Cr
    type: 'Apartment',
    bhk: 2,
    area: 1280,
    city: 'Bengaluru',
    locality: 'Indiranagar',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    ],
    sellerId: 'SLR-803',
    sellerName: 'Rajesh Varma',
    sellerVerified: false,
    submittedAt: '45 mins ago',
    status: 'pending',
    flagReason: 'Duplicate listing suspected (matches image signature of #PROP-409)',
  },
  {
    id: 'PL-1004',
    title: '5 BHK Luxury Penthouse with 360 Sky Deck',
    description: 'Sprawling 5 BHK penthouse across 2 floors with private jacuzzi elevator access, 360-degree city view terrace garden, sauna room, and 4 dedicated basement spots.',
    price: 68000000, // 6.8 Cr
    type: 'Penthouse',
    bhk: 5,
    area: 5500,
    city: 'New Delhi',
    locality: 'Vasant Kunj',
    images: [
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    ],
    sellerId: 'SLR-804',
    sellerName: 'Col. R. S. Rathore',
    sellerVerified: true,
    submittedAt: '1 hour ago',
    status: 'pending',
  },
  {
    id: 'PL-1005',
    title: '3 BHK Boutique Residence in Koregaon Park',
    description: 'Sophisticated 3 BHK condo surrounded by banyan trees. Features high ceiling heights, teakwood doors, imported sanitary fixtures, and 24/7 solar backup.',
    price: 19800000, // 1.98 Cr
    type: 'Apartment',
    bhk: 3,
    area: 1750,
    city: 'Pune',
    locality: 'Koregaon Park',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    ],
    sellerId: 'SLR-805',
    sellerName: 'Meera Kulkarni',
    sellerVerified: true,
    submittedAt: '2 hours ago',
    status: 'pending',
  },
  {
    id: 'PL-1006',
    title: '4 BHK Gated Estate Villa in Jubilee Hills',
    description: 'Palatial 4 BHK independent residence in Jubilee Hills Road No. 36. Features home theater setup, private elevator, Italian modular kitchen, and manicured lawns.',
    price: 79000000, // 7.9 Cr
    type: 'Villa',
    bhk: 4,
    area: 4800,
    city: 'Hyderabad',
    locality: 'Jubilee Hills',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
    ],
    sellerId: 'SLR-806',
    sellerName: 'K. V. Rao',
    sellerVerified: false,
    submittedAt: '3 hours ago',
    status: 'pending',
    flagReason: 'Missing mandatory layout approvals & structural safety certificate',
  },
  {
    id: 'PL-1007',
    title: '2 BHK High-Floor Flat in Express Greens Sector 150',
    description: 'Ready to move 2 BHK apartment overlooking 9-hole golf course. 100% power backup, clubhouse access, swimming pool, and excellent express connectivity.',
    price: 9200000, // 92 L
    type: 'Apartment',
    bhk: 2,
    area: 1150,
    city: 'Noida',
    locality: 'Sector 150',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    ],
    sellerId: 'SLR-807',
    sellerName: 'Amit Shah',
    sellerVerified: true,
    submittedAt: '4 hours ago',
    status: 'pending',
  },
  {
    id: 'PL-1008',
    title: '3 BHK Sea-Facing Residence in Worli Promenade',
    description: 'Unobstructed Arabian Sea view 3 BHK residence on higher floor. Includes central VRV air conditioning, double glazed windows, and concierge services.',
    price: 58000000, // 5.8 Cr
    type: 'Apartment',
    bhk: 3,
    area: 2100,
    city: 'Mumbai',
    locality: 'Worli',
    images: [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?auto=format&fit=crop&w=1200&q=80',
    ],
    sellerId: 'SLR-808',
    sellerName: 'Siddharth Roy',
    sellerVerified: true,
    submittedAt: '5 hours ago',
    status: 'pending',
  },
  {
    id: 'PL-1009',
    title: '4 BHK Oceanfront Villa along East Coast Road',
    description: 'Serene beach house villa with private access path to beach. Features spacious outdoor deck, gazebos, coconut palm gardens, and 24/7 security perimeter.',
    price: 42000000, // 4.2 Cr
    type: 'Villa',
    bhk: 4,
    area: 3600,
    city: 'Chennai',
    locality: 'ECR Road',
    images: [
      'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
    ],
    sellerId: 'SLR-809',
    sellerName: 'S. Ramanathan',
    sellerVerified: false,
    submittedAt: '6 hours ago',
    status: 'pending',
    flagReason: 'Incomplete seller KYC identification documents',
  },
  {
    id: 'PL-1010',
    title: '3 BHK Gated Society Flat in HSR Sector 2',
    description: 'Well-maintained 3 BHK flat with east-facing Vastu compliance. Features modular kitchen, wooden wardrobes, reserved car park, and proximity to tech parks.',
    price: 15500000, // 1.55 Cr
    type: 'Apartment',
    bhk: 3,
    area: 1650,
    city: 'Bengaluru',
    locality: 'HSR Layout',
    images: [
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    ],
    sellerId: 'SLR-810',
    sellerName: 'Priya Nair',
    sellerVerified: true,
    submittedAt: '7 hours ago',
    status: 'pending',
  },
  {
    id: 'PL-1011',
    title: '2 BHK Studio Apartment in Whitefield Tech Hub',
    description: 'Compact modern 2 BHK studio designed for IT professionals. Fully furnished with high-speed fiber internet wiring, gym access, and cafeteria inside complex.',
    price: 6800000, // 68 L
    type: 'Apartment',
    bhk: 2,
    area: 890,
    city: 'Bengaluru',
    locality: 'Whitefield',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    ],
    sellerId: 'SLR-811',
    sellerName: 'TechInvest Corp',
    sellerVerified: false,
    submittedAt: '9 hours ago',
    status: 'pending',
    flagReason: 'Watermarked stock imagery detected in 2 listing photos',
  },
  {
    id: 'PL-1012',
    title: '4 BHK Heritage Royal Mansion in Civil Lines',
    description: 'Stunning Rajasthani heritage architecture blended with modern amenities. Features courtyard fountain, carved stone pillars, sprawling gardens, and servant quarter.',
    price: 45000000, // 4.5 Cr
    type: 'Independent House',
    bhk: 4,
    area: 3800,
    city: 'Jaipur',
    locality: 'Civil Lines',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    ],
    sellerId: 'SLR-812',
    sellerName: 'Gayatri Devi',
    sellerVerified: true,
    submittedAt: '11 hours ago',
    status: 'pending',
  },
  {
    id: 'PL-1013',
    title: '3 BHK Lake View Condo in Rajarhat New Town',
    description: 'Overlooking Eco Park lake, this 3 BHK flat offers tranquil living with smart city conveniences. Equipped with clubhouse, indoor games, and badminton court.',
    price: 9800000, // 98 L
    type: 'Apartment',
    bhk: 3,
    area: 1420,
    city: 'Kolkata',
    locality: 'Rajarhat',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    ],
    sellerId: 'SLR-813',
    sellerName: 'Subhash Das',
    sellerVerified: true,
    submittedAt: '14 hours ago',
    status: 'pending',
  },
  {
    id: 'PL-1014',
    title: '5 BHK Luxury Gated Farmhouse Estate in Chattarpur',
    description: 'Sprawling 1.5 acre luxury estate with 5 BHK main bungalow, swimming pool, party lawn, tennis court, solar farm grid, and 8 servant rooms.',
    price: 145000000, // 14.5 Cr
    type: 'Villa',
    bhk: 5,
    area: 8500,
    city: 'New Delhi',
    locality: 'Chattarpur',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    ],
    sellerId: 'SLR-814',
    sellerName: 'Devendra Ahluwalia',
    sellerVerified: true,
    submittedAt: '18 hours ago',
    status: 'pending',
  },
  {
    id: 'PL-1015',
    title: '3 BHK Modern Villa in Financial District',
    description: 'Contemporary 3 BHK triplex villa in premium gated township right next to IT hub. Includes private terrace pool, basement theater room, and EV charging station.',
    price: 26500000, // 2.65 Cr
    type: 'Villa',
    bhk: 3,
    area: 2800,
    city: 'Hyderabad',
    locality: 'Gachibowli',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    ],
    sellerId: 'SLR-815',
    sellerName: 'Srinivas Reddy',
    sellerVerified: true,
    submittedAt: '1 day ago',
    status: 'pending',
  },
];
