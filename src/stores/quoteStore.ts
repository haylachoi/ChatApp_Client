import { MessageData } from '@/libs/types';
import { create } from 'zustand';

interface useQuoteStoreProps {
  quote?: MessageData;

  setQuote: (quote: MessageData | undefined) => void;
}

export const useQuoteStore = create<useQuoteStoreProps>()((set) => ({
  setQuote: (quote) => set({ quote }),
}));
