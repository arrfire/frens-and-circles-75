
import { Button } from "@/components/ui/button";
import { PlusCircle, Heart } from "lucide-react";

interface HeaderProps {
  onAddFriend: () => void;
}

export function Header({ onAddFriend }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b pb-4">
      <div className="container mx-auto px-4 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="text-primary h-8 w-8" />
              Frens & Circles
            </h1>
            <p className="text-muted-foreground mt-1">
              Maintain meaningful connections with the people who matter most
            </p>
          </div>
          
          <Button onClick={onAddFriend}>
            <PlusCircle className="h-4 w-4" />
            <span>Add Friend</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
