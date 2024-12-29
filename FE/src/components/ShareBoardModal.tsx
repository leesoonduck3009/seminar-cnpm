'use client';
import React, { useState, useEffect } from 'react';
import { Copy, X, Globe2, Lock } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import debounce from 'lodash/debounce';
import type { User, BoardMember } from '@/store/useBoardStore';

interface ShareBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: number;
  currentMembers: BoardMember[];
  onInviteMember: (email: string, role: 'admin' | 'normal') => Promise<void>;
  onUpdateMemberRole: (
    memberId: string,
    role: 'admin' | 'normal'
  ) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
  isLoading: boolean;
  onSearchUsers: (query: string) => Promise<User[]>;
}

const ShareBoardModal = ({
  isOpen,
  onClose,
  boardId,
  currentMembers,
  onInviteMember,
  onUpdateMemberRole,
  onRemoveMember,
  isLoading,
  onSearchUsers,
}: ShareBoardModalProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'normal'>('normal');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<BoardMember | null>(
    null
  );
  const { toast } = useToast();

  // Memoize the debounced search function
  const debouncedSearch = React.useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.length < 2) {
          setSearchResults([]);
          return;
        }

        setIsSearching(true);
        try {
          const results = await onSearchUsers(query);
          // Filter out users who are already members
          const filteredResults = results.filter(
            (user) => !currentMembers.some((member) => member.id === user.id)
          );
          setSearchResults(filteredResults);
        } catch (error) {
          console.error('Error searching users:', error);
          toast({
            title: 'Error',
            description: 'Failed to search users',
            variant: 'destructive',
          });
        } finally {
          setIsSearching(false);
        }
      }, 300),
    [onSearchUsers, currentMembers, toast]
  );

  useEffect(() => {
    if (email) {
      debouncedSearch(email);
    } else {
      setSearchResults([]);
    }

    // Cleanup
    return () => {
      debouncedSearch.cancel();
    };
  }, [email, debouncedSearch]);

  const handleInvite = async () => {
    if (!email.trim()) return;

    try {
      await onInviteMember(email, role);
      setEmail('');
      setSelectedUser(null);
      setSearchResults([]);
      toast({
        title: 'Success',
        description: 'Invitation sent successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateRole = async (
    memberId: string,
    newRole: 'admin' | 'normal'
  ) => {
    try {
      await onUpdateMemberRole(memberId, newRole);
      toast({
        title: 'Success',
        description: 'Member role updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update member role',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      await onRemoveMember(memberToRemove.id);
      setShowRemoveDialog(false);
      setMemberToRemove(null);
      toast({
        title: 'Success',
        description: 'Member removed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove member',
        variant: 'destructive',
      });
    }
  };

  const copyInviteLink = async () => {
    const inviteLink = `${window.location.origin}/board/${boardId}/join`;
    await navigator.clipboard.writeText(inviteLink);
    toast({
      title: 'Success',
      description: 'Invite link copied to clipboard!',
    });
  };

  const selectUserFromSearch = (user: User) => {
    setSelectedUser(user);
    setEmail(user.email);
    setSearchResults([]);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className='max-w-md'>
          <div className='flex flex-col gap-6'>
            {/* Title with default close button */}
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold'>Chia sẻ bảng</h2>
            </div>

            {/* Share Settings */}
            <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
              <Globe2 className='h-5 w-5 text-gray-500' />
              <div className='flex-1'>
                <p className='text-sm font-medium'>Quyền truy cập bảng</p>
                <p className='text-xs text-gray-500'>
                  Chỉ thành viên được mời mới có thể xem và chỉnh sửa
                </p>
              </div>
              <Lock className='h-5 w-5 text-gray-500' />
            </div>

            {/* Invite Section */}
            <div className='space-y-2'>
              <div className='flex gap-2'>
                <div className='relative flex-1'>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Địa chỉ email hoặc tên'
                    className='pr-24'
                    disabled={isLoading}
                  />
                  {isSearching && (
                    <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600' />
                    </div>
                  )}
                </div>
                <Select
                  value={role}
                  onValueChange={(value: 'admin' | 'normal') => setRole(value)}
                >
                  <SelectTrigger className='w-[130px]'>
                    <SelectValue placeholder='Quyền' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='normal'>Thành viên</SelectItem>
                    <SelectItem value='admin'>Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className='border rounded-md mt-1 max-h-48 overflow-y-auto'>
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className='flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer'
                      onClick={() => selectUserFromSearch(user)}
                    >
                      <Avatar className='h-6 w-6'>
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium truncate'>
                          {user.name}
                        </p>
                        <p className='text-xs text-gray-500 truncate'>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              className='w-full'
              disabled={!email || isLoading}
              onClick={handleInvite}
            >
              {isLoading ? 'Đang xử lý...' : 'Chia sẻ'}
            </Button>

            {/* Invite Link Section */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <h3 className='text-sm font-medium'>Liên kết mời</h3>
                <Button variant='outline' size='sm' onClick={copyInviteLink}>
                  <Copy className='h-4 w-4 mr-2' />
                  Sao chép liên kết
                </Button>
              </div>
              <p className='text-sm text-gray-500'>
                Bất kỳ ai có liên kết đều có thể tham gia với tư cách thành viên
              </p>
            </div>

            <Separator />

            {/* Current Members Section */}
            <div className='space-y-3'>
              <h3 className='text-sm font-medium'>
                Thành viên của bảng ({currentMembers.length})
              </h3>
              <div className='space-y-2'>
                {currentMembers.map((member) => (
                  <div key={member.id} className='flex items-center gap-2'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={member.avatarUrl} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate'>
                        {member.name}
                      </p>
                      <p className='text-xs text-gray-500 truncate'>
                        {member.email}
                      </p>
                    </div>
                    <Select
                      value={member.role}
                      onValueChange={(value: 'admin' | 'normal') =>
                        handleUpdateRole(member.id, value)
                      }
                    >
                      <SelectTrigger className='w-[130px]'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='normal'>Thành viên</SelectItem>
                        <SelectItem value='admin'>Quản trị viên</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-red-600 hover:text-red-700 hover:bg-red-50'
                      onClick={() => {
                        setMemberToRemove(member);
                        setShowRemoveDialog(true);
                      }}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa thành viên</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa {memberToRemove?.name} khỏi bảng này? Họ
              sẽ không thể truy cập bảng này nữa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowRemoveDialog(false)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              className='bg-red-600 hover:bg-red-700'
              onClick={handleRemoveMember}
            >
              Xóa thành viên
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ShareBoardModal;
