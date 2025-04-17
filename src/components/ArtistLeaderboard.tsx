
import { useMemo } from "react";
import { Friend } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Music } from "lucide-react";

interface ArtistLeaderboardProps {
  friends: Friend[];
}

export function ArtistLeaderboard({ friends }: ArtistLeaderboardProps) {
  const artistStats = useMemo(() => {
    const stats = new Map<string, number>();
    
    friends.forEach(friend => {
      friend.favoriteArtists.forEach(artist => {
        stats.set(artist, (stats.get(artist) || 0) + 1);
      });
    });
    
    return Array.from(stats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Show top 5 artists
  }, [friends]);
  
  if (artistStats.length === 0) return null;
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Music className="h-5 w-5" />
          Artist Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {artistStats.map(([artist, count]) => (
            <div key={artist} className="flex justify-between items-center">
              <span className="font-medium">{artist}</span>
              <span className="text-sm text-muted-foreground">
                {count} {count === 1 ? 'friend' : 'friends'}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
