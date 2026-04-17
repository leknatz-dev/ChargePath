export type Spot = {
  id: string;
  name: string;
  status: 'verified' | 'unverified' | 'establishment';
  latitude: number;
  longitude: number;
  reviewed?: boolean;
};

export type FlowState = 'idle' | 'selecting' | 'form';
export type SelectionMode = 'tap' | 'crosshair';

export const DEFAULT_SPOTS: Spot[] = [
  { id: '1', name: 'Verified Spot', status: 'verified', latitude: 8.5147, longitude: 124.5670 },
  { id: '2', name: 'Unverified Spot', status: 'unverified', latitude: 8.5120, longitude: 124.5700 },
  { id: '3', name: 'Potential Spot', status: 'establishment', latitude: 8.5160, longitude: 124.5690 },
];
