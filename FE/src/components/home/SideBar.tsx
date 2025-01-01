'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import BoardIcon from '@/components/icons/BoardIcon';
import MemberIcon from '@/components/icons/MemberIcon';
import useBoardStore from '@/store/useBoardStore';
import type { Board } from '@/types/board';

interface WorkspaceButtonProps {
  id: string;
  title: string;
  expanded?: boolean;
  onClick?: () => void;
}

const WorkspaceButton = ({
  id,
  title,
  expanded = false,
  onClick,
}: WorkspaceButtonProps) => {
  return (
    <div className='flex py-3 px-4 border-b border-opacity-20 border-[#d5d5d5] gap-2 items-center mt-2'>
      <div className='h-10 w-10 flex items-center justify-center font-bold text-white text-[18px] rounded-[6px] bg-gradient-to-b from-[#403294] to-[#0747a6]'>
        {title.charAt(0).toUpperCase()}
      </div>
      <div className='flex-1 min-w-0'>
        <p className='text-[14px] font-semibold text-white truncate'>{title}</p>
      </div>
      <button
        onClick={onClick}
        className='p-1 hover:bg-white/10 rounded-md transition-colors'
      >
        <ChevronDown
          className={cn(
            'w-4 h-4 text-white/60 transition-transform',
            expanded && 'transform rotate-180'
          )}
        />
      </button>
    </div>
  );
};

interface BoardLinkProps {
  board: Board;
  isActive: boolean;
}

const BoardLink = React.memo(({ board, isActive }: BoardLinkProps) => {
  const linkStyle = cn(
    'flex cursor-pointer px-4 py-2',
    isActive ? 'bg-white/30' : 'hover:bg-white hover:bg-opacity-20',
    'gap-[10px] items-center transition-colors'
  );

  const getBoardPreview = () => {
    if (board.backgroundImage) {
      return {
        style: {
          backgroundImage: `url(${board.backgroundImage})`,
          backgroundSize: 'cover',
        },
        className: 'w-8 h-8 rounded flex-shrink-0',
      };
    }

    return {
      className: cn('w-8 h-8 rounded flex-shrink-0', board.background),
    };
  };

  return (
    <Link href={`/board/${board.id}`} className={linkStyle}>
      <div {...getBoardPreview()} />
      <p className='font-semibold text-white text-[14px] truncate'>
        {board.title}
      </p>
    </Link>
  );
});

BoardLink.displayName = 'BoardLink';

interface SideBarProps {
  className?: string;
}

const SideBar = ({ className }: SideBarProps) => {
  const pathname = usePathname();
  const { boards, setActiveBoardById } = useBoardStore();
  const [isWorkspaceExpanded, setIsWorkspaceExpanded] = React.useState(true);

  useEffect(() => {
    const boardIdMatch = pathname.match(/\/board\/(\d+)/);
    if (boardIdMatch) {
      const boardId = parseInt(boardIdMatch[1]);
      setActiveBoardById(boardId);
    } else {
      setActiveBoardById(null);
    }
  }, [pathname, setActiveBoardById]);

  return (
    <div
      className={cn(
        'w-[280px] flex-shrink-0 bg-[#9F246E]',
        'border-r border-t border-opacity-20 border-[#d5d5d5]',
        'h-screen flex flex-col',
        className
      )}
    >
      <WorkspaceButton
        id='workspace-1'
        title='Taskly'
        expanded={isWorkspaceExpanded}
        onClick={() => setIsWorkspaceExpanded(!isWorkspaceExpanded)}
      />

      <ScrollArea className='flex-1'>
        <div className='flex flex-col py-4'>
          <div className='space-y-1'>
            <p className='text-white/60 text-sm px-4 mb-2'>
              Đang xem Không gian làm việc
            </p>

            <Link href='/boards' className='w-full'>
              <div
                className={cn(
                  'flex cursor-pointer px-4 py-2',
                  pathname === '/boards'
                    ? 'bg-white/30'
                    : 'hover:bg-white hover:bg-opacity-20',
                  'gap-[10px] items-center'
                )}
              >
                <BoardIcon />
                <p className='font-semibold text-white text-[14px]'>Bảng</p>
              </div>
            </Link>

            <div className='flex cursor-pointer px-4 py-2 hover:bg-white hover:bg-opacity-20 gap-[10px] items-center'>
              <MemberIcon />
              <p className='font-semibold text-white text-[14px]'>Thành viên</p>
            </div>
          </div>

          {isWorkspaceExpanded && (
            <div className='mt-6'>
              <div className='px-4 flex justify-between items-center'>
                <p className='text-white/60 text-sm'>Các bảng của tôi</p>
                <ChevronDown className='w-4 h-4 text-white/60' />
              </div>

              <div className='mt-2'>
                {boards.map((board) => (
                  <BoardLink
                    key={board.id}
                    board={board}
                    isActive={pathname === `/board/${board.id}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SideBar;
