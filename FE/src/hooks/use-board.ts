import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import useBoardStore from "@/store/useBoardStore";
import { BoardService } from "@/services/boardService";
import { useToast } from "@/hooks/use-toast";
import { auth, firebaseFunction } from "@/helpers/firebase";

export const useBoards = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { boards, setBoards, setIsLoading } = useBoardStore();

  useEffect(() => {
    const fetchBoards = async () => {
      //   if (!currentUser) return;

      setIsLoading(true);
      try {
        const fetchedBoards = await BoardService.getBoards(
          auth.currentUser?.uid!
        );
        console.log("fetchedBoards" + fetchedBoards);
        setBoards(fetchedBoards);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch boards",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoards();
  }, [currentUser, setBoards, setIsLoading, toast]);

  const allBoards = boards;

  return { allBoards };
};
