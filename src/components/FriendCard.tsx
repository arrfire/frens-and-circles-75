
import { Friend } from "@/types";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { CalendarDays, AlertCircle, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface FriendCardProps {
  friend: Friend;
  onClick: () => void;
}

export function FriendCard({ friend, onClick }: FriendCardProps) {
  const needsAttention = getNeedsAttention(friend);
  
  return (
    <Card 
      className={`hover:shadow-md transition-all cursor-pointer ${needsAttention ? 'border-amber-300' : ''}`}
      onClick={onClick}
    >
      <CardContent className="pt-6 pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={friend.avatar} alt={friend.name} />
            <AvatarFallback>{getInitials(friend.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <h3 className="font-medium truncate">{friend.name}</h3>
              <StatusBadge status={friend.status} />
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <CalendarDays className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(friend.lastInteraction))} ago</span>
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pb-3 pt-0">
        {needsAttention ? (
          <div className="w-full px-2 py-1 bg-amber-50 rounded-sm text-xs flex items-center gap-1 text-amber-600">
            <AlertCircle className="h-3 w-3" /> Time to reconnect!
          </div>
        ) : (
          <div className="w-full px-2 py-1 bg-green-50 rounded-sm text-xs flex items-center gap-1 text-green-600">
            <CheckCircle className="h-3 w-3" /> Connection maintained
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}

function StatusBadge({ status }: { status: Friend["status"] }) {
  const variants = {
    active: "bg-green-100 text-green-800 hover:bg-green-100",
    busy: "bg-red-100 text-red-800 hover:bg-red-100",
    away: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  };
  
  const labels = {
    active: "Active",
    busy: "Busy",
    away: "Away",
  };
  
  return (
    <Badge variant="outline" className={variants[status]}>
      {labels[status]}
    </Badge>
  );
}

function getNeedsAttention(friend: Friend): boolean {
  const lastInteraction = new Date(friend.lastInteraction);
  const today = new Date();
  const daysSinceInteraction = Math.floor((today.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24));
  
  switch (friend.contactFrequency) {
    case 'weekly':
      return daysSinceInteraction > 7;
    case 'biweekly':
      return daysSinceInteraction > 14;
    case 'monthly':
      return daysSinceInteraction > 30;
    default:
      return false;
  }
}
