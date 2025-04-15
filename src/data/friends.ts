
import { Friend } from "../types";

const generateFriends = (category: 'bestfren' | 'workfren', count: number): Friend[] => {
  return Array.from({ length: count }).map((_, index) => {
    const id = `${category}-${index + 1}`;
    const statuses = ['active', 'busy', 'away'] as const;
    const frequencies = ['weekly', 'biweekly', 'monthly'] as const;
    const getRandomDate = () => {
      const now = new Date();
      const daysAgo = Math.floor(Math.random() * 30);
      now.setDate(now.getDate() - daysAgo);
      return now.toISOString();
    };
    
    return {
      id,
      name: `${category === 'bestfren' ? 'Best' : 'Work'} Friend ${index + 1}`,
      avatar: `/placeholder.svg?text=${index + 1}`,
      category,
      lastInteraction: getRandomDate(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      notes: `Notes about ${category === 'bestfren' ? 'Best' : 'Work'} Friend ${index + 1}`,
      contactFrequency: frequencies[Math.floor(Math.random() * frequencies.length)],
      birthday: '',
      favoriteArtists: [],
    };
  });
};

export const initialFriends: Friend[] = [
  ...generateFriends('bestfren', 15),
  ...generateFriends('workfren', 15),
];
