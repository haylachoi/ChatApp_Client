import { Reaction } from '@/libs/types';
import { create } from 'zustand';

interface useReactionsStoreProps {
  reactions: {
    reactionArray: Reaction[];
    reactionMap: Map<string, Reaction>;
  };
  setReactions: (reactions: {
    reactionArray: Reaction[];
    reactionMap: Map<string, Reaction>;
  }) => void;
}

export const useReactionsStore = create<useReactionsStoreProps>((set) => ({
  reactions: {
    reactionArray: [],
    reactionMap: new Map<string, Reaction>(),
  },
  setReactions: (reactions) => set({ reactions }),
}));
