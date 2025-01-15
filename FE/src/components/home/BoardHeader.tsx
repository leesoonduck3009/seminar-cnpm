import { useState } from "react";
import {
  Star,
  Users,
  Layout,
  ChevronDown,
  Filter,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import useBoardStore from "@/store/useBoardStore";
import ShareBoardModal from "../ShareBoardModal";
import { useToast } from "@/hooks/use-toast";

// Fake user data to simulate API responses
const FAKE_USERS = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
  },
  {
    id: "user-3",
    name: "Bob Wilson",
    email: "bob@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
  },
];

// Simulate API search delay
const simulateSearch = async (query: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return FAKE_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
  );
};

// Simulate API invite delay
const simulateInvite = async (email: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const user = FAKE_USERS.find((u) => u.email === email);
  if (!user) {
    throw new Error("User not found");
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: "normal",
    joinedAt: new Date().toISOString(),
  };
};

const BoardHeader = () => {
  const { activeBoard, updateMemberRole, removeMember } = useBoardStore();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getHeaderStyles = () => {
    if (!activeBoard) {
      return {
        header: "bg-pink-700",
        divider: "bg-pink-600",
        buttonHover: "hover:bg-pink-600",
        shareButton: "bg-pink-600 hover:bg-pink-500",
      };
    }

    if (activeBoard.backgroundImage) {
      return {
        header: "bg-black/50",
        divider: "bg-white/20",
        buttonHover: "hover:bg-white/20",
        shareButton: "bg-white/20 hover:bg-white/30",
      };
    }

    return {
      header: `${activeBoard.background} brightness-75`,
      divider: "bg-white/20",
      buttonHover: "hover:bg-white/20",
      shareButton: "bg-white/20 hover:bg-white/30",
    };
  };

  const styles = getHeaderStyles();

  const handleSearchUsers = async (query: string) => {
    if (query.length < 2) return [];
    try {
      const users = await simulateSearch(query);
      return users;
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: "Error",
        description: "Failed to search users",
        variant: "destructive",
      });
      return [];
    }
  };

  const handleInviteMember = async (
    email: string,
    role: "admin" | "normal"
  ) => {
    if (!activeBoard) return;

    setIsLoading(true);
    try {
      const newMember = await simulateInvite(email);

      // In real implementation, this would be handled by the API call
      // For now, we'll update the local state after the simulated API call
      const boardId = activeBoard.id;
      const response = await fetch(`/api/boards/${boardId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      if (!response.ok) throw new Error("Failed to invite member");

      toast({
        title: "Success",
        description: `Invited ${newMember.name} to the board`,
      });
    } catch (error) {
      console.error("Error inviting member:", error);
      toast({
        title: "Error",
        description: "Failed to invite member",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async (
    memberId: string,
    newRole: "admin" | "normal"
  ) => {
    if (!activeBoard) return;

    try {
      await updateMemberRole(activeBoard.id, memberId, newRole);
      toast({
        title: "Success",
        description: "Member role updated successfully",
      });
    } catch (error) {
      console.error("Error updating member role:", error);
      toast({
        title: "Error",
        description: "Failed to update member role",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!activeBoard) return;

    try {
      await removeMember(activeBoard.id, memberId);
      toast({
        title: "Success",
        description: "Member removed successfully",
      });
    } catch (error) {
      console.error("Error removing member:", error);
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <header
        className={cn(
          styles.header,
          "text-white p-2 flex items-center justify-between w-full h-14 shrink-0"
        )}
      >
        <div className="flex items-center space-x-4 min-w-0">
          <h1 className="text-lg font-semibold flex items-center truncate">
            <span className="truncate">{activeBoard?.title}</span>
            <Button
              variant="ghost"
              size="sm"
              className={cn("ml-2 shrink-0", styles.buttonHover)}
            >
              <Star className="h-4 w-4" />
            </Button>
          </h1>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Members Preview */}
            <div className="flex -space-x-1.5 mr-2">
              {activeBoard?.members.slice(0, 3).map((member) => (
                <Avatar
                  key={member.id}
                  className="h-8 w-8 border-2 border-white ring-0"
                >
                  <AvatarImage src={member.avatarUrl} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
              ))}
              {(activeBoard?.members.length || 0) > 3 && (
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium">
                  +{activeBoard!.members.length - 3}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className={cn(styles.buttonHover)}
              onClick={() => setIsShareModalOpen(true)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Chia sẻ</span>
            </Button>

            <div
              className={cn("h-6 w-px", styles.divider, "hidden sm:block")}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={styles.buttonHover}
                >
                  <Layout className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Bảng</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Calendar View</DropdownMenuItem>
                <DropdownMenuItem>Table View</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(styles.buttonHover, "hidden sm:flex")}
          >
            <Filter className="h-4 w-4 mr-1" />
            Bộ lọc
          </Button>

          <div className={cn("h-6 w-px", styles.divider)} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className={styles.buttonHover}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Cài đặt bảng</DropdownMenuItem>
              <DropdownMenuItem>Thông tin về bảng</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ShareBoardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        boardId={activeBoard?.id || 0}
        currentMembers={activeBoard?.members || []}
        onInviteMember={handleInviteMember}
        onUpdateMemberRole={handleUpdateRole}
        onRemoveMember={handleRemoveMember}
        isLoading={isLoading}
        onSearchUsers={handleSearchUsers}
      />
    </>
  );
};

export default BoardHeader;
