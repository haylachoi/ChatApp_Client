import { useReactionsStore } from "@/stores/reactionStore";
import { Ban, LucideIcon } from "lucide-react";
import React from "react";

export const ReactionIcon = ({id}: {id: string | undefined}) => {
    const { reactions } = useReactionsStore();

  let Icon: LucideIcon;
  if (!id) {
    Icon = reactions.entries().next().value[1].icon;
  } else {
    Icon = reactions.get(id)?.icon ?? Ban;
  }
  
  
  return (
    <Icon className="reaction-icon">      
    </Icon>
  )
}