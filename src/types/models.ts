import type { GeoPoint, Timestamp } from "firebase/firestore";

/** The two kinds of accounts in the app. */
export type UserType = "donor" | "recipient";

/** Donors create "offering" posts; recipients create "request" posts. */
export type PostType = "offering" | "request";

/** Lifecycle of a post. New posts start "available". */
export type PostStatus = "available" | "claimed" | "completed";

/** A location stored the way Firestore + geofire need it. */
export interface GeoLocation {
  geoPoint: GeoPoint;
  geohash: string;
}

/** Fields shared by every user profile document. */
export interface BaseProfile extends GeoLocation {
  email: string;
  phone: string;
  address: string;
  userType: UserType;
  createdAt: string;
}

/** A restaurant/donor profile (Firestore `donors/{uid}`). */
export interface DonorProfile extends BaseProfile {
  userType: "donor";
  restaurantName: string;
}

/** An NGO/recipient profile (Firestore `recipients/{uid}`). */
export interface RecipientProfile extends BaseProfile {
  userType: "recipient";
  fullName: string;
  organization?: string | null;
  darpanId?: string;
  foodPreferences?: string[];
}

export type UserProfile = DonorProfile | RecipientProfile;

/** Contact/name info enriched onto a post from its creator's profile. */
export interface PostUserInfo {
  name: string;
  phone: string;
  geoPoint: GeoPoint;
}

/** A food post (Firestore `posts/{id}`). */
export interface Post extends GeoLocation {
  id: string;
  creatorId: string;
  userType: UserType;
  postType: PostType;
  status: PostStatus;
  foodName: string;
  description: string;
  quantity: string;
  expirationDate?: Timestamp;
  imageUrl?: string | null;
  createdAt: Timestamp;
  /** Populated client-side after fetching the creator's profile. */
  userInfo?: PostUserInfo;
}

/** Firestore collection names, kept in one place to avoid typo'd magic strings. */
export const COLLECTIONS = {
  donors: "donors",
  recipients: "recipients",
  posts: "posts",
} as const;

/** Maps a user type to the Firestore collection its profile lives in. */
export const profileCollectionFor = (userType: UserType): string =>
  userType === "donor" ? COLLECTIONS.donors : COLLECTIONS.recipients;
