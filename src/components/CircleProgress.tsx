
import { CircleStats } from "@/types";
import { Progress } from "./ui/progress";

interface CircleProgressProps {
  stats: CircleStats;
  category: 'bestfren' | 'workfren';
  maxFriends: number;
}

export function CircleProgress({ stats, category, maxFriends }: CircleProgressProps) {
  const percentage = Math.round((stats.total / maxFriends) * 100);
  const title = category === 'bestfren' ? 'Best Friends' : 'Work Friends';
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{title} Circle</h3>
        <span className="text-sm text-muted-foreground">{stats.total}/{maxFriends}</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <div>Active: {stats.active}</div>
        <div>Needs Attention: {stats.needsAttention}</div>
      </div>
    </div>
  );
}
