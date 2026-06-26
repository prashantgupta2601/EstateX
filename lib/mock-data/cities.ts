export interface CityData {
  id: string;
  name: string;
  image: string;
  propertyCount: number;
}

export const mockCities: CityData[] = [
  {
    id: 'city-mumbai',
    name: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1529250856085-ad1d2831e17c?w=600&auto=format&fit=crop&q=80',
    propertyCount: 14200,
  },
  {
    id: 'city-delhi',
    name: 'New Delhi',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80',
    propertyCount: 11800,
  },
  {
    id: 'city-bengaluru',
    name: 'Bengaluru',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=80',
    propertyCount: 12500,
  },
  {
    id: 'city-gurugram',
    name: 'Gurugram',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=80',
    propertyCount: 9400,
  },
  {
    id: 'city-pune',
    name: 'Pune',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&auto=format&fit=crop&q=80',
    propertyCount: 8200,
  },
  {
    id: 'city-hyderabad',
    name: 'Hyderabad',
    image: 'https://images.unsplash.com/photo-1601880340244-78ddc8b66324?w=600&auto=format&fit=crop&q=80',
    propertyCount: 7800,
  },
  {
    id: 'city-chennai',
    name: 'Chennai',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80',
    propertyCount: 6500,
  },
  {
    id: 'city-kolkata',
    name: 'Kolkata',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600&auto=format&fit=crop&q=80',
    propertyCount: 5400,
  },
];
