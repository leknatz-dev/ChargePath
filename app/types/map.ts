export type SpotType = 'independent' | 'hybrid';
export type SpotStatus = 'verified' | 'unverified' | 'establishment';

// ---------------------------------------------------------------------------
// Review filter types — each becomes a column in Supabase reviews table later
// ---------------------------------------------------------------------------
export type PriceRange = 'free' | 'p1-p20' | 'p21-p50' | 'p50+';
export type FeeType = 'per_hour' | 'metered' | 'flat_rate' | 'free';
export type OutletType = 'standard_wall' | 'extension_cord' | 'usb_a' | 'usb_c';
export type AccessType = 'public' | 'ask_staff' | 'purchase_required';
export type ParkingType = 'roadside' | 'dedicated_ebike_slot' | 'covered_indoor';
export type AmenityType = 'wifi' | 'restroom' | 'seating_area' | 'aircon' | 'cctv_secured';
export type VibeType = 'friendly' | 'neutral' | 'unfriendly';

export type Review = {
  id: string;
  author: string;
  // Filter fields
  priceRange?: PriceRange;
  feeType?: FeeType;
  outletTypes?: OutletType[];      // multi select
  accessType?: AccessType;
  parkingTypes?: ParkingType[];    // multi select
  amenities?: AmenityType[];       // multi select
  vibe?: VibeType;
  // Freeform
  notes?: string;
  rating: number;
  createdAt: string;
};

export type Spot = {
  id: string;
  name: string;
  type: SpotType;
  status: SpotStatus;
  latitude: number;
  longitude: number;
  // Detail sheet fields
  address?: string;
  // Aggregated from reviews — computed on backend later
  price?: string;
  outletDescription?: string;
  tips?: string;
  photos?: string[];
  reviews?: Review[];
  // Meta
  addedBy?: string;
  verificationCount?: number;
  createdAt?: string;
  businessName?: string;
};

export type FlowState = 'idle' | 'selecting' | 'form';
export type SelectionMode = 'tap' | 'crosshair';

// ---------------------------------------------------------------------------
// MOCK DATA
// ---------------------------------------------------------------------------
export const DEFAULT_SPOTS: Spot[] = [
  {
    id: 'mock-1',
    name: '7-Eleven Charging Outlet',
    type: 'hybrid',
    status: 'verified',
    latitude: 8.5155,
    longitude: 124.5663,
    address: '7-Eleven, Opol, Misamis Oriental',
    businessName: '7-Eleven',
    price: 'Free (purchase required)',
    outletDescription: '2 standard outlets near the cashier counter',
    tips: 'Best to charge early morning, less crowded.',
    photos: [],
    reviews: [
      {
        id: 'r1',
        author: 'JuanRider',
        priceRange: 'free',
        feeType: 'free',
        outletTypes: ['standard_wall'],
        accessType: 'purchase_required',
        parkingTypes: ['roadside'],
        amenities: ['cctv_secured'],
        vibe: 'friendly',
        notes: 'Reliable spot, always has power. Staff is friendly.',
        rating: 5,
        createdAt: '2024-11-01',
      },
      {
        id: 'r2',
        author: 'TrikeDriver88',
        priceRange: 'free',
        feeType: 'free',
        outletTypes: ['standard_wall', 'extension_cord'],
        accessType: 'purchase_required',
        parkingTypes: ['roadside'],
        amenities: [],
        vibe: 'neutral',
        notes: 'Sometimes the outlet near the door is occupied.',
        rating: 4,
        createdAt: '2024-11-10',
      },
    ],
    verificationCount: 12,
    createdAt: '2024-10-15',
  },
  {
    id: 'mock-2',
    name: 'Opol Public Market Outlet',
    type: 'independent',
    status: 'verified',
    latitude: 8.5130,
    longitude: 124.5690,
    address: 'Opol Public Market, Opol',
    price: 'P10/hr',
    outletDescription: 'Outdoor post near the jeepney terminal',
    tips: 'Caretaker collects P10 per hour. Open 6AM–6PM only.',
    photos: [],
    reviews: [
      {
        id: 'r3',
        author: 'EbikeOpol',
        priceRange: 'p1-p20',
        feeType: 'per_hour',
        outletTypes: ['standard_wall'],
        accessType: 'public',
        parkingTypes: ['dedicated_ebike_slot'],
        amenities: ['cctv_secured'],
        vibe: 'friendly',
        notes: 'Legit spot, caretaker is always there.',
        rating: 5,
        createdAt: '2024-10-20',
      },
    ],
    verificationCount: 8,
    createdAt: '2024-10-01',
  },
  {
    id: 'mock-3',
    name: 'Cafe Uno Charging Corner',
    type: 'hybrid',
    status: 'verified',
    latitude: 8.5168,
    longitude: 124.5645,
    address: 'Cafe Uno, Opol Main Road',
    businessName: 'Cafe Uno',
    price: 'Free (buy at least P50)',
    outletDescription: '4 outlets with a power strip near the window seats',
    tips: 'Order anything, they\'ll let you stay and charge.',
    photos: [],
    reviews: [
      {
        id: 'r4',
        author: 'ScoutRider',
        priceRange: 'free',
        feeType: 'free',
        outletTypes: ['standard_wall', 'usb_a'],
        accessType: 'purchase_required',
        parkingTypes: ['roadside'],
        amenities: ['wifi', 'seating_area', 'aircon'],
        vibe: 'friendly',
        notes: 'Chill place to wait while charging. Great coffee too.',
        rating: 5,
        createdAt: '2024-11-05',
      },
    ],
    verificationCount: 6,
    createdAt: '2024-10-28',
  },
  {
    id: 'mock-4',
    name: 'Roadside Post near Barangay Hall',
    type: 'independent',
    status: 'unverified',
    latitude: 8.5110,
    longitude: 124.5710,
    address: 'Near Brgy. Hall, Opol',
    price: 'Unknown',
    outletDescription: 'Community outlet, unverified availability',
    tips: 'Reported by one rider — needs more confirmations.',
    photos: [],
    reviews: [],
    verificationCount: 1,
    createdAt: '2024-11-12',
  },
  {
    id: 'mock-5',
    name: 'SM CDC Charging Bay',
    type: 'hybrid',
    status: 'establishment',
    latitude: 8.5175,
    longitude: 124.5630,
    address: 'SM CDC, Opol-Cagayan Road',
    businessName: 'SM Hypermarket CDC',
    price: 'P20/hr',
    outletDescription: 'Dedicated charging bay in parking area B',
    tips: 'Look for the green E-Charging signage near the entrance.',
    photos: [],
    reviews: [
      {
        id: 'r5',
        author: 'OpsolScout01',
        priceRange: 'p21-p50',
        feeType: 'per_hour',
        outletTypes: ['standard_wall', 'usb_c'],
        accessType: 'public',
        parkingTypes: ['dedicated_ebike_slot', 'covered_indoor'],
        amenities: ['restroom', 'seating_area', 'aircon', 'cctv_secured', 'wifi'],
        vibe: 'friendly',
        notes: 'Official charging bay. Well maintained and secure.',
        rating: 5,
        createdAt: '2024-11-08',
      },
    ],
    verificationCount: 15,
    createdAt: '2024-09-20',
  },
];  