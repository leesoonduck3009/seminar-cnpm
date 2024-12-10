'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pencil,
  Trash2,
  GripVertical,
  Paperclip,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CardDetailModal from './CardDetailModal';
import type { Card as CardType } from '@/types/card';
import type { Column } from '@/types/column';

interface CardProps {
  card: CardType;
  column: Column;
  index: number;
  onUpdate: (updatedCard: CardType) => void;
  onDelete: () => void;
}

const Card = React.memo(
  ({ card, column, index, onUpdate, onDelete }: CardProps) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitle, setEditTitle] = useState(card.title);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
      if (contentRef.current) {
        setHeight(contentRef.current.offsetHeight);
      }
    }, [card]);

    useEffect(() => {
      if (isEditingTitle && titleInputRef.current) {
        titleInputRef.current.focus();
        titleInputRef.current.select();
      }
    }, [isEditingTitle]);

    const handleUpdateTitle = useCallback(() => {
      if (editTitle.trim() && editTitle !== card.title) {
        onUpdate({
          ...card,
          title: editTitle.trim(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        setEditTitle(card.title);
      }
      setIsEditingTitle(false);
    }, [editTitle, card, onUpdate]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleUpdateTitle();
        } else if (e.key === 'Escape') {
          setEditTitle(card.title);
          setIsEditingTitle(false);
        }
      },
      [handleUpdateTitle, card.title]
    );

    const handleCardClick = useCallback(
      (e: React.MouseEvent) => {
        if (
          e.target instanceof Element &&
          (e.target.closest('button') ||
            isEditingTitle ||
            e.target.closest('input'))
        ) {
          return;
        }
        setIsModalOpen(true);
      },
      [isEditingTitle]
    );

    const renderCardBadges = useCallback(() => {
      const badges = [];

      if (card.dueDate) {
        const dueDate = new Date(card.dueDate);
        const isOverdue = dueDate < new Date();
        badges.push(
          <div
            key='due-date'
            className={cn(
              'flex items-center gap-1 text-xs px-1.5 py-0.5 rounded',
              isOverdue
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
            )}
          >
            <Clock className='w-3 h-3' />
            {dueDate.toLocaleDateString()}
          </div>
        );
      }

      if (card.attachments?.length > 0) {
        badges.push(
          <div
            key='attachments'
            className='flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-700'
          >
            <Paperclip className='w-3 h-3' />
            {card.attachments.length}
          </div>
        );
      }

      if (card.comments?.length > 0) {
        badges.push(
          <div
            key='comments'
            className='flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-700'
          >
            <MessageSquare className='w-3 h-3' />
            {card.comments.length}
          </div>
        );
      }

      return badges;
    }, [card.dueDate, card.attachments, card.comments]);

    return (
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={{
              ...provided.draggableProps.style,
              height: snapshot.isDragging ? height : 'auto',
            }}
            className={cn(
              'mb-2 last:mb-0 group transition-transform',
              snapshot.isDragging && 'rotate-[2deg] scale-[1.02]'
            )}
          >
            <div
              ref={contentRef}
              className={cn(
                'bg-white rounded-lg border shadow-sm hover:shadow-md transition-all',
                snapshot.isDragging &&
                  'shadow-xl ring-2 ring-blue-400 ring-offset-2',
                !snapshot.isDragging && 'hover:ring-1 hover:ring-blue-200'
              )}
              onClick={handleCardClick}
            >
              <div className='p-3 group relative min-h-[40px]'>
                {/* Labels */}
                {card.labels?.length > 0 && (
                  <div className='flex flex-wrap gap-1 mb-2'>
                    {card.labels.map((label) => (
                      <div
                        key={label.id}
                        className='h-2 w-8 rounded-full'
                        style={{ backgroundColor: label.color }}
                        title={label.name}
                      />
                    ))}
                  </div>
                )}

                {/* Card Title and Handle */}
                <div className='flex justify-center items-center gap-2'>
                  <div
                    {...provided.dragHandleProps}
                    className={cn(
                      'opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity',
                      'cursor-grab active:cursor-grabbing',
                      snapshot.isDragging && 'opacity-100'
                    )}
                  >
                    <GripVertical className='w-4 h-4' />
                  </div>
                  <div className='flex-1'>
                    {isEditingTitle ? (
                      <div className='flex gap-2'>
                        <Input
                          ref={titleInputRef}
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className='text-sm flex-1'
                          onBlur={handleUpdateTitle}
                          onKeyDown={handleKeyDown}
                        />
                      </div>
                    ) : (
                      <p className='text-sm break-words whitespace-pre-wrap pr-16'>
                        {card.title}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Action Buttons */}
                {!isEditingTitle && (
                  <div
                    className={cn(
                      'absolute right-2 top-2 hidden group-hover:flex gap-1',
                      'bg-white/90 backdrop-blur-sm rounded-md shadow-sm',
                      'transition-opacity duration-200',
                      snapshot.isDragging && 'hidden'
                    )}
                  >
                    <Button
                      size='sm'
                      variant='ghost'
                      className='h-6 w-6 p-0 hover:bg-gray-100'
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditingTitle(true);
                      }}
                    >
                      <Pencil className='w-4 h-4' />
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      className='h-6 w-6 p-0 text-red-600 hover:bg-red-50 hover:text-red-700'
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                )}

                {/* Card Badges */}
                {(card.dueDate ||
                  card.attachments?.length > 0 ||
                  card.comments?.length > 0) && (
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {renderCardBadges()}
                  </div>
                )}

                {/* Card Members */}
                {card.members?.length > 0 && (
                  <div className='flex -space-x-2 mt-2'>
                    {card.members.map((member) => (
                      <div
                        key={member.id}
                        className='w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600'
                        title={member.name}
                      >
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className='w-full h-full rounded-full object-cover'
                          />
                        ) : (
                          member.name.charAt(0)
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Card Detail Modal */}
            <CardDetailModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              card={card}
              column={column}
              onUpdate={onUpdate}
            />
          </div>
        )}
      </Draggable>
    );
  }
);

Card.displayName = 'Card';

export default Card;
