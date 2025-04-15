
export interface Friend {
  id: string;
  name: string;
  avatar: string;
  category: 'bestfren' | 'workfren';
  lastInteraction: string;
  status: 'active' | 'busy' | 'away';
  notes: string;
  contactFrequency: 'weekly' | 'biweekly' | 'monthly';
  birthday?: string;
  favoriteArtists: string[];
}

export interface CircleStats {
  total: number;
  active: number;
  needsAttention: number;
}
