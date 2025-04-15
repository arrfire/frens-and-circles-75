
import { Friend } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { CalendarDays, MessageCircleHeart, Clock, NotebookPen } from "lucide-react";
import { useState } from "react";

interface FriendDetailProps {
  friend: Friend | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateFriend: (friend: Friend) => void;
}

export function FriendDetail({ friend, isOpen, onClose, onUpdateFriend }: FriendDetailProps) {
  const [notes, setNotes] = useState<string>(friend?.notes || "");
  
  if (!friend) {
    return null;
  }
  
  const handleUpdateNotes = () => {
    onUpdateFriend({
      ...friend,
      notes,
      lastInteraction: new Date().toISOString()
    });
    onClose();
  };
  
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={friend.avatar} alt={friend.name} />
              <AvatarFallback>{getInitials(friend.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-xl">{friend.name}</DialogTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant={friend.category === 'bestfren' ? 'default' : 'secondary'}>
                  {friend.category === 'bestfren' ? 'Best Friend' : 'Work Friend'}
                </Badge>
                <Badge variant="outline">{friend.status}</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>Last interaction:</span>
            </div>
            <div>{formatDistanceToNow(new Date(friend.lastInteraction))} ago</div>
            
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Contact frequency:</span>
            </div>
            <div className="capitalize">{friend.contactFrequency}</div>
          </div>
          
          <div>
            <label className="text-sm font-medium flex items-center gap-1 mb-2">
              <NotebookPen className="h-4 w-4" />
              Notes
            </label>
            <Textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about your friend..."
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="sm:w-full"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleUpdateNotes}
            className="sm:w-full gap-1"
          >
            <MessageCircleHeart className="h-4 w-4" />
            Log Interaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
