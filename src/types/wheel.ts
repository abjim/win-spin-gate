export interface WheelSegment {
  id: string;
  name: string;
  color: string;
  probability: number;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  prizeWon: string;
  timestamp: string;
}

export interface WheelConfig {
  segments: WheelSegment[];
}

export const DEFAULT_SEGMENTS: WheelSegment[] = [
  { id: '1', name: '10% Off', color: 'hsl(142, 71%, 45%)', probability: 25 },
  { id: '2', name: 'Free Ebook', color: 'hsl(45, 93%, 47%)', probability: 30 },
  { id: '3', name: '25% Off', color: 'hsl(221, 83%, 53%)', probability: 20 },
  { id: '4', name: 'Try Again', color: 'hsl(0, 84%, 60%)', probability: 15 },
  { id: '5', name: 'Free Coffee', color: 'hsl(280, 68%, 60%)', probability: 5 },
  { id: '6', name: 'Mystery Gift', color: 'hsl(173, 80%, 40%)', probability: 4 },
  { id: '7', name: 'VIP Access', color: 'hsl(24, 95%, 53%)', probability: 0.9 },
  { id: '8', name: 'JACKPOT!', color: 'hsl(262, 83%, 58%)', probability: 0.1 },
];
