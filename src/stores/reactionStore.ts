import { Reaction } from "@/libs/types";
import {create} from "zustand";

interface useReactionsStoreProps {
 reactions: Map<string, Reaction>
 setReactions: (reactions: Map<string,Reaction>) => void;   
}

export const useReactionsStore = create<useReactionsStoreProps>((set) => ({
    reactions: new Map<string, Reaction>(),
    setReactions: (reactions) => set({reactions})
}))