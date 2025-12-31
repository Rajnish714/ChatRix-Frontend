export type ObjectId = string;
export type ISODateString = string;

export type MessageType =
  | "text"
  | "image"
  | "gif"
  | "video"
  | "audio"
  | "file";


export interface ChatMember {
  _id: ObjectId;
  username: string;
  profilePic?: string | null;
}

export interface UserSummary {
  _id: ObjectId;
  username: string;
  email: string;
  profilePic: string | null;
  isVerified: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}


export interface LastMessage {
  _id: ObjectId;
  sender: ObjectId;
  text: string | null;
  messageType: MessageType;
  mediaUrl?: string | null;
  createdAt: ISODateString;
}


export interface Chat {
  _id: ObjectId;
  isGroup: boolean;

  members: ChatMember[];

  groupName?: string | null;
  groupImage?: string | null;

  admins?: ObjectId[];
  createdBy?: ObjectId;

  lastMessage?: LastMessage | null;

  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface MessageSender {
  _id: ObjectId;
  username: string;
  profilePic?: string | null;
}

export interface Messages {
  _id: ObjectId;
  chatId: ObjectId;

  sender: MessageSender;

  deliveredTo: ObjectId[];
  seenBy: ObjectId[];

  text: string | null;
  messageType: MessageType;
  mediaUrl?: string | null;

  createdAt: ISODateString;
  updatedAt: ISODateString;
}


export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
//--request-------------------
export interface GetMessagesRequest {
  chatId: ObjectId;
  page?: number;
  limit?: number;
}

export interface SearchRequest {
  q?: string;
  page?: number;
  limit?: number;
}


export interface AddGroupMembersParams {
  chatId: string;
}
export interface AddGroupMembersBody {
  members: string[];
}
//-----------------response----------
export interface GetAllChatsResponse {
  message: string;
  data: Chat[];
}

export interface GetMessagesResponse {
  message: string;
  messages: Messages[];
  pagination: Pagination;
}

//---------seachuser--------------
export type SearchUser = UserSummary;

export interface SearchGroup {
  _id: ObjectId;
  isGroup: true;

  groupName: string;
  groupImage: string;

  members: ChatMember[];
  admins: ChatMember[];

  createdBy: ObjectId;
  lastMessage?: LastMessage | null;

  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface SearchSidebarResponse {
  message: string;
  users: SearchUser[];
  groups: SearchGroup[];
  pagination: {
    users: Pagination;
    groups: Pagination;
  };
}

export interface PrivateChat {
  _id: ObjectId;
  isGroup: false;
  members: ChatMember[];
  groupName: null;
  groupImage?: string | null;
  admins: ObjectId[];
  lastMessage: LastMessage | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface GetOrCreatePrivateChatResponse {
  message: string;
  chat: PrivateChat;
}

export interface CreateGroupRequest {
  groupName: string;             
  members: string[];        
 imageUrl?: string | null;     
}

export interface SearchUsersResponse {
  message: string;
  users: SearchUser[];
  hasMore: boolean;
  pagination: Pagination;
}

