// app/utils/routing.ts

const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjVkYTI4YzY3NWMzZjRmMzE4N2I4YjZmOWZhYzJjOTA3IiwiaCI6Im11cm11cjY0In0=';
const ORS_BASE_URL = 'https://api.openrouteservice.org/v2/directions/cycling-electric';

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type RouteResult = {
  coordinates: LatLng[];
  distanceMeters: number;
  durationSeconds: number;
};

export async function fetchRoute(
  origin: LatLng,
  destination: LatLng
): Promise<RouteResult | null> {
  try {
    const url =
      `${ORS_BASE_URL}?api_key=${ORS_API_KEY}` +
      `&start=${origin.longitude},${origin.latitude}` +
      `&end=${destination.longitude},${destination.latitude}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error('ORS error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();

    const feature = data.features?.[0];
    if (!feature) return null;

    // GeoJSON coordinates are [lng, lat] — flip to { latitude, longitude }
    const coordinates: LatLng[] = feature.geometry.coordinates.map(
      ([lng, lat]: [number, number]) => ({
        latitude: lat,
        longitude: lng,
      })
    );

    const summary = feature.properties.summary;

    return {
      coordinates,
      distanceMeters: summary.distance,
      durationSeconds: summary.duration,
    };
  } catch (error) {
    console.error('fetchRoute failed:', error);
    return null;
  }
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const remaining = mins % 60;
  return `${hrs}h ${remaining}min`;
}