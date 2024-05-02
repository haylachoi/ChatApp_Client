import { Reaction } from "@/libs/types";
import {create} from "zustand";

interface useReactionsStoreProps {
 reactions: Map<number, Reaction>
 setReactions: (reactions: Map<number,Reaction>) => void;   
}

export const useReactionsStore = create<useReactionsStoreProps>((set) => ({
    reactions: new Map<number, Reaction>(),
    setReactions: (reactions) => set({reactions})
}))