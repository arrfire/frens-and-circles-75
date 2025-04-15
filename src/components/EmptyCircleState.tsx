
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";

interface EmptyCircleStateProps {
  category: 'bestfren' | 'workfren';
  onAddFriend: () => void;
}

export function EmptyCircleState({ category, onAddFriend }: EmptyCircleStateProps) {
  const title = category === 'bestfren' ? 'Best Friends' : 'Work Friends';
  
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-muted/10">
      <div className="text-center space-y-3 max-w-xs">
        <h3 className="font-semibold text-lg">No {title} Yet</h3>
        <p className="text-sm text-muted-foreground">
          Start building your circle of {category === 'bestfren' ? 'best friends' : 'professional connections'} to maintain those important relationships.
        </p>
        <Button onClick={onAddFriend} className="mt-4">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add a {category === 'bestfren' ? 'Best Friend' : 'Work Friend'}
        </Button>
      </div>
    </div>
  );
}
