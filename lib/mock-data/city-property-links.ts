export type CityName =
  | 'Bangalore'
  | 'Mumbai'
  | 'Hyderabad'
  | 'Pune'
  | 'New Delhi'
  | 'Chennai'
  | 'Ahmedabad'
  | 'Kolkata'
  | 'Gurgaon'
  | 'Noida';

export type PropertyMode = 'buy' | 'rent';

export interface LocalityLink {
  name: string;
  url: string;
}

export interface CategoryGroup {
  title: string;
  links: LocalityLink[];
}

export interface CityPropertyLinksData {
  buy: CategoryGroup[];
  rent: CategoryGroup[];
}

export const CITIES_LIST: CityName[] = [
  'Bangalore',
  'Mumbai',
  'Hyderabad',
  'Pune',
  'New Delhi',
  'Chennai',
  'Ahmedabad',
  'Kolkata',
  'Gurgaon',
  'Noida',
];

export const CITY_LOCALITIES: Record<CityName, string[]> = {
  Bangalore: [
    'Whitefield',
    'Sarjapur Road',
    'Electronic City',
    'Koramangala',
    'HSR Layout',
    'Marathahalli',
    'Hebbal',
    'Kanakapura Road',
    'Bellandur',
    'Yelahanka',
  ],
  Mumbai: [
    'Andheri',
    'Bandra',
    'Powai',
    'Thane',
    'Navi Mumbai',
    'Borivali',
    'Malad',
    'Goregaon',
    'Kandivali',
    'Vikhroli',
  ],
  Hyderabad: [
    'Gachibowli',
    'Hitech City',
    'Kondapur',
    'Madhapur',
    'Kukatpally',
    'Banjara Hills',
    'Jubilee Hills',
    'Miyapur',
    'Kompally',
    'Uppal',
  ],
  Pune: [
    'Wakad',
    'Hinjewadi',
    'Kharadi',
    'Baner',
    'Aundh',
    'Hadapsar',
    'Koregaon Park',
    'Viman Nagar',
    'Pimpri',
    'Chinchwad',
  ],
  'New Delhi': [
    'Dwarka',
    'Rohini',
    'Janakpuri',
    'Saket',
    'Lajpat Nagar',
    'Pitampura',
    'Vasant Kunj',
    'Karol Bagh',
    'Connaught Place',
    'Mayur Vihar',
  ],
  Chennai: [
    'Anna Nagar',
    'Velachery',
    'OMR',
    'Adyar',
    'Porur',
    'Tambaram',
    'Sholinganallur',
    'Perambur',
    'Chrompet',
    'Thoraipakkam',
  ],
  Ahmedabad: [
    'Prahlad Nagar',
    'Satellite',
    'Bopal',
    'Thaltej',
    'Vastrapur',
    'Navrangpura',
    'Ambawadi',
    'SG Highway',
    'Maninagar',
    'Gota',
  ],
  Kolkata: [
    'Salt Lake',
    'New Town',
    'Rajarhat',
    'Ballygunge',
    'Park Street',
    'Behala',
    'Dum Dum',
    'Howrah',
    'Gariahat',
    'Tollygunge',
  ],
  Gurgaon: [
    'DLF Phase 1',
    'Sector 56',
    'Golf Course Road',
    'Sohna Road',
    'MG Road',
    'Palam Vihar',
    'Sector 49',
    'Dwarka Expressway',
    'South City',
    'Nirvana Country',
  ],
  Noida: [
    'Sector 137',
    'Sector 150',
    'Sector 62',
    'Greater Noida West',
    'Sector 76',
    'Sector 93',
    'Sector 18',
    'Sector 44',
    'Sector 128',
    'Yamuna Expressway',
  ],
};

const BUY_CATEGORY_TEMPLATES = [
  'Flats in {city}',
  'House for Sale in {city}',
  'Property in {city}',
  'Plots in {city}',
];

const RENT_CATEGORY_TEMPLATES = [
  'Flats for Rent in {city}',
  'House for Rent in {city}',
  'PG in {city}',
  'Commercial Space in {city}',
];

function generateCityData(city: CityName): CityPropertyLinksData {
  const localities = CITY_LOCALITIES[city];

  const buyCategories: CategoryGroup[] = BUY_CATEGORY_TEMPLATES.map((template) => ({
    title: template.replace('{city}', city),
    links: localities.map((locality) => ({
      name: locality,
      url: `/properties?city=${encodeURIComponent(city)}&locality=${encodeURIComponent(locality)}&type=buy`,
    })),
  }));

  const rentCategories: CategoryGroup[] = RENT_CATEGORY_TEMPLATES.map((template) => ({
    title: template.replace('{city}', city),
    links: localities.map((locality) => ({
      name: locality,
      url: `/properties?city=${encodeURIComponent(city)}&locality=${encodeURIComponent(locality)}&type=rent`,
    })),
  }));

  return {
    buy: buyCategories,
    rent: rentCategories,
  };
}

export const cityPropertyLinksData: Record<CityName, CityPropertyLinksData> = CITIES_LIST.reduce(
  (acc, city) => {
    acc[city] = generateCityData(city);
    return acc;
  },
  {} as Record<CityName, CityPropertyLinksData>
);
