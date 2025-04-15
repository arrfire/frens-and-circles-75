import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleProgress } from "@/components/CircleProgress";
import { FriendCard } from "@/components/FriendCard";
import { FriendDetail } from "@/components/FriendDetail";
import { EmptyCircleState } from "@/components/EmptyCircleState";
import { SearchFilter } from "@/components/SearchFilter";
import { AddFriendDialog } from "@/components/AddFriendDialog";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { UserCircle2, BriefcaseBusiness } from "lucide-react";
import { Friend, CircleStats } from "@/types";
import { initialFriends } from "@/data/friends";

const MAX_FRIENDS_PER_CATEGORY = 75;

const Index = () => {
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  
  // Calculate circle stats
  const calculateStats = (category: 'bestfren' | 'workfren'): CircleStats => {
    const categoryFriends = friends.filter(friend => friend.category === category);
    const active = categoryFriends.filter(friend => friend.status === "active").length;
    
    const needsAttention = categoryFriends.filter(friend => {
      const lastInteraction = new Date(friend.lastInteraction);
      const today = new Date();
      const daysSince = Math.floor((today.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (friend.contactFrequency) {
        case "weekly": return daysSince > 7;
        case "biweekly": return daysSince > 14;
        case "monthly": return daysSince > 30;
        default: return false;
      }
    }).length;
    
    return {
      total: categoryFriends.length,
      active,
      needsAttention
    };
  };
  
  // Delete friend
  const handleDeleteFriend = (friendId: string) => {
    setFriends(prev => prev.filter(friend => friend.id !== friendId));
  };
  
  // Update friend
  const handleUpdateFriend = (updatedFriend: Friend) => {
    setFriends(prev => 
      prev.map(friend => 
        friend.id === updatedFriend.id ? updatedFriend : friend
      )
    );
    setSelectedFriend(null);
  };
  
  // Add new friend
  const handleAddFriend = (newFriend: Omit<Friend, "id">) => {
    const id = `${newFriend.category}-${Date.now()}`;
    setFriends(prev => [...prev, { ...newFriend, id }]);
  };
  
  // Sort and filter friends
  const sortAndFilterFriends = (friends: Friend[]) => {
    return friends
      .filter(friend => {
        // Search query filter
        const matchesSearch = friend.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Status filter
        let matchesStatus = true;
        if (statusFilter === "needs-attention") {
          const lastInteraction = new Date(friend.lastInteraction);
          const today = new Date();
          const daysSince = Math.floor((today.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24));
          
          switch (friend.contactFrequency) {
            case "weekly": matchesStatus = daysSince > 7; break;
            case "biweekly": matchesStatus = daysSince > 14; break;
            case "monthly": matchesStatus = daysSince > 30; break;
            default: matchesStatus = false;
          }
        } else if (statusFilter !== "all") {
          matchesStatus = friend.status === statusFilter;
        }
        
        // Category/tab filter
        const matchesCategory = 
          activeTab === "all" ||
          (activeTab === "bestfrens" && friend.category === "bestfren") ||
          (activeTab === "workfrens" && friend.category === "workfren");
        
        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        // Sort by upcoming birthday if both have birthdays
        if (a.birthday && b.birthday) {
          const today = new Date();
          const birthdayA = new Date(a.birthday);
          const birthdayB = new Date(b.birthday);
          
          // Set year to current year for comparison
          birthdayA.setFullYear(today.getFullYear());
          birthdayB.setFullYear(today.getFullYear());
          
          // If birthday has passed this year, add a year for next occurrence
          if (birthdayA < today) birthdayA.setFullYear(today.getFullYear() + 1);
          if (birthdayB < today) birthdayB.setFullYear(today.getFullYear() + 1);
          
          return birthdayA.getTime() - birthdayB.getTime();
        }
        // Put friends with birthdays first
        if (a.birthday && !b.birthday) return -1;
        if (!a.birthday && b.birthday) return 1;
        return 0;
      });
  };

  const filteredFriends = sortAndFilterFriends(friends);
  
  // Open friend detail modal
  const handleOpenFriendDetail = (friend: Friend) => {
    setSelectedFriend(friend);
    setIsDetailModalOpen(true);
  };
  
  // Stats for both circles
  const bestFrienStats = calculateStats("bestfren");
  const workFrienStats = calculateStats("workfren");
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onAddFriend={() => setIsAddModalOpen(true)} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <UserCircle2 className="h-6 w-6 text-accent" />
                <h2 className="text-xl font-bold">Best Friends</h2>
              </div>
              <CircleProgress 
                stats={bestFrienStats} 
                category="bestfren" 
                maxFriends={MAX_FRIENDS_PER_CATEGORY} 
              />
              {bestFrienStats.total === 0 && (
                <p className="text-center mt-4 text-sm text-muted-foreground">
                  Add your closest friends to start tracking your relationships
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <BriefcaseBusiness className="h-6 w-6 text-secondary" />
                <h2 className="text-xl font-bold">Work Friends</h2>
              </div>
              <CircleProgress 
                stats={workFrienStats} 
                category="workfren" 
                maxFriends={MAX_FRIENDS_PER_CATEGORY} 
              />
              {workFrienStats.total === 0 && (
                <p className="text-center mt-4 text-sm text-muted-foreground">
                  Add your professional connections to nurture work relationships
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Search and filter */}
        <div className="mb-6">
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </div>
        
        {/* Friend lists */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Friends</TabsTrigger>
            <TabsTrigger value="bestfrens">Best Friends</TabsTrigger>
            <TabsTrigger value="workfrens">Work Friends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {friends.length === 0 ? (
              <EmptyCircleState 
                category="bestfren" 
                onAddFriend={() => setIsAddModalOpen(true)} 
              />
            ) : filteredFriends.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No friends match your current filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFriends.map(friend => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    onClick={() => handleOpenFriendDetail(friend)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="bestfrens">
            {bestFrienStats.total === 0 ? (
              <EmptyCircleState 
                category="bestfren" 
                onAddFriend={() => setIsAddModalOpen(true)} 
              />
            ) : filteredFriends.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No best friends match your current filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFriends.map(friend => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    onClick={() => handleOpenFriendDetail(friend)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="workfrens">
            {workFrienStats.total === 0 ? (
              <EmptyCircleState 
                category="workfren" 
                onAddFriend={() => setIsAddModalOpen(true)} 
              />
            ) : filteredFriends.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No work friends match your current filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFriends.map(friend => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    onClick={() => handleOpenFriendDetail(friend)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Friend Detail Modal */}
      <FriendDetail
        friend={selectedFriend}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onUpdateFriend={handleUpdateFriend}
        onDeleteFriend={handleDeleteFriend}
      />
      
      {/* Add Friend Modal */}
      <AddFriendDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddFriend={handleAddFriend}
      />
    </div>
  );
};

export default Index;
