import {create} from "zustand";

interface useEmotionsProps {
 emotions: Map<number, Emotion>
 setEmotions: (emotions: Map<number,Emotion>) => void;   
}

export const useEmotions = create<useEmotionsProps>((set) => ({
    emotions: new Map<number, Emotion>(),
    setEmotions: (emotions) => set({emotions})
}))