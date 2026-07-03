export interface LocalityItem {
  id: string;
  name: string;
  city: string;
  type: 'city' | 'locality';
}

export const mockLocalities: LocalityItem[] = [
  // --- MUMBAI ---
  { id: 'loc-1', name: 'Mumbai', city: 'Mumbai', type: 'city' },
  { id: 'loc-2', name: 'Bandra', city: 'Mumbai', type: 'locality' },
  { id: 'loc-3', name: 'Andheri', city: 'Mumbai', type: 'locality' },
  { id: 'loc-4', name: 'Powai', city: 'Mumbai', type: 'locality' },
  { id: 'loc-5', name: 'Juhu', city: 'Mumbai', type: 'locality' },
  { id: 'loc-6', name: 'Worli', city: 'Mumbai', type: 'locality' },
  { id: 'loc-7', name: 'Colaba', city: 'Mumbai', type: 'locality' },

  // --- NEW DELHI ---
  { id: 'loc-8', name: 'New Delhi', city: 'New Delhi', type: 'city' },
  { id: 'loc-9', name: 'Connaught Place', city: 'New Delhi', type: 'locality' },
  { id: 'loc-10', name: 'Dwarka', city: 'New Delhi', type: 'locality' },
  { id: 'loc-11', name: 'Rohini', city: 'New Delhi', type: 'locality' },
  { id: 'loc-12', name: 'Saket', city: 'New Delhi', type: 'locality' },
  { id: 'loc-13', name: 'Vasant Kunj', city: 'New Delhi', type: 'locality' },
  { id: 'loc-14', name: 'South Extension', city: 'New Delhi', type: 'locality' },

  // --- GURUGRAM ---
  { id: 'loc-15', name: 'Gurugram', city: 'Gurugram', type: 'city' },
  { id: 'loc-16', name: 'DLF Phase 5', city: 'Gurugram', type: 'locality' },
  { id: 'loc-17', name: 'Golf Course Road', city: 'Gurugram', type: 'locality' },
  { id: 'loc-18', name: 'Sector 54', city: 'Gurugram', type: 'locality' },
  { id: 'loc-19', name: 'Sohna Road', city: 'Gurugram', type: 'locality' },
  { id: 'loc-20', name: 'Sector 82', city: 'Gurugram', type: 'locality' },
  { id: 'loc-21', name: 'Sector 48', city: 'Gurugram', type: 'locality' },

  // --- NOIDA ---
  { id: 'loc-22', name: 'Noida', city: 'Noida', type: 'city' },
  { id: 'loc-23', name: 'Sector 62', city: 'Noida', type: 'locality' },
  { id: 'loc-24', name: 'Sector 150', city: 'Noida', type: 'locality' },
  { id: 'loc-25', name: 'Sector 18', city: 'Noida', type: 'locality' },
  { id: 'loc-26', name: 'Sector 137', city: 'Noida', type: 'locality' },
  { id: 'loc-27', name: 'Sector 78', city: 'Noida', type: 'locality' },
  { id: 'loc-28', name: 'Greater Noida', city: 'Noida', type: 'locality' },

  // --- BENGALURU ---
  { id: 'loc-29', name: 'Bengaluru', city: 'Bengaluru', type: 'city' },
  { id: 'loc-30', name: 'Koramangala', city: 'Bengaluru', type: 'locality' },
  { id: 'loc-31', name: 'Indiranagar', city: 'Bengaluru', type: 'locality' },
  { id: 'loc-32', name: 'Whitefield', city: 'Bengaluru', type: 'locality' },
  { id: 'loc-33', name: 'HSR Layout', city: 'Bengaluru', type: 'locality' },
  { id: 'loc-34', name: 'Jayanagar', city: 'Bengaluru', type: 'locality' },
  { id: 'loc-35', name: 'Electronic City', city: 'Bengaluru', type: 'locality' },

  // --- HYDERABAD ---
  { id: 'loc-36', name: 'Hyderabad', city: 'Hyderabad', type: 'city' },
  { id: 'loc-37', name: 'Gachibowli', city: 'Hyderabad', type: 'locality' },
  { id: 'loc-38', name: 'Jubilee Hills', city: 'Hyderabad', type: 'locality' },
  { id: 'loc-39', name: 'Hitech City', city: 'Hyderabad', type: 'locality' },
  { id: 'loc-40', name: 'Banjara Hills', city: 'Hyderabad', type: 'locality' },
  { id: 'loc-41', name: 'Kondapur', city: 'Hyderabad', type: 'locality' },
  { id: 'loc-42', name: 'Madhapur', city: 'Hyderabad', type: 'locality' },

  // --- CHENNAI ---
  { id: 'loc-43', name: 'Chennai', city: 'Chennai', type: 'city' },
  { id: 'loc-44', name: 'Adyar', city: 'Chennai', type: 'locality' },
  { id: 'loc-45', name: 'Velachery', city: 'Chennai', type: 'locality' },
  { id: 'loc-46', name: 'Mylapore', city: 'Chennai', type: 'locality' },
  { id: 'loc-47', name: 'OMR', city: 'Chennai', type: 'locality' },
  { id: 'loc-48', name: 'T Nagar', city: 'Chennai', type: 'locality' },
  { id: 'loc-49', name: 'Anna Nagar', city: 'Chennai', type: 'locality' },

  // --- PUNE ---
  { id: 'loc-50', name: 'Pune', city: 'Pune', type: 'city' },
  { id: 'loc-51', name: 'Koregaon Park', city: 'Pune', type: 'locality' },
  { id: 'loc-52', name: 'Kalyani Nagar', city: 'Pune', type: 'locality' },
  { id: 'loc-53', name: 'Viman Nagar', city: 'Pune', type: 'locality' },
  { id: 'loc-54', name: 'Hinjewadi', city: 'Pune', type: 'locality' },
  { id: 'loc-55', name: 'Baner', city: 'Pune', type: 'locality' },
  { id: 'loc-56', name: 'Wakad', city: 'Pune', type: 'locality' },
];
