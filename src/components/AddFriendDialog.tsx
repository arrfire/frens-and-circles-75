
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Friend } from "@/types";

interface AddFriendDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFriend: (friend: Omit<Friend, "id">) => void;
}

export function AddFriendDialog({ isOpen, onClose, onAddFriend }: AddFriendDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"bestfren" | "workfren">("bestfren");
  const [contactFrequency, setContactFrequency] = useState<Friend["contactFrequency"]>("weekly");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    const newFriend: Omit<Friend, "id"> = {
      name: name.trim(),
      avatar: `/placeholder.svg?text=${name.charAt(0)}`,
      category,
      lastInteraction: new Date().toISOString(),
      status: "active",
      notes: "",
      contactFrequency,
      birthday: undefined,
      favoriteArtists: [] // Add this missing required field
    };
    
    onAddFriend(newFriend);
    setName("");
    setCategory("bestfren");
    setContactFrequency("weekly");
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Friend</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="friend-name">Name</Label>
            <Input
              id="friend-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter friend's name"
              required
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="friend-category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as "bestfren" | "workfren")}>
              <SelectTrigger id="friend-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bestfren">Best Friend</SelectItem>
                <SelectItem value="workfren">Work Friend</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact-frequency">Contact Frequency</Label>
            <Select value={contactFrequency} onValueChange={(value) => setContactFrequency(value as Friend["contactFrequency"])}>
              <SelectTrigger id="contact-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Friend</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
