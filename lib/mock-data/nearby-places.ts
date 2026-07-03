export interface NearbyPlace {
  name: string;
  type: 'school' | 'hospital' | 'metro' | 'mall' | 'restaurant';
  lat: number;
  lng: number;
  distanceKm: number;
}

export function getNearbyPlaces(lat: number, lng: number): NearbyPlace[] {
  // Deterministic offset templates based on lat/lng coordinate degrees
  const placeTemplates = [
    { name: 'St. Xavier High School', type: 'school' as const, dx: 0.005, dy: -0.003 },
    { name: 'City Metro Station', type: 'metro' as const, dx: -0.004, dy: 0.006 },
    { name: 'Apollo Medical Clinic', type: 'hospital' as const, dx: 0.008, dy: 0.002 },
    { name: 'Galleria Shopping Mall', type: 'mall' as const, dx: -0.006, dy: -0.007 },
    { name: 'The Golden Spoon Restaurant', type: 'restaurant' as const, dx: 0.003, dy: 0.004 },
    { name: 'Ryan International School', type: 'school' as const, dx: -0.009, dy: 0.003 },
    { name: 'Metro Junction Interchange', type: 'metro' as const, dx: 0.007, dy: -0.008 },
    { name: 'Max Super Specialty Hospital', type: 'hospital' as const, dx: -0.002, dy: -0.004 },
  ];

  return placeTemplates.map((item) => {
    const placeLat = lat + item.dx;
    const placeLng = lng + item.dy;
    // Approximated distance in kilometers
    const distanceKm = Math.round(Math.sqrt(item.dx * item.dx + item.dy * item.dy) * 111.32 * 10) / 10;
    
    return {
      name: item.name,
      type: item.type,
      lat: placeLat,
      lng: placeLng,
      distanceKm: Math.max(0.2, distanceKm)
    };
  });
}
