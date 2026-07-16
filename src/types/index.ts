export type MembershipTier = "free" | "silver" | "gold" | "lifetime";
export type MembershipStatus = "active" | "expired";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: "client" | "admin";
  avatarUrl?: string;
  createdAt: string;
  membershipTier: MembershipTier;
  membershipExpiry?: string; // e.g. "2026-08-16" or "never"
  membershipStatus?: MembershipStatus;
  phone?: string;
}

export interface PurchaseRecord {
  id: string;
  userId: string;
  itemType: "membership" | "video" | "ebook";
  itemId: string; // e.g. "silver", "gold", "lifetime", "v1", "eb1"
  itemName: string;
  amount: number;
  paymentMethod: string;
  status: "pending" | "success" | "failed";
  createdAt: string;
  orderId: string;
}

export type CounselingCategory = "Pernikahan" | "Pasangan" | "Pranikah";

export interface CounselingSession {
  id: string;
  clientId: string;
  category: CounselingCategory;
  date: string;
  timeSlot: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "failed";
  paymentUrl?: string;
  createdAt: string;
  type?: "online" | "offline";
  platform?: "google-meet" | "zoom" | "offline-location";
  timezone?: string;
  meetingLink?: string;
  reminderSent?: boolean;
  emailSent?: boolean;
  address?: string;
}

export interface PremiumVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  isUnlocked: boolean;
  price: number;
}

export interface PremiumEbook {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  downloadUrl?: string;
  price: number;
  isUnlocked: boolean;
}

export interface PsychologyArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  coverUrl: string;
  status?: "draft" | "published";
  isPremium?: boolean;
  tags?: string[];
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface ForumPost {
  id: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  replies: ForumReply[];
  createdAt: string;
  isPremium?: boolean;
  likedBy?: string[];
  bookmarkedBy?: string[];
  isPinned?: boolean;
  isHidden?: boolean;
  reports?: { id: string; authorName: string; reason: string; createdAt: string }[];
}

export interface ForumReply {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likedBy?: string[];
  reports?: { id: string; authorName: string; reason: string; createdAt: string }[];
}
