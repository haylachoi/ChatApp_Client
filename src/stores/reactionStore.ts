import { Reaction, ReactionIdType } from '@/libs/types';
import { create } from 'zustand';

interface useReactionsStoreProps {
  reactions: {
    reactionArray: Reaction[];
    reactionMap: Map<ReactionIdType, Reaction>;
  };
  setReactions: (reactions: {
    reactionArray: Reaction[];
    reactionMap: Map<ReactionIdType, Reaction>;
  }) => void;
}

export const useReactionsStore = create<useReactionsStoreProps>((set) => ({
  reactions: {
    reactionArray: [],
    reactionMap: new Map<ReactionIdType, Reaction>(),
  },
  setReactions: (reactions) => set({ reactions }),
}));
