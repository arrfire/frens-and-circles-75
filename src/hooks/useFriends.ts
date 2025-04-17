
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Friend } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function useFriends() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      // Return empty array if not logged in
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('friends')
        .select(`
          *,
          friend_favorite_artists (
            artist_name
          )
        `);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error loading friends",
          description: error.message,
        });
        return [];
      }

      // Map database fields to our Friend type
      return data.map(friend => ({
        id: friend.id,
        name: friend.name,
        avatar: friend.avatar || '',
        category: friend.category,
        lastInteraction: friend.last_interaction,
        status: friend.status,
        notes: friend.notes || '',
        contactFrequency: friend.contact_frequency,
        birthday: friend.birthday,
        favoriteArtists: friend.friend_favorite_artists?.map(fa => fa.artist_name) || []
      })) as Friend[];
    },
  });

  const addFriend = useMutation({
    mutationFn: async (newFriend: Omit<Friend, "id">) => {
      if (!user) throw new Error("User must be logged in");
      
      // First insert the friend with correct field mapping
      const { data: friendData, error: friendError } = await supabase
        .from('friends')
        .insert({
          user_id: user.id,
          name: newFriend.name,
          category: newFriend.category,
          avatar: newFriend.avatar,
          contact_frequency: newFriend.contactFrequency,
          status: newFriend.status,
          notes: newFriend.notes,
          birthday: newFriend.birthday,
          last_interaction: newFriend.lastInteraction
        })
        .select()
        .single();

      if (friendError) throw friendError;

      // Then insert their favorite artists if any
      if (newFriend.favoriteArtists.length > 0) {
        const { error: artistsError } = await supabase
          .from('friend_favorite_artists')
          .insert(
            newFriend.favoriteArtists.map(artist => ({
              friend_id: friendData.id,
              artist_name: artist
            }))
          );

        if (artistsError) throw artistsError;
      }

      return friendData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      toast({
        title: "Success",
        description: "Friend added successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error adding friend",
        description: error.message,
      });
    },
  });

  const updateFriend = useMutation({
    mutationFn: async (friend: Friend) => {
      // Update friend details with correct field mapping
      const { error: friendError } = await supabase
        .from('friends')
        .update({
          name: friend.name,
          category: friend.category,
          avatar: friend.avatar,
          contact_frequency: friend.contactFrequency,
          status: friend.status,
          notes: friend.notes,
          birthday: friend.birthday,
          last_interaction: friend.lastInteraction
        })
        .eq('id', friend.id);

      if (friendError) throw friendError;

      // Delete existing artists and insert new ones
      const { error: deleteError } = await supabase
        .from('friend_favorite_artists')
        .delete()
        .eq('friend_id', friend.id);

      if (deleteError) throw deleteError;

      if (friend.favoriteArtists.length > 0) {
        const { error: artistsError } = await supabase
          .from('friend_favorite_artists')
          .insert(
            friend.favoriteArtists.map(artist => ({
              friend_id: friend.id,
              artist_name: artist
            }))
          );

        if (artistsError) throw artistsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      toast({
        title: "Success",
        description: "Friend updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error updating friend",
        description: error.message,
      });
    },
  });

  const deleteFriend = useMutation({
    mutationFn: async (friendId: string) => {
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', friendId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      toast({
        title: "Success",
        description: "Friend deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error deleting friend",
        description: error.message,
      });
    },
  });

  return {
    friends,
    isLoading,
    addFriend,
    updateFriend,
    deleteFriend,
  };
}
