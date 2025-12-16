export type ChatType = "private" | "group";
export type MessageType = "text" | "image" | "video" | "file";
export type ObjectId = string;
export type ISODateString = string;

export interface ChatMember {
  _id: string;
  username: string;
  profilePic?: string;
}

export interface LastMessage {
  _id: string;
  sender: string; // userId
  text: string;
  createdAt: string;
}

export interface Chat {
  _id: string;
  isGroup: boolean;
  members: ChatMember[];
  groupName?: string | null;
  groupImage?: string;
  admins?: string[];
  createdBy?: string;
  lastMessage?: LastMessage | null;
  createdAt: string;
  updatedAt: string;
}

// ==============================
// API responses
// ==============================
export interface GetAllChatsResponse {
  message: string;
  data: Chat[];
}

export interface GetMessagesRequest {
    chatId: string;
 
}

export interface Sender {
  _id: ObjectId;
  username: string;
  email: string;
  profilePic: string | null;
  isVerified: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Messages {
  _id: string;
  chatId: string;
  sender: Sender;
  deliveredTo: ObjectId[];
  seenBy: ObjectId[];
  text: string | null;
  messageType: MessageType;
  mediaUrl: string | null;

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

export interface GetMessagesResponse {
  message: string;
  messages: Messages[];
  pagination:Pagination;
}
