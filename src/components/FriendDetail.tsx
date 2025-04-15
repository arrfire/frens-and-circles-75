
import { Friend } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { formatDistanceToNow, format } from "date-fns";
import { CalendarDays, MessageCircleHeart, Clock, NotebookPen, Trash2, Calendar, Music } from "lucide-react";
import { useState, useEffect } from "react";
import { Calendar as CalendarPicker } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface FriendDetailProps {
  friend: Friend | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateFriend: (friend: Friend) => void;
  onDeleteFriend: (friendId: string) => void;
}

export function FriendDetail({ friend, isOpen, onClose, onUpdateFriend, onDeleteFriend }: FriendDetailProps) {
  const [notes, setNotes] = useState<string>("");
  const [artists, setArtists] = useState<string[]>([]);
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  
  // Update state when friend changes using useEffect instead of useState callback
  useEffect(() => {
    if (friend) {
      setNotes(friend.notes);
      setArtists(friend.favoriteArtists || []);
      setBirthday(friend.birthday ? new Date(friend.birthday) : undefined);
    }
  }, [friend]);
  
  if (!friend) {
    return null;
  }
  
  const handleUpdateFriend = () => {
    onUpdateFriend({
      ...friend,
      notes,
      lastInteraction: new Date().toISOString(),
      favoriteArtists: artists,
      birthday: birthday ? birthday.toISOString() : undefined,
    });
    onClose();
  };
  
  const handleDelete = () => {
    onDeleteFriend(friend.id);
    onClose();
  };
  
  const handleArtistChange = (index: number, value: string) => {
    const newArtists = [...(artists || [])];
    newArtists[index] = value;
    setArtists(newArtists.slice(0, 3));
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
          
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Birthday
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  {birthday ? format(birthday, "PPP") : "Select birthday"}
                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarPicker
                  mode="single"
                  selected={birthday}
                  onSelect={setBirthday}
                  className="rounded-md border pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Music className="h-4 w-4" />
              Top 3 Favorite Artists
            </label>
            <div className="space-y-2">
              {[0, 1, 2].map((index) => (
                <Input
                  key={index}
                  placeholder={`Artist ${index + 1}`}
                  value={artists[index] || ''}
                  onChange={(e) => handleArtistChange(index, e.target.value)}
                />
              ))}
            </div>
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
            variant="destructive"
            onClick={handleDelete}
            className="sm:w-full gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Delete Friend
          </Button>
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleUpdateFriend}
              className="gap-1"
            >
              <MessageCircleHeart className="h-4 w-4" />
              Update
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
