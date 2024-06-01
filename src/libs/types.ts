import { LucideIcon } from "lucide-react";


export interface AuthToken {
    accessToken: string;
    refreshToken: string
}

export interface User {
    id: UserIdType;  
    fullname: string;
    avatar: string | undefined;
    isOnline: boolean;
}
export interface Profile extends User{
    email: string;   
}

export interface MessageData {
    id: MessageIdType;
    content: string;
    senderId: UserIdType;
    isImage: boolean;
    roomId: RoomIdType;
    createdAt: string | undefined;
    messageDetails: MessageDetail[];
    quote?: MessageData;
}
export interface MessageDetail {
    id: MessageDetailIdType;
    userId: UserIdType;
    messageId: MessageIdType;
    roomId: RoomIdType;
    reactionId?: ReactionIdType;
    user: User
}

export interface GroupInfo {
    id: GroupIdType;
    name: string;
    avatar?: string;
    groupOwner: User;
}
export interface RawRoom {  
    id: RoomIdType;    
    isGroup: boolean;   
    lastMessage?: MessageData;
    firstMessageId?: MessageIdType;
    roomMemberInfos: RoomMemberInfo[];
    groupInfo?: GroupInfo;
}
export interface RoomData extends Omit<RawRoom, "roomMemberInfos"> {
    currentRoomMemberInfo: RoomMemberInfo;
    otherRoomMemberInfos: RoomMemberInfo[];
    chats?: MessageData[];
    previousLastMessageId?: MessageIdType;  
    name?: string;
    avatar?: string;
    isFetched?: boolean;
}

export interface RoomMemberInfo {  
    roomId: RoomIdType;
    user: User;
    firstUnseenMessageId?: MessageIdType;
    unseenMessageCount: number;
    canDisplayRoom: boolean;
    canShowNotification: boolean;
}
export interface Reaction {
    id: ReactionIdType;
    name: string;
    icon: LucideIcon;
}

export interface NoDataHubResponse {
    isSuccess: boolean;
    error: any;
}

export interface HubResponse<T> {
    isSuccess: boolean;
    data: T;
    error?: any;
}

export type RoomIdType = number
export type MessageIdType = number;
export type ReactionIdType = number;
export type UserIdType = number;
export type GroupIdType = number;
export type MessageDetailIdType = number;