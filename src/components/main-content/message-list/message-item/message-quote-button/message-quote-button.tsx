import './message-quote-button.css';
import { MessageData } from '@/libs/types';
import { useQuoteStore } from '@/stores/quoteStore';
import { QuoteIcon } from 'lucide-react';
import React from 'react';

interface QuoteButtonProps {
  message: MessageData;
}
const QuoteButton: React.FC<QuoteButtonProps> = ({ message }) => {
  const setQuote = useQuoteStore((state) => state.setQuote);

  const handleSetQuote = (message: MessageData) => {
    setQuote(message);
  };
  return (
    <button
      className="quote-btn btn-none"
      onClick={() => handleSetQuote(message)}>
      <QuoteIcon fill="white" size={24} />
    </button>
  );
};

export default QuoteButton;
