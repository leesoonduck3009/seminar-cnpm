// store/useBoardStore.ts
import { Board } from "@/types/board";
import { Card, Label, Activity } from "@/types/card";
import { Column } from "@/types/column";
import { BoardMember, User } from "@/types/user";
import React from "react";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface BoardState {
  boards: Board[];
  activeBoard: Board | null;
  isLoading: boolean;
  error: string | null;
  hydrated: boolean;

  setHydrated: (state: boolean) => void;
  setActiveBoard: (board: Board | null) => void;
  setActiveBoardById: (boardId: number | null) => void;

  // Board Actions
  addBoard: (boardData: Partial<Board>) => Board;
  updateBoard: (boardId: number, data: Partial<Board>) => void;
  deleteBoard: (boardId: number) => void;
  toggleBoardStar: (boardId: number) => void;
  getBoardById: (boardId: number) => Board | undefined;
  //   setActiveBoardById: (boardId: number | null) => void;

  // Column Actions
  addColumn: (boardId: number, title: string) => void;
  updateColumn: (
    boardId: number,
    columnId: string,
    data: Partial<Column>
  ) => void;
  deleteColumn: (boardId: number, columnId: string) => void;
  moveColumn: (
    boardId: number,
    sourceIndex: number,
    destinationIndex: number
  ) => void;

  // Card Actions
  addCard: (boardId: number, columnId: string, cardData: Partial<Card>) => void;
  updateCard: (
    boardId: number,
    columnId: string,
    cardId: string,
    data: Partial<Card>
  ) => void;
  deleteCard: (boardId: number, columnId: string, cardId: string) => void;
  moveCard: (
    boardId: number,
    sourceColumnId: string,
    destinationColumnId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => void;
  archiveCard: (boardId: number, columnId: string, cardId: string) => void;
  restoreCard: (boardId: number, columnId: string, cardId: string) => void;

  // Member Actions
  inviteMember: (
    boardId: number,
    email: string,
    role: "admin" | "normal"
  ) => Promise<void>;
  updateMemberRole: (
    boardId: number,
    memberId: string,
    role: "admin" | "normal"
  ) => Promise<void>;
  removeMember: (boardId: number, memberId: string) => Promise<void>;

  // Card Member Actions
  addCardMember: (
    boardId: number,
    columnId: string,
    cardId: string,
    userId: string
  ) => void;
  removeCardMember: (
    boardId: number,
    columnId: string,
    cardId: string,
    userId: string
  ) => void;

  // Label Actions
  addLabel: (boardId: number, label: { name: string; color: string }) => void;
  updateLabel: (
    boardId: number,
    labelId: string,
    data: { name?: string; color?: string }
  ) => void;
  deleteLabel: (boardId: number, labelId: string) => void;

  // Comment Actions
  addComment: (
    boardId: number,
    columnId: string,
    cardId: string,
    content: string,
    author: User
  ) => void;
  updateComment: (
    boardId: number,
    columnId: string,
    cardId: string,
    commentId: string,
    content: string
  ) => void;
  deleteComment: (
    boardId: number,
    columnId: string,
    cardId: string,
    commentId: string
  ) => void;
}

const useBoardStore = create<BoardState>()(
  devtools(
    persist(
      (set, get) => ({
        boards: [],
        activeBoard: null,
        isLoading: false,
        error: null,
        hydrated: false,

        setHydrated: (state) => set({ hydrated: state }),

        setActiveBoard: (board) => set({ activeBoard: board }),

        setActiveBoardById: (boardId) => {
          if (!boardId) {
            set({ activeBoard: null });
            return;
          }

          const board = get().boards.find((b) => b.id === boardId);
          set({ activeBoard: board || null });
        },

        addBoard: (boardData) => {
          set({ isLoading: true, error: null });
          try {
            const newBoard: Board = {
              id: Date.now(),
              title: boardData.title || "Untitled Board",
              visibility: "private",
              starred: false,
              members: [],
              columns: [],
              labels: [
                { id: "label-1", name: "High Priority", color: "#ef4444" },
                { id: "label-2", name: "Medium Priority", color: "#f59e0b" },
                { id: "label-3", name: "Low Priority", color: "#10b981" },
              ],
              createdBy: "current-user-id",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ...boardData,
            };

            set((state) => ({
              boards: [...state.boards, newBoard],
              activeBoard: newBoard,
              isLoading: false,
            }));

            return newBoard;
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            throw error;
          }
        },

        updateBoard: (boardId, data) => {
          set((state) => ({
            boards: state.boards.map((board) =>
              board.id === boardId
                ? { ...board, ...data, updatedAt: new Date().toISOString() }
                : board
            ),
            activeBoard:
              state.activeBoard?.id === boardId
                ? {
                    ...state.activeBoard,
                    ...data,
                    updatedAt: new Date().toISOString(),
                  }
                : state.activeBoard,
          }));
        },

        deleteBoard: (boardId) => {
          set((state) => ({
            boards: state.boards.filter((board) => board.id !== boardId),
            activeBoard:
              state.activeBoard?.id === boardId ? null : state.activeBoard,
          }));
        },

        toggleBoardStar: (boardId) => {
          set((state) => ({
            boards: state.boards.map((board) =>
              board.id === boardId
                ? { ...board, starred: !board.starred }
                : board
            ),
            activeBoard:
              state.activeBoard?.id === boardId
                ? { ...state.activeBoard, starred: !state.activeBoard.starred }
                : state.activeBoard,
          }));
        },

        getBoardById: (boardId) => {
          return get().boards.find((board) => board.id === boardId);
        },

        addColumn: (boardId, title) => {
          const newColumn: Column = {
            id: `column-${Date.now()}`,
            title,
            cards: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            boards: state.boards.map((board) =>
              board.id === boardId
                ? { ...board, columns: [...board.columns, newColumn] }
                : board
            ),
            activeBoard:
              state.activeBoard?.id === boardId
                ? {
                    ...state.activeBoard,
                    columns: [...state.activeBoard.columns, newColumn],
                  }
                : state.activeBoard,
          }));
        },

        updateColumn: (boardId, columnId, data) => {
          set((state) => ({
            boards: state.boards.map((board) =>
              board.id === boardId
                ? {
                    ...board,
                    columns: board.columns.map((column) =>
                      column.id === columnId
                        ? {
                            ...column,
                            ...data,
                            updatedAt: new Date().toISOString(),
                          }
                        : column
                    ),
                  }
                : board
            ),
            activeBoard:
              state.activeBoard?.id === boardId
                ? {
                    ...state.activeBoard,
                    columns: state.activeBoard.columns.map((column) =>
                      column.id === columnId
                        ? {
                            ...column,
                            ...data,
                            updatedAt: new Date().toISOString(),
                          }
                        : column
                    ),
                  }
                : state.activeBoard,
          }));
        },

        deleteColumn: (boardId, columnId) => {
          set((state) => ({
            boards: state.boards.map((board) =>
              board.id === boardId
                ? {
                    ...board,
                    columns: board.columns.filter(
                      (column) => column.id !== columnId
                    ),
                  }
                : board
            ),
            activeBoard:
              state.activeBoard?.id === boardId
                ? {
                    ...state.activeBoard,
                    columns: state.activeBoard.columns.filter(
                      (column) => column.id !== columnId
                    ),
                  }
                : state.activeBoard,
          }));
        },

        moveColumn: (boardId, sourceIndex, destinationIndex) => {
          set((state) => {
            const board = state.boards.find((b) => b.id === boardId);
            if (!board) return state;

            const newColumns = Array.from(board.columns);
            const [removed] = newColumns.splice(sourceIndex, 1);
            newColumns.splice(destinationIndex, 0, removed);

            return {
              boards: state.boards.map((b) =>
                b.id === boardId ? { ...b, columns: newColumns } : b
              ),
              activeBoard:
                state.activeBoard?.id === boardId
                  ? { ...state.activeBoard, columns: newColumns }
                  : state.activeBoard,
            };
          });
        },

        addCard: (boardId, columnId, cardData) => {
          const newCard: Card = {
            id: `card-${Date.now()}`,
            title: cardData.title || "",
            description: "",
            labels: [],
            attachments: [],
            comments: [],
            activities: [],
            members: [],
            isArchived: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: "current-user-id",
            ...cardData,
          };

          set((state) => {
            const updateColumns = (columns: Column[]) =>
              columns.map((column) =>
                column.id === columnId
                  ? { ...column, cards: [...column.cards, newCard] }
                  : column
              );

            return {
              boards: state.boards.map((board) =>
                board.id === boardId
                  ? { ...board, columns: updateColumns(board.columns) }
                  : board
              ),
              activeBoard:
                state.activeBoard?.id === boardId
                  ? {
                      ...state.activeBoard,
                      columns: updateColumns(state.activeBoard.columns),
                    }
                  : state.activeBoard,
            };
          });
        },

        updateCard: (
          boardId: number,
          columnId: string,
          cardId: string,
          data: Partial<Card>
        ) => {
          set((state) => {
            const updateColumns = (columns: Column[]) =>
              columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      cards: column.cards.map((card) =>
                        card.id === cardId ? { ...card, ...data } : card
                      ),
                    }
                  : column
              );

            const updatedBoards = state.boards.map((board) =>
              board.id === boardId
                ? { ...board, columns: updateColumns(board.columns) }
                : board
            );

            return {
              boards: updatedBoards,
              activeBoard:
                state.activeBoard?.id === boardId
                  ? {
                      ...state.activeBoard,
                      columns: updateColumns(state.activeBoard.columns),
                    }
                  : state.activeBoard,
            };
          });
        },

        deleteCard: (boardId, columnId, cardId) => {
          set((state) => {
            const updateColumns = (columns: Column[]) =>
              columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      cards: column.cards.filter((card) => card.id !== cardId),
                    }
                  : column
              );

            return {
              boards: state.boards.map((board) =>
                board.id === boardId
                  ? { ...board, columns: updateColumns(board.columns) }
                  : board
              ),
              activeBoard:
                state.activeBoard?.id === boardId
                  ? {
                      ...state.activeBoard,
                      columns: updateColumns(state.activeBoard.columns),
                    }
                  : state.activeBoard,
            };
          });
        },

        moveCard: (
          boardId,
          sourceColumnId,
          destinationColumnId,
          sourceIndex,
          destinationIndex
        ) => {
          set((state) => {
            const board = state.boards.find((b) => b.id === boardId);
            if (!board) return state;

            const newBoard = { ...board };
            const sourceColumn = newBoard.columns.find(
              (c) => c.id === sourceColumnId
            );
            const destinationColumn = newBoard.columns.find(
              (c) => c.id === destinationColumnId
            );

            if (!sourceColumn || !destinationColumn) return state;

            // Create a copy of the card to be moved
            const [movedCard] = sourceColumn.cards.splice(sourceIndex, 1);

            // Add activity for the move
            const activity: Activity = {
              id: `activity-${Date.now()}`,
              type: "move",
              content:
                sourceColumnId === destinationColumnId
                  ? "reordered this card"
                  : `moved from ${sourceColumn.title} to ${destinationColumn.title}`,
              createdAt: new Date().toISOString(),
              author: {
                id: "current-user-id",
                name: "Current User",
                email: "current-user",
              },
            };

            movedCard.activities = [...movedCard.activities, activity];
            destinationColumn.cards.splice(destinationIndex, 0, movedCard);

            return {
              boards: state.boards.map((b) =>
                b.id === boardId ? newBoard : b
              ),
              activeBoard:
                state.activeBoard?.id === boardId
                  ? newBoard
                  : state.activeBoard,
            };
          });
        },

        archiveCard: (boardId, columnId, cardId) => {
          const activity: Activity = {
            id: `activity-${Date.now()}`,
            type: "archive",
            content: "archived this card",
            createdAt: new Date().toISOString(),
            author: {
              id: "current-user-id",
              name: "Current User",
              email: "current-user",
            },
          };

          set((state) => {
            const updateColumns = (columns: Column[]) =>
              columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      cards: column.cards.map((card) =>
                        card.id === cardId
                          ? {
                              ...card,
                              isArchived: true,
                              activities: [...card.activities, activity],
                              updatedAt: new Date().toISOString(),
                            }
                          : card
                      ),
                    }
                  : column
              );

            return {
              boards: state.boards.map((board) =>
                board.id === boardId
                  ? { ...board, columns: updateColumns(board.columns) }
                  : board
              ),
              activeBoard:
                state.activeBoard?.id === boardId
                  ? {
                      ...state.activeBoard,
                      columns: updateColumns(state.activeBoard.columns),
                    }
                  : state.activeBoard,
            };
          });
        },

        restoreCard: (boardId, columnId, cardId) => {
          const activity: Activity = {
            id: `activity-${Date.now()}`,
            type: "restore",
            content: "restored this card",
            createdAt: new Date().toISOString(),
            author: {
              id: "current-user-id",
              name: "Current User",
              email: "current-user",
            },
          };

          set((state) => {
            const updateColumns = (columns: Column[]) =>
              columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      cards: column.cards.map((card) =>
                        card.id === cardId
                          ? {
                              ...card,
                              isArchived: false,
                              activities: [...card.activities, activity],
                              updatedAt: new Date().toISOString(),
                            }
                          : card
                      ),
                    }
                  : column
              );

            return {
              boards: state.boards.map((board) =>
                board.id === boardId
                  ? { ...board, columns: updateColumns(board.columns) }
                  : board
              ),
              activeBoard:
                state.activeBoard?.id === boardId
                  ? {
                      ...state.activeBoard,
                      columns: updateColumns(state.activeBoard.columns),
                    }
                  : state.activeBoard,
            };
          });
        },

        inviteMember: async (boardId, email, role) => {
          try {
            set({ isLoading: true, error: null });
            const response = await fetch(`/api/boards/${boardId}/members`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, role }),
            });

            if (!response.ok) throw new Error("Failed to invite member");
            const newMember: BoardMember = await response.json();

            set((state) => ({
              boards: state.boards.map((board) =>
                board.id === boardId
                  ? { ...board, members: [...board.members, newMember] }
                  : board
              ),
              activeBoard:
                state.activeBoard?.id === boardId
                  ? {
                      ...state.activeBoard,
                      members: [...state.activeBoard.members, newMember],
                    }
                  : state.activeBoard,
            }));
          } catch (error) {
            set({ error: (error as Error).message });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        updateMemberRole: async (boardId, memberId, role) => {
          try {
            set({ isLoading: true, error: null });
            const response = await fetch(
              `/api/boards/${boardId}/members/${memberId}`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
              }
            );

            if (!response.ok) throw new Error("Failed to update member role");

            set((state) => ({
              boards: state.boards.map((board) =>
                board.id === boardId
                  ? {
                      ...board,
                      members: board.members.map((member) =>
                        member.id === memberId ? { ...member, role } : member
                      ),
                    }
                  : board
              ),
              activeBoard:
                state.activeBoard?.id === boardId
                  ? {
                      ...state.activeBoard,
                      members: state.activeBoard.members.map((member) =>
                        member.id === memberId ? { ...member, role } : member
                      ),
                    }
                  : state.activeBoard,
            }));
          } catch (error) {
            set({ error: (error as Error).message });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },
        removeMember: async (boardId, memberId) => {
          try {
            set({ isLoading: true, error: null });
            const response = await fetch(
              `/api/boards/${boardId}/members/${memberId}`,
              {
                method: "DELETE",
              }
            );

            if (!response.ok) throw new Error("Failed to remove member");

            set((state) => {
              const updateBoard = (board: Board) => ({
                ...board,
                members: board.members.filter((m) => m.id !== memberId),
                columns: board.columns.map((column) => ({
                  ...column,
                  cards: column.cards.map((card) => ({
                    ...card,
                    members: card.members.filter((m) => m.id !== memberId),
                  })),
                })),
              });

              return {
                boards: state.boards.map((board) =>
                  board.id === boardId ? updateBoard(board) : board
                ),
                activeBoard:
                  state.activeBoard?.id === boardId
                    ? updateBoard(state.activeBoard)
                    : state.activeBoard,
              };
            });
          } catch (error) {
            set({ error: (error as Error).message });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        addCardMember: (boardId, columnId, cardId, userId) => {
          set((state) => {
            const board = state.boards.find((b) => b.id === boardId);
            if (!board) return state;

            const member = board.members.find((m) => m.id === userId);
            if (!member) return state;

            const activity: Activity = {
              id: `activity-${Date.now()}`,
              type: "update",
              content: `added ${member.name} to this card`,
              createdAt: new Date().toISOString(),
              author: {
                id: "current-user-id",
                name: "Current User",
                email: "current-user",
              },
            };

            const updateColumns = (columns: Column[]) =>
              columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      cards: column.cards.map((card) =>
                        card.id === cardId
                          ? {
                              ...card,
                              members: [...card.members, member],
                              activities: [...card.activities, activity],
                              updatedAt: new Date().toISOString(),
                            }
                          : card
                      ),
                    }
                  : column
              );

            return {
              boards: state.boards.map((b) =>
                b.id === boardId
                  ? { ...b, columns: updateColumns(b.columns) }
                  : b
              ),
              activeBoard:
                state.activeBoard?.id === boardId
                  ? {
                      ...state.activeBoard,
                      columns: updateColumns(state.activeBoard.columns),
                    }
                  : state.activeBoard,
            };
          });
        },

        removeCardMember: (boardId, columnId, cardId, userId) => {
          set((state) => {
            const board = state.boards.find((b) => b.id === boardId);
            if (!board) return state;

            const member = board.members.find((m) => m.id === userId);
            if (!member) return state;

            const activity: Activity = {
              id: `activity-${Date.now()}`,
              type: "update",
              content: `removed ${member.name} from this card`,
              createdAt: new Date().toISOString(),
              author: {
                id: "current-user-id",
                name: "Current User",
                email: "current-user",
              },
            };

            const updateColumns = (columns: Column[]) =>
              columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      cards: column.cards.map((card) =>
                        card.id === cardId
                          ? {
                              ...card,
                              members: card.members.filter(
                                (m) => m.id !== userId
                              ),
                              activities: [...card.activities, activity],
                              updatedAt: new Date().toISOString(),
                            }
                          : card
                      ),
                    }
                  : column
              );

            return {
              boards: state.boards.map((b) =>
                b.id === boardId
                  ? { ...b, columns: updateColumns(b.columns) }
                  : b
              ),
              activeBoard:
                state.activeBoard?.id === boardId
                  ? {
                      ...state.activeBoard,
                      columns: updateColumns(state.activeBoard.columns),
                    }
                  : state.activeBoard,
            };
          });
        },

        addComment: (
          boardId: number,
          columnId: string,
          cardId: string,
          content: string,
          author: User
        ) => {
          const newComment = {
            id: `comment-${Date.now()}`,
            content,
            author,
            createdAt: new Date().toISOString(),
          };

          const activity: Activity = {
            id: `activity-${Date.now()}`,
            type: "comment",
            content: "added a comment",
            createdAt: new Date().toISOString(),
            author,
          };

          set((state) => {
            const updateColumns = (columns: Column[]) =>
              columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      cards: column.cards.map((card) =>
                        card.id === cardId
                          ? {
                              ...card,
                              comments: [...(card.comments || []), newComment],
                              activities: [
                                ...(card.activities || []),
                                activity,
                              ],
                              updatedAt: new Date().toISOString(),
                            }
                          : card
                      ),
                    }
                  : column
              );

            const updatedBoards = state.boards.map((board) =>
              board.id === boardId
                ? { ...board, columns: updateColumns(board.columns) }
                : board
            );

            const updatedActiveBoard =
              state.activeBoard?.id === boardId
                ? {
                    ...state.activeBoard,
                    columns: updateColumns(state.activeBoard.columns),
                  }
                : state.activeBoard;

            return {
              boards: updatedBoards,
              activeBoard: updatedActiveBoard,
            };
          });
        },

        updateComment: (boardId, columnId, cardId, commentId, content) => {
          set((state) => {
            const updateColumns = (columns: Column[]) =>
              columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      cards: column.cards.map((card) =>
                        card.id === cardId
                          ? {
                              ...card,
                              comments: card.comments.map((comment) =>
                                comment.id === commentId
                                  ? {
                                      ...comment,
                                      content,
                                      updatedAt: new Date().toISOString(),
                                    }
                                  : comment
                              ),
                              updatedAt: new Date().toISOString(),
                            }
                          : card
                      ),
                    }
                  : column
              );

            return {
              boards: state.boards.map((board) =>
                board.id === boardId
                  ? { ...board, columns: updateColumns(board.columns) }
                  : board
              ),
              activeBoard:
                state.activeBoard?.id === boardId
                  ? {
                      ...state.activeBoard,
                      columns: updateColumns(state.activeBoard.columns),
                    }
                  : state.activeBoard,
            };
          });
        },

        deleteComment: (boardId, columnId, cardId, commentId) => {
          set((state) => {
            const updateColumns = (columns: Column[]) =>
              columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      cards: column.cards.map((card) =>
                        card.id === cardId
                          ? {
                              ...card,
                              comments: card.comments.filter(
                                (c) => c.id !== commentId
                              ),
                              updatedAt: new Date().toISOString(),
                            }
                          : card
                      ),
                    }
                  : column
              );

            return {
              boards: state.boards.map((board) =>
                board.id === boardId
                  ? { ...board, columns: updateColumns(board.columns) }
                  : board
              ),
              activeBoard:
                state.activeBoard?.id === boardId
                  ? {
                      ...state.activeBoard,
                      columns: updateColumns(state.activeBoard.columns),
                    }
                  : state.activeBoard,
            };
          });
        },

        addLabel: (boardId, label) => {
          const newLabel = {
            id: `label-${Date.now()}`,
            name: label.name,
            color: label.color,
          };

          set((state) => {
            const updateBoard = (board: Board) => ({
              ...board,
              labels: [...board.labels, newLabel],
            });

            return {
              boards: state.boards.map((board) =>
                board.id === boardId ? updateBoard(board) : board
              ),
              activeBoard:
                state.activeBoard?.id === boardId
                  ? updateBoard(state.activeBoard)
                  : state.activeBoard,
            };
          });
        },

        updateLabel: (boardId, labelId, data) => {
          set((state) => {
            const updateBoard = (board: Board) => ({
              ...board,
              labels: board.labels.map((label) =>
                label.id === labelId ? { ...label, ...data } : label
              ),
              columns: board.columns.map((column) => ({
                ...column,
                cards: column.cards.map((card) => ({
                  ...card,
                  labels: card.labels.map((label) =>
                    label.id === labelId ? { ...label, ...data } : label
                  ),
                })),
              })),
            });

            return {
              boards: state.boards.map((board) =>
                board.id === boardId ? updateBoard(board) : board
              ),
              activeBoard:
                state.activeBoard?.id === boardId
                  ? updateBoard(state.activeBoard)
                  : state.activeBoard,
            };
          });
        },

        deleteLabel: (boardId, labelId) => {
          set((state) => {
            const updateBoard = (board: Board) => ({
              ...board,
              labels: board.labels.filter((label) => label.id !== labelId),
              columns: board.columns.map((column) => ({
                ...column,
                cards: column.cards.map((card) => ({
                  ...card,
                  labels: card.labels.filter((label) => label.id !== labelId),
                })),
              })),
            });

            return {
              boards: state.boards.map((board) =>
                board.id === boardId ? updateBoard(board) : board
              ),
              activeBoard:
                state.activeBoard?.id === boardId
                  ? updateBoard(state.activeBoard)
                  : state.activeBoard,
            };
          });
        },
      }),
      {
        name: "board-storage",
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
          state?.setHydrated(true);
        },
      }
    )
  )
);

export const useHydrateStore = () => {
  const hydrated = useBoardStore((state) => state.hydrated);
  const setHydrated = useBoardStore((state) => state.setHydrated);

  React.useEffect(() => {
    setHydrated(true);
  }, [setHydrated]);

  return hydrated;
};

// Selector hooks for better performance
export const useBoardById = (boardId: number) =>
  useBoardStore((state) => state.boards.find((board) => board.id === boardId));

export const useActiveBoard = () => useBoardStore((state) => state.activeBoard);

export const useBoardUI = () =>
  useBoardStore((state) => ({
    isLoading: state.isLoading,
    error: state.error,
  }));

export const useBoardActions = () => {
  const store = useBoardStore();
  return {
    addBoard: store.addBoard,
    updateBoard: store.updateBoard,
    deleteBoard: store.deleteBoard,
    toggleBoardStar: store.toggleBoardStar,
    setActiveBoardById: store.setActiveBoardById,
  };
};

export default useBoardStore;
