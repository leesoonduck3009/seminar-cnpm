import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  LayoutList,
  AlignLeft,
  Clock,
  Users,
  Tag,
  Paperclip,
  MessageSquare,
  Activity as ActivityIcon,
  Archive,
  X,
  CheckSquare,
  Calendar,
  CopyPlus,
  Eye,
  Share2,
  Filter,
  Smile,
  Copy,
  Image,
  ImageIcon,
  Type,
  List,
  Bold,
  Italic,
  Link,
  Plus,
  MoreHorizontal,
  MessageCircle,
} from 'lucide-react';
import type { Card, Column, Comment, ActivityLog } from '@/types/boards';
import { Textarea } from '@/components/ui/textarea';

interface RichTextEditorProps {
  className?: string;
  initialContent?: string;
  placeholder?: string;
  onSave: (content: string) => void;
  onCancel: () => void;
  showPreview?: boolean;
  minRows?: number;
}

const RichTextEditor = ({
  className,
  initialContent = '',
  placeholder,
  onSave,
  onCancel,
  showPreview = true,
  minRows = 3,
}: RichTextEditorProps) => {
  const [content, setContent] = useState(initialContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Set cursor to end of text
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, []);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(textarea.scrollHeight, 80) + 'px';
    }
  }, [content]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleSave = () => {
    if (content.trim()) {
      onSave(content);
    }
  };

  const handleCancel = () => {
    setContent(initialContent);
    onCancel();
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className='flex items-center gap-1 border bg-white rounded p-1'>
        <Button variant='ghost' size='sm' className='h-8 px-2'>
          <Type className='w-4 h-4' />
        </Button>
        <Button variant='ghost' size='sm' className='h-8 px-2'>
          <Bold className='w-4 h-4' />
        </Button>
        <Button variant='ghost' size='sm' className='h-8 px-2'>
          <Italic className='w-4 h-4' />
        </Button>
        <Button variant='ghost' size='sm' className='h-8 px-2'>
          <Link className='w-4 h-4' />
        </Button>
        <Button variant='ghost' size='sm' className='h-8 px-2'>
          <List className='w-4 h-4' />
        </Button>
        <Button variant='ghost' size='sm' className='h-8 px-2'>
          <ImageIcon className='w-4 h-4' />
        </Button>
        <Button variant='ghost' size='sm' className='h-8 px-2'>
          <Smile className='w-4 h-4' />
        </Button>
        <Button variant='ghost' size='sm' className='h-8 px-2'>
          <Filter className='w-4 h-4' />
        </Button>
      </div>

      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className='min-h-[80px] resize-none bg-white focus-visible:ring-2 focus-visible:ring-blue-500'
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        rows={minRows}
      />

      <div className='flex gap-2'>
        <Button
          onClick={handleSave}
          variant='secondary'
          disabled={!content.trim()}
        >
          Lưu
        </Button>
        <Button variant='ghost' onClick={handleCancel}>
          Hủy
        </Button>
        {showPreview && (
          <>
            <div className='flex-1' />
            <Button variant='ghost' size='sm'>
              <Eye className='w-4 h-4 mr-2' />
              Xem trước
            </Button>
          </>
        )}
        <div className='text-xs text-gray-500 self-center ml-2'>
          Nhấn ⌘+Enter để lưu
        </div>
      </div>
    </div>
  );
};

interface CommentProps {
  comment: Comment;
  onUpdate: (updatedComment: Comment) => void;
  onDelete: (commentId: string) => void;
}

