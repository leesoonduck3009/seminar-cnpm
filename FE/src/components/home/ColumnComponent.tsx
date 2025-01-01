// ColumnComponent.tsx
'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, MoreVertical, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Card from './CardComponent';
import { StrictModeDroppable } from '@/components/StrictModeDroppable';
import type { Column as ColumnType } from '@/types/column';
import { useToast } from '@/hooks/use-toast';

interface ColumnProps {
  column: ColumnType;
  index: number;
  onAddCard: (columnId: string, title: string) => Promise<void>;
  onUpdateCard: (columnId: string, cardId: string, data: any) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onUpdateColumn: (columnId: string, title: string) => void;
}

const Column = ({
  column,
  index,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onDeleteColumn,
  onUpdateColumn,
}: ColumnProps) => {
  const { toast } = useToast();
  const [newCardContent, setNewCardContent] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isAddingCard && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isAddingCard]);

  const handleAddCard = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!newCardContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddCard(column.id, newCardContent.trim());
      setNewCardContent('');
      setIsAddingCard(false);
      toast({
        title: 'Success',
        description: 'Card added successfully',
      });
    } catch (error) {
      console.error('Error adding card:', error);
      toast({
        title: 'Error',
        description: 'Failed to add card',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTitle = useCallback(() => {
    if (editTitle.trim() && editTitle !== column.title) {
      onUpdateColumn(column.id, editTitle.trim());
    } else {
      setEditTitle(column.title);
    }
    setIsEditingTitle(false);
  }, [editTitle, column.id, column.title, onUpdateColumn]);

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (isEditingTitle) {
          handleUpdateTitle();
        } else if (newCardContent.trim()) {
          await handleAddCard();
        }
      } else if (e.key === 'Escape') {
        if (isEditingTitle) {
          setIsEditingTitle(false);
          setEditTitle(column.title);
        } else {
          setIsAddingCard(false);
          setNewCardContent('');
        }
      }
    },
    [isEditingTitle, handleUpdateTitle, newCardContent, handleAddCard]
  );

  const cancelAddCard = () => {
    setIsAddingCard(false);
    setNewCardContent('');
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className='w-72 flex-shrink-0'
        >
          <div
            className={`bg-white rounded-lg shadow-sm ${
              snapshot.isDragging ? 'shadow-xl ring-2 ring-blue-400' : ''
            }`}
          >
            <div
              {...provided.dragHandleProps}
              className='p-2 flex justify-between items-center border-b group/header cursor-grab active:cursor-grabbing'
            >
              {isEditingTitle ? (
                <div className='flex-1 flex items-center gap-2'>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className='h-7 text-sm font-medium'
                    autoFocus
                    onKeyDown={handleKeyDown}
                    onBlur={handleUpdateTitle}
                  />
                </div>
              ) : (
                <h3
                  className='font-medium px-1 py-0.5 rounded hover:bg-gray-100 cursor-pointer'
                  onClick={() => setIsEditingTitle(true)}
                >
                  {column.title}
                </h3>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-8 w-8 p-0 opacity-0 group-hover/header:opacity-100 transition-opacity'
                  >
                    <MoreVertical className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-48'>
                  <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                    Rename List
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='text-red-600 focus:text-red-600 focus:bg-red-50'
                    onClick={() => onDeleteColumn(column.id)}
                  >
                    Delete List
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <StrictModeDroppable droppableId={column.id} type='card'>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-2 transition-colors rounded-md mx-1 my-1 min-h-[2rem]
                    ${
                      snapshot.isDraggingOver
                        ? 'bg-blue-50/80 backdrop-blur-sm'
                        : ''
                    }
                  `}
                >
                  {column.cards.map((card, index) => (
                    <Card
                      key={card.id}
                      card={card}
                      index={index}
                      column={column}
                      onUpdate={(newContent) =>
                        onUpdateCard(column.id, card.id, newContent)
                      }
                      onDelete={() => onDeleteCard(column.id, card.id)}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </StrictModeDroppable>

            <div className='border-t'>
              {isAddingCard ? (
                <form onSubmit={handleAddCard} className='p-2'>
                  <textarea
                    ref={textareaRef}
                    value={newCardContent}
                    onChange={(e) => setNewCardContent(e.target.value)}
                    placeholder='Nhập tiêu đề cho thẻ'
                    className='w-full min-h-[60px] p-2 text-sm border rounded-md mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400'
                    onKeyDown={handleKeyDown}
                  />
                  <div className='flex gap-2'>
                    <Button
                      type='submit'
                      size='sm'
                      disabled={!newCardContent.trim() || isSubmitting}
                    >
                      {isSubmitting ? 'Đang thêm...' : 'Thêm thẻ'}
                    </Button>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={cancelAddCard}
                      disabled={isSubmitting}
                    >
                      <X className='w-4 h-4' />
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  variant='ghost'
                  className='w-full flex items-center justify-start px-4 py-2 hover:bg-gray-100 h-auto font-normal text-gray-600'
                  onClick={() => setIsAddingCard(true)}
                >
                  <PlusCircle className='w-4 h-4 mr-2' />
                  Thêm thẻ
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
