import { ReactionIdType } from "@/libs/types";
import { useReactionsStore } from "@/stores/reactionStore";
import { Ban, LucideIcon } from "lucide-react";
import React from "react";

export const ReactionIcon = ({id}: {id: ReactionIdType | undefined}) => {
    const {reactionArray, reactionMap} = useReactionsStore( (state) => state.reactions);
    let Icon: LucideIcon;
    if (!id) {
      Icon = reactionArray[0].icon;
    } else {
    Icon = reactionMap.get(id)?.icon ?? Ban;
  }
  
  return (
    <Icon className="reaction-icon">      
    </Icon>
  )
}