const CommentItem = ({ comment, onUpdate, onDelete }: CommentProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (content: string) => {
    onUpdate({
      ...comment,
      content,
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  return (
    <div className='flex gap-3'>
      <div className='w-8 h-8 rounded-full bg-gray-200 flex-shrink-0' />
      <div className='flex-1'>
        <div className='flex items-start justify-between'>
          <div>
            <div className='font-medium'>
              {comment.author?.name || 'Anonymous'}
            </div>
            <div className='text-sm text-gray-500'>
              {new Date(comment.createdAt).toLocaleString()}
              {comment.updatedAt &&
                comment.updatedAt !== comment.createdAt &&
                ' (đã chỉnh sửa)'}
            </div>
          </div>
          <Button
            variant='ghost'
            size='sm'
            className='opacity-0 group-hover:opacity-100 transition-opacity'
          >
            <MoreHorizontal className='w-4 h-4' />
          </Button>
        </div>

        {isEditing ? (
          <RichTextEditor
            initialContent={comment.content}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
            showPreview={false}
            className='mt-2'
          />
        ) : (
          <div
            className='mt-1 p-2 hover:bg-gray-100 rounded cursor-pointer group'
            onClick={() => setIsEditing(true)}
          >
            {comment.content}
          </div>
        )}
      </div>
    </div>
  );
};

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card;
  column?: Column;
  onUpdate: (updatedCard: Card) => void;
}

export default function CardDetailModal({
  isOpen,
  onClose,
  card: initialCard,
  column,
  onUpdate,
}: CardDetailModalProps) {
  const [card, setCard] = useState(initialCard);
  const [title, setTitle] = useState(initialCard.title);
  const [description, setDescription] = useState(initialCard.description || '');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCard(initialCard);
    setTitle(initialCard.title);
    setDescription(initialCard.description || '');
  }, [initialCard]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleUpdateTitle = () => {
    if (title.trim() && title !== card.title) {
      const newActivity: ActivityLog = {
        id: `activity-${Date.now()}`,
        type: 'update',
        content: 'updated title',
        createdAt: new Date().toISOString(),
        author: {
          id: 'current-user',
          name: 'You',
        },
      };

      const updatedCard = {
        ...card,
        title: title.trim(),
        updatedAt: new Date().toISOString(),
        activities: [...(card.activities || []), newActivity],
      };

      setCard(updatedCard);
      onUpdate(updatedCard);
    } else {
      setTitle(card.title);
    }
    setIsEditingTitle(false);
  };

  const handleUpdateDescription = (content: string) => {
    if (content !== card.description) {
      const isNew = !card.description;
      const newActivity: ActivityLog = {
        id: `activity-${Date.now()}`,
        type: 'update',
        content: isNew ? 'added description' : 'updated description',
        createdAt: new Date().toISOString(),
        author: {
          id: 'current-user',
          name: 'You',
        },
      };

      const updatedCard = {
        ...card,
        description: content.trim(),
        updatedAt: new Date().toISOString(),
        activities: [...(card.activities || []), newActivity],
      };

      setCard(updatedCard);
      setDescription(content.trim());
      onUpdate(updatedCard);
    }
    setIsEditingDescription(false);
  };

  const handleSaveComment = (content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      author: {
        id: 'current-user',
        name: 'You',
      },
    };

    const newActivity: ActivityLog = {
      id: `activity-${Date.now()}`,
      type: 'comment',
      content: 'added a comment',
      createdAt: new Date().toISOString(),
      author: newComment.author,
    };

    const updatedCard = {
      ...card,
      comments: [...(card.comments || []), newComment],
      activities: [...(card.activities || []), newActivity],
      updatedAt: new Date().toISOString(),
    };

    setCard(updatedCard);
    onUpdate(updatedCard);
    setIsEditingComment(false);
  };

  const handleUpdateComment = (updatedComment: Comment) => {
    const newActivity: ActivityLog = {
      id: `activity-${Date.now()}`,
      type: 'update',
      content: 'đã chỉnh sửa một bình luận',
      createdAt: new Date().toISOString(),
      author: updatedComment.author,
    };

    onUpdate({
      ...card,
      comments:
        card.comments?.map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment
        ) || [],
      activities: [...(card.activities || []), newActivity],
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDeleteComment = (commentId: string) => {
    const comment = card.comments?.find((c) => c.id === commentId);
    if (!comment) return;

    const newActivity: ActivityLog = {
      id: `activity-${Date.now()}`,
      type: 'delete',
      content: 'đã xóa một bình luận',
      createdAt: new Date().toISOString(),
      author: comment.author,
    };

    onUpdate({
      ...card,
      comments: card.comments?.filter((c) => c.id !== commentId) || [],
      activities: [...(card.activities || []), newActivity],
      updatedAt: new Date().toISOString(),
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='max-w-4xl p-0 gap-0 max-h-[calc(100vh-2rem)] flex flex-col'>
        <div className='flex-1 min-h-0 flex'>
          {/* Main Content */}
          <div className='flex-1 flex flex-col overflow-hidden'>
            {/* Header */}
            <div className='flex items-start gap-4 p-6 pb-4'>
              <LayoutList className='w-6 h-6 mt-1 text-gray-500 flex-shrink-0' />
              <div className='flex-1 min-w-0'>
                {isEditingTitle ? (
                  <div>
                    <Input
                      ref={titleInputRef}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className='text-xl font-medium mb-2'
                      onBlur={handleUpdateTitle}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateTitle();
                        } else if (e.key === 'Escape') {
                          setTitle(card.title);
                          setIsEditingTitle(false);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <h2
                    className='text-xl font-medium mb-2 hover:bg-gray-100 px-2 py-1 -mx-2 rounded cursor-pointer truncate'
                    onClick={() => setIsEditingTitle(true)}
                  >
                    {title}
                  </h2>
                )}
                <p className='text-sm text-gray-600'>
                  trong danh sách{' '}
                  <span className='underline cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded'>
                    {column?.title || 'No List'}
                  </span>
                </p>
              </div>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className='flex-1'>
              <div className='px-6 pb-6 space-y-8'>
                {/* Description Section */}
                <div className='flex gap-4'>
                  <AlignLeft className='w-6 h-6 text-gray-500 flex-shrink-0' />
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <h3 className='text-base font-medium'>Mô tả</h3>
                      {!isEditingDescription && description && (
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setIsEditingDescription(true)}
                        >
                          Chỉnh sửa
                        </Button>
                      )}
                    </div>
                    {isEditingDescription ? (
                      <RichTextEditor
                        initialContent={description}
                        placeholder='Thêm mô tả chi tiết hơn...'
                        onSave={handleUpdateDescription}
                        onCancel={() => setIsEditingDescription(false)}
                      />
                    ) : (
                      <div
                        onClick={() => setIsEditingDescription(true)}
                        className='min-h-[52px] p-3 bg-white/50 hover:bg-white rounded cursor-pointer transition-colors border'
                      >
                        {description || (
                          <span className='text-gray-500'>
                            Thêm mô tả chi tiết hơn...
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Activity Section */}
                <div className='flex gap-4'>
                  <ActivityIcon className='w-6 h-6 text-gray-500 flex-shrink-0' />
                  <div className='flex-1'>
                    <Tabs defaultValue='comments' className='w-full'>
                      <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-base font-medium flex items-center gap-2'>
                          <MessageCircle className='w-5 h-5' />
                          Hoạt động
                        </h3>
                        <TabsList>
                          <TabsTrigger value='comments' className='text-sm'>
                            Bình luận
                          </TabsTrigger>
                          <TabsTrigger value='history' className='text-sm'>
                            Lịch sử
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      <TabsContent value='comments' className='mt-0 space-y-4'>
                        {isEditingComment ? (
                          <div className='flex gap-3'>
                            <div className='w-8 h-8 rounded-full bg-gray-200 flex-shrink-0' />
                            <div className='flex-1'>
                              <RichTextEditor
                                placeholder='Viết bình luận...'
                                onSave={handleSaveComment}
                                onCancel={() => setIsEditingComment(false)}
                                showPreview={false}
                                minRows={2}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className='flex gap-3'>
                            <div className='w-8 h-8 rounded-full bg-gray-200 flex-shrink-0' />
                            <div
                              onClick={() => setIsEditingComment(true)}
                              className='flex-1 min-h-[54px] p-3 border bg-white/50 hover:bg-white rounded cursor-pointer transition-colors'
                            >
                              <span className='text-gray-500'>
                                Viết bình luận...
                              </span>
                            </div>
                          </div>
                        )}

                        <div className='space-y-4'>
                          {card.comments?.map((comment) => (
                            <CommentItem
                              key={comment.id}
                              comment={comment}
                              onUpdate={handleUpdateComment}
                              onDelete={handleDeleteComment}
                            />
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value='history' className='mt-0'>
                        <div className='space-y-4'>
                          {card.activities?.map((activity) => (
                            <div key={activity.id} className='flex gap-3 group'>
                              <div className='w-8 h-8 rounded-full bg-gray-200 flex-shrink-0' />
                              <div className='flex-1'>
                                <div className='text-gray-600'>
                                  <span className='font-medium text-gray-900'>
                                    {activity.author?.name || 'Anonymous'}
                                  </span>{' '}
                                  {activity.content}
                                </div>
                                <div className='text-sm text-gray-500'>
                                  {new Date(
                                    activity.createdAt
                                  ).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          ))}
                          {(!card.activities ||
                            card.activities.length === 0) && (
                            <div className='text-sm text-gray-500'>
                              Chưa có hoạt động nào.
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Sidebar */}
          <div className='w-56 border-l bg-gray-50 overflow-y-auto rounded-sm'>
            <div className='p-4 space-y-6'>
              <div className='space-y-2'>
                <h4 className='text-sm font-medium text-gray-500'>
                  Thêm vào thẻ
                </h4>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  size='sm'
                >
                  <Users className='w-4 h-4 mr-2' />
                  Thành viên
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  size='sm'
                >
                  <Tag className='w-4 h-4 mr-2' />
                  Nhãn
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  size='sm'
                >
                  <CheckSquare className='w-4 h-4 mr-2' />
                  Việc cần làm
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  size='sm'
                >
                  <Calendar className='w-4 h-4 mr-2' />
                  Ngày
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  size='sm'
                >
                  <Paperclip className='w-4 h-4 mr-2' />
                  Đính kèm
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  size='sm'
                >
                  <Image className='w-4 h-4 mr-2' />
                  Ảnh bìa
                </Button>
              </div>

              <div className='space-y-2'>
                <h4 className='text-sm font-medium text-gray-500'>Thao tác</h4>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  size='sm'
                >
                  <CopyPlus className='w-4 h-4 mr-2' />
                  Di chuyển
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  size='sm'
                >
                  <Copy className='w-4 h-4 mr-2' />
                  Sao chép
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  size='sm'
                >
                  <Share2 className='w-4 h-4 mr-2' />
                  Chia sẻ
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50'
                  size='sm'
                >
                  <Archive className='w-4 h-4 mr-2' />
                  Lưu trữ
                </Button>
              </div>

              <div className='space-y-2'>
                <h4 className='text-sm font-medium text-gray-500'>
                  Tiện ích bổ sung
                </h4>
                <div className='border rounded bg-white p-3 text-center'>
                  <Plus className='w-8 h-8 mx-auto mb-2 text-gray-400' />
                  <p className='text-sm text-gray-600'>
                    Thêm tiện ích bổ sung để có thêm các tính năng mới.
                  </p>
                  <Button variant='ghost' className='w-full mt-2' size='sm'>
                    Thêm tiện ích
                  </Button>
                </div>
              </div>

              <div className='space-y-2'>
                <h4 className='text-sm font-medium text-gray-500'>
                  Tự động hóa
                </h4>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  size='sm'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Thêm nút
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Close button */}
        {/* <Button
          variant='ghost'
          size='icon'
          className='absolute right-4 top-4 text-gray-500 hover:text-gray-700'
          onClick={onClose}
        >
          <X className='w-5 h-5' />
        </Button> */}
      </DialogContent>
    </Dialog>
  );
}